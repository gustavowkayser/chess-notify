import {
    getTournamentStatus,
    type Tournament,
} from "@/domain/entities/Tournament";
import i18n from "@/infrastructure/i18n/i18n";

export function formatRoundLabel(tournament: Tournament): string {
    if (getTournamentStatus(tournament) === "upcoming") {
        return i18n.t("tournament.waitingForPairings");
    }

    return i18n.t("tournament.roundOf", {
        current: tournament.currentRound,
        total: tournament.totalRounds,
    });
}
