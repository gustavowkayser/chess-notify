import type { AxiosInstance } from "axios";
import type { Subscription } from "@/domain/entities/Subscription";
import type { TournamentSearchMatch } from "@/domain/entities/Tournament";
import { RequestFailedError } from "@/domain/errors/DomainError";
import type { SubscriptionRepository } from "@/domain/repositories/SubscriptionRepository";
import {
    type ApiResponse,
    toDomainError,
} from "@/infrastructure/http/apiError";

interface SubscriptionDto {
    id: string;
    tournament_id: string;
    tournament_name: string;
    tournament_url?: string;
    tournament_round: number;
    tournament_total_rounds: number;
}

interface TournamentDto {
    tournament_url: string;
    tournament_name: string;
}

interface CreateSubscriptionDto {
    subscription_id: string;
}

export default class HttpSubscriptionRepository
    implements SubscriptionRepository
{
    constructor(readonly apiClient: AxiosInstance) {}

    async list(): Promise<Subscription[]> {
        try {
            const response =
                await this.apiClient.get<ApiResponse<SubscriptionDto[] | null>>(
                    "/v1/subscriptions",
                );

            return (response.data.data ?? []).map(toSubscription);
        } catch (error) {
            throw toDomainError(error);
        }
    }

    async subscribe(tournamentUrl: string): Promise<string> {
        try {
            const response = await this.apiClient.post<
                ApiResponse<CreateSubscriptionDto>
            >("/v1/subscriptions", { tournamentUrl });

            return response.data.data.subscription_id;
        } catch (error) {
            const domainError = toDomainError(error);

            throw domainError instanceof RequestFailedError
                ? new RequestFailedError(
                      "Couldn't subscribe to this tournament. Check the link and try again.",
                  )
                : domainError;
        }
    }

    async unsubscribe(subscriptionId: string): Promise<void> {
        try {
            await this.apiClient.delete(`/v1/subscriptions/${subscriptionId}`);
        } catch (error) {
            throw toDomainError(error);
        }
    }

    async searchTournaments(query: string): Promise<TournamentSearchMatch[]> {
        try {
            const response = await this.apiClient.get<
                ApiResponse<TournamentDto[] | null>
            >("/v1/tournaments", { params: { q: query } });

            return (response.data.data ?? []).map(toTournamentSearchMatch);
        } catch (error) {
            throw toDomainError(error);
        }
    }
}

function toSubscription(dto: SubscriptionDto): Subscription {
    return {
        id: dto.id,
        tournament: {
            id: dto.tournament_id,
            name: dto.tournament_name.trim() || "Untitled tournament",
            url: dto.tournament_url || null,
            currentRound: dto.tournament_round,
            totalRounds: dto.tournament_total_rounds,
        },
    };
}

function toTournamentSearchMatch(dto: TournamentDto): TournamentSearchMatch {
    return {
        name: dto.tournament_name.trim() || "Untitled tournament",
        url: dto.tournament_url,
    };
}
