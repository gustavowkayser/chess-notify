export interface Tournament {
    id: string;
    name: string;
    url: string | null;
    currentRound: number;
    totalRounds: number;
}

export enum TournamentStatus {
    UPCOMING = "upcoming",
    ONGOING = "ongoing",
    FINAL_ROUND = "finalRound",
}

export function getTournamentStatus(
    tournament: Pick<Tournament, "currentRound" | "totalRounds">,
): string {
    if (tournament.currentRound <= 0) {
        return TournamentStatus.UPCOMING;
    }

    if (
        tournament.totalRounds > 0 &&
        tournament.currentRound >= tournament.totalRounds
    ) {
        return TournamentStatus.FINAL_ROUND;
    }

    return TournamentStatus.ONGOING;
}

/** A tournament listed on chess-results.com, followed or not. */
export interface TournamentSearchMatch {
    name: string;
    url: string;
}
