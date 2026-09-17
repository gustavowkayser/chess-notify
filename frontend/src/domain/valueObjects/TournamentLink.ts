const LINK_PATTERN =
    /^(?:https?:\/\/)?((?:[a-z0-9-]+\.)+[a-z]{2,})(?::\d+)?(?:[/?#]\S*)?$/i;
const SCHEME_PATTERN = /^https?:\/\//i;
/** chess-results.com pages are keyed by id, e.g. "/tnr123456.aspx". */
const TOURNAMENT_ID_PATTERN = /\/tnr(\d+)\.aspx/i;

export interface TournamentLink {
    href: string;
    host: string;
}

/**
 * Parses user input (typed or pasted) into a tournament link. Accepts links
 * with or without scheme, e.g. "chess-results.com/tnr123.aspx".
 */
export function parseTournamentLink(input: string): TournamentLink | null {
    const value = input.trim();
    const match = LINK_PATTERN.exec(value);

    if (!match) {
        return null;
    }

    return {
        href: SCHEME_PATTERN.test(value) ? value : `https://${value}`,
        host: match[1].toLowerCase().replace(/^www\./, ""),
    };
}

/**
 * The same tournament is served from several hosts (s1., s2., ...) and with
 * varying query params, so links are compared by tournament id when possible.
 */
export function isSameTournamentLink(a: string, b: string): boolean {
    const idA = TOURNAMENT_ID_PATTERN.exec(a)?.[1];
    const idB = TOURNAMENT_ID_PATTERN.exec(b)?.[1];

    if (idA && idB) {
        return idA === idB;
    }

    return normalize(a) === normalize(b);
}

function normalize(link: string): string {
    return link
        .trim()
        .toLowerCase()
        .replace(SCHEME_PATTERN, "")
        .replace(/^www\./, "")
        .replace(/\/+$/, "");
}
