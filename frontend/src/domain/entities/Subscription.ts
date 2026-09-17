import type { Tournament } from "@/domain/entities/Tournament";

export interface Subscription {
    id: string;
    tournament: Tournament;
}
