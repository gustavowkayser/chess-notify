import type { Subscription } from "@/domain/entities/Subscription";
import type { TournamentSearchMatch } from "@/domain/entities/Tournament";

export interface SubscriptionRepository {
    list(): Promise<Subscription[]>;
    subscribe(tournamentUrl: string): Promise<string>;
    unsubscribe(subscriptionId: string): Promise<void>;
    searchTournaments(query: string): Promise<TournamentSearchMatch[]>;
}
