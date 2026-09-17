import {
    DomainError,
    InvalidTournamentLinkError,
    NetworkError,
    UnauthorizedError,
} from "@/domain/errors/DomainError";
import i18n from "@/infrastructure/i18n/i18n";

export function formatError(error: unknown): string {
    if (error instanceof UnauthorizedError) {
        return i18n.t("errors.unauthorized");
    }
    if (error instanceof NetworkError) {
        return i18n.t("errors.network");
    }
    if (error instanceof InvalidTournamentLinkError) {
        return i18n.t("errors.invalidLink");
    }
    if (error instanceof DomainError) {
        return error.message;
    }
    return i18n.t("errors.generic");
}
