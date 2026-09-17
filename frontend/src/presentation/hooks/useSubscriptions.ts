import { useState } from "react";
import type { Subscription } from "@/domain/entities/Subscription";
import { UnauthorizedError } from "@/domain/errors/DomainError";
import { container } from "@/main/container";
import { formatError } from "@/presentation/formatters/error";

type Status = "loading" | "ready" | "error";

export function useSubscriptions() {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [status, setStatus] = useState<Status>("loading");
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setRefreshing] = useState(false);

    const refresh = async () => {
        try {
            setSubscriptions(await container.listSubscriptions.execute());
            setError(null);
            setStatus("ready");
        } catch (error) {
            // The device may still be registering; keep loading until it is.
            if (error instanceof UnauthorizedError) {
                return;
            }

            setError(formatError(error));
            setStatus((current) => (current === "ready" ? current : "error"));
        }
    };

    const retry = async () => {
        setStatus("loading");
        await refresh();
    };

    const pullToRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    const subscribe = async (tournamentLink: string) => {
        await container.subscribeToTournament.execute(tournamentLink);
        await refresh();
    };

    const unsubscribe = async (subscriptionId: string) => {
        setSubscriptions((current) =>
            current.filter(({ id }) => id !== subscriptionId),
        );

        try {
            await container.unsubscribe.execute(subscriptionId);
        } catch (error) {
            await refresh();
            throw error;
        }
    };

    return {
        subscriptions,
        status,
        error,
        isRefreshing,
        refresh,
        retry,
        pullToRefresh,
        subscribe,
        unsubscribe,
    };
}
