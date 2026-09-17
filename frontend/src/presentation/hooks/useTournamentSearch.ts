import { useEffect, useState } from "react";
import {
    EMPTY_SEARCH_RESULT,
    isRemoteSearchQuery,
    type TournamentSearchResult,
} from "@/application/useCases/SearchTournamentsUseCase";
import type { Subscription } from "@/domain/entities/Subscription";
import { container } from "@/main/container";
import { formatError } from "@/presentation/formatters/error";

/** Waits for the user to stop typing before hitting chess-results.com. */
const SEARCH_DEBOUNCE_MS = 400;

export type SearchStatus = "loading" | "ready" | "error";

interface SettledSearch {
    query: string;
    result: TournamentSearchResult;
    error: string | null;
}

interface UseTournamentSearchOptions {
    subscriptions: Subscription[];
    subscribe: (tournamentLink: string) => Promise<void>;
}

export function useTournamentSearch({
    subscriptions,
    subscribe,
}: UseTournamentSearchOptions) {
    const [query, setQuery] = useState("");
    const [attempt, setAttempt] = useState(0);
    const [settled, setSettled] = useState<SettledSearch>({
        query: "",
        result: EMPTY_SEARCH_RESULT,
        error: null,
    });
    const [submittingUrl, setSubmittingUrl] = useState<string | null>(null);
    const [subscribeError, setSubscribeError] = useState<{
        url: string;
        message: string;
    } | null>(null);

    useEffect(() => {
        // Responses for an outdated query are dropped once it changes.
        let isCurrent = true;

        const timeout = setTimeout(
            async () => {
                try {
                    const result = await container.searchTournaments.execute(
                        query,
                        subscriptions,
                    );

                    if (isCurrent) {
                        setSettled({ query, result, error: null });
                    }
                } catch (error) {
                    if (isCurrent) {
                        setSettled({
                            query,
                            result: EMPTY_SEARCH_RESULT,
                            error: formatError(error),
                        });
                    }
                }
            },
            isRemoteSearchQuery(query) ? SEARCH_DEBOUNCE_MS : 0,
        );

        return () => {
            isCurrent = false;
            clearTimeout(timeout);
        };
    }, [query, attempt]);

    const isSettled = settled.query === query;
    const status: SearchStatus = !isSettled
        ? "loading"
        : settled.error
          ? "error"
          : "ready";
    const results = isSettled ? settled.result : EMPTY_SEARCH_RESULT;

    const changeQuery = (value: string) => {
        setQuery(value);
        setSubscribeError(null);
    };

    const clear = () => changeQuery("");

    const retry = () => {
        setSettled((current) => ({ ...current, query: "" }));
        setAttempt((current) => current + 1);
    };

    /** Subscribes to a tournament. Resolves true when it succeeded. */
    const subscribeTo = async (url: string): Promise<boolean> => {
        if (submittingUrl) {
            return false;
        }

        setSubmittingUrl(url);
        setSubscribeError(null);

        try {
            await subscribe(url);
            setQuery("");
            return true;
        } catch (error) {
            setSubscribeError({ url, message: formatError(error) });
            return false;
        } finally {
            setSubmittingUrl(null);
        }
    };

    /** Subscribes to the pasted link. Resolves true when it succeeded. */
    const subscribeToLink = async (): Promise<boolean> => {
        const { link } = results;

        if (!link || link.subscription) {
            return false;
        }

        return subscribeTo(link.href);
    };

    return {
        query,
        results,
        status,
        searchError: isSettled ? settled.error : null,
        submittingUrl,
        subscribeError,
        changeQuery,
        clear,
        retry,
        subscribeTo,
        subscribeToLink,
    };
}
