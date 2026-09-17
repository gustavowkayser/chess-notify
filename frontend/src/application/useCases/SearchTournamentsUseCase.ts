import type { Subscription } from "@/domain/entities/Subscription";
import type { TournamentSearchMatch } from "@/domain/entities/Tournament";
import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";
import {
    isSameTournamentLink,
    parseTournamentLink,
    type TournamentLink,
} from "@/domain/valueObjects/TournamentLink";

/** Shorter queries match too many tournaments to be useful. */
export const MIN_SEARCH_QUERY_LENGTH = 3;

type WithSubscription<T> = T & { subscription: Subscription | null };

export interface TournamentSearchResult {
    /** Present when the query is a link the user can subscribe to. */
    link: WithSubscription<TournamentLink> | null;
    matches: WithSubscription<TournamentSearchMatch>[];
}

export const EMPTY_SEARCH_RESULT: TournamentSearchResult = {
    link: null,
    matches: [],
};

/** Whether the query is searched on chess-results.com rather than locally. */
export function isRemoteSearchQuery(query: string): boolean {
    return (
        !parseTournamentLink(query) &&
        query.trim().length >= MIN_SEARCH_QUERY_LENGTH
    );
}

/**
 * Detects pasted links, and otherwise searches chess-results.com by name.
 * Every result is paired with the user's subscription to it, if any.
 */
export default class SearchTournamentsUseCase {
    constructor(readonly subscriptionRepository: SubscriptionRepository) {}

    async execute(
        query: string,
        subscriptions: Subscription[],
    ): Promise<TournamentSearchResult> {
        const link = parseTournamentLink(query);

        if (link) {
            return {
                link: {
                    ...link,
                    subscription: findSubscription(subscriptions, link.href),
                },
                matches: [],
            };
        }

        if (!isRemoteSearchQuery(query)) {
            return EMPTY_SEARCH_RESULT;
        }

        const matches = await this.subscriptionRepository.searchTournaments(
            query.trim(),
        );

        return {
            link: null,
            matches: matches.map((match) => ({
                ...match,
                subscription: findSubscription(subscriptions, match.url),
            })),
        };
    }
}

function findSubscription(
    subscriptions: Subscription[],
    url: string,
): Subscription | null {
    return (
        subscriptions.find(
            ({ tournament }) =>
                tournament.url !== null &&
                isSameTournamentLink(tournament.url, url),
        ) ?? null
    );
}
