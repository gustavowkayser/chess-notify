import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import {
    isRemoteSearchQuery,
    MIN_SEARCH_QUERY_LENGTH,
    type TournamentSearchResult,
} from "@/application/useCases/SearchTournamentsUseCase";
import { parseTournamentLink } from "@/domain/valueObjects/TournamentLink";
import { SearchResultRow } from "@/presentation/components/search/SearchResultRow";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassButton } from "@/presentation/components/ui/GlassButton";
import { Icon, type IconName } from "@/presentation/components/ui/Icon";
import { formatRoundLabel } from "@/presentation/formatters/tournament";
import type { SearchStatus } from "@/presentation/hooks/useTournamentSearch";
import { colors } from "@/presentation/theme/tokens";

interface SearchResultsProps {
    query: string;
    results: TournamentSearchResult;
    status: SearchStatus;
    searchError: string | null;
    submittingUrl: string | null;
    subscribeError: { url: string; message: string } | null;
    onSubscribe: (url: string) => void;
    onRetry: () => void;
    onOpenUrl: (url: string) => void;
}

export function SearchResults({
    query,
    results,
    status,
    searchError,
    submittingUrl,
    subscribeError,
    onSubscribe,
    onRetry,
    onOpenUrl,
}: SearchResultsProps) {
    const { t } = useTranslation();

    if (!query.trim()) {
        return (
            <Message
                icon="link"
                title={t("search.findTournament")}
                description={t("search.findTournamentDesc")}
            />
        );
    }

    if (status === "loading") {
        // Links and short queries settle immediately; only show a spinner
        // while chess-results.com is being searched.
        return isRemoteSearchQuery(query) ? (
            <Searching text={t("search.searchingExternal")} />
        ) : null;
    }

    if (status === "error") {
        return (
            <Message
                icon="warning"
                title={t("search.searchFailed")}
                description={searchError ?? t("common.tryAgainDesc")}
                action={{ label: t("common.tryAgain"), onPress: onRetry }}
            />
        );
    }

    const { link, matches } = results;

    if (link?.subscription) {
        const { tournament } = link.subscription;

        return (
            <>
                <SectionLabel>{t("search.alreadySubscribed")}</SectionLabel>
                <SearchResultRow
                    highlighted
                    icon="check"
                    title={tournament.name}
                    subtitle={formatRoundLabel(tournament)}
                    onPress={() => onOpenUrl(link.href)}
                    trailing={<ExternalMark />}
                />
            </>
        );
    }

    if (link) {
        return (
            <>
                <SectionLabel>{t("search.tournamentLink")}</SectionLabel>
                <SearchResultRow
                    highlighted
                    icon="link"
                    title={link.host}
                    subtitle={
                        link.href.replace(/^https?:\/\/[^/]+/i, "") || "/"
                    }
                    trailing={
                        <GlassButton
                            variant="accent"
                            label={t("common.subscribe")}
                            isLoading={submittingUrl === link.href}
                            disabled={submittingUrl !== null}
                            onPress={() => onSubscribe(link.href)}
                        />
                    }
                />
                <SubscribeError url={link.href} error={subscribeError} />
            </>
        );
    }

    if (query.trim().length < MIN_SEARCH_QUERY_LENGTH) {
        return (
            <Message
                icon="search"
                title={t("search.keepTyping")}
                description={t("search.keepTypingDesc", {
                    count: MIN_SEARCH_QUERY_LENGTH,
                })}
            />
        );
    }

    if (matches.length === 0) {
        return (
            <Message
                icon="search"
                title={t("search.noResults", { query: query.trim() })}
                description={t("search.noResultsDesc")}
            />
        );
    }

    return (
        <>
            <SectionLabel>
                {t("search.tournamentsFound", { count: matches.length })}
            </SectionLabel>
            {matches.map(({ name, url, subscription }, index) => (
                <View key={url}>
                    <SearchResultRow
                        index={index}
                        highlighted={subscription !== null}
                        icon={subscription ? "check" : "trophy"}
                        title={name}
                        subtitle={
                            subscription
                                ? formatRoundLabel(subscription.tournament)
                                : (parseTournamentLink(url)?.host ?? url)
                        }
                        onPress={() => onSubscribe(url)}
                        trailing={subscription && <ExternalMark />}
                    />
                    <SubscribeError url={url} error={subscribeError} />
                </View>
            ))}
        </>
    );
}

function SectionLabel({ children }: { children: string }) {
    return (
        <AppText
            variant="caption"
            className="px-3 pb-1 pt-2 uppercase"
            style={{ letterSpacing: 0.8 }}
        >
            {children}
        </AppText>
    );
}

function ExternalMark() {
    return (
        <View className="pr-1">
            <Icon name="external" size={15} color={colors.muted} />
        </View>
    );
}

function SubscribeError({
    url,
    error,
}: {
    url: string;
    error: { url: string; message: string } | null;
}) {
    if (error?.url !== url) {
        return null;
    }

    return (
        <Animated.View entering={FadeIn}>
            <AppText tone="danger" className="px-3 pb-2 text-sm">
                {error.message}
            </AppText>
        </Animated.View>
    );
}

function Searching({ text }: { text: string }) {
    return (
        <Animated.View entering={FadeIn.delay(80).duration(260)}>
            <View className="flex-row items-center justify-center gap-3 px-6 py-7">
                <ActivityIndicator size="small" color={colors.accent} />
                <AppText tone="muted" className="text-sm">
                    {text}
                </AppText>
            </View>
        </Animated.View>
    );
}

function Message({
    icon,
    title,
    description,
    action,
}: {
    icon: IconName;
    title: string;
    description: string;
    action?: { label: string; onPress: () => void };
}) {
    return (
        <Animated.View entering={FadeIn.delay(80).duration(260)}>
            <View className="items-center gap-2 px-6 py-7">
                <View className="mb-1 h-11 w-11 items-center justify-center rounded-full bg-accent-deep">
                    <Icon name={icon} size={18} color={colors.accent} />
                </View>
                <AppText variant="label" className="text-center">
                    {title}
                </AppText>
                <AppText tone="muted" className="text-center text-sm leading-5">
                    {description}
                </AppText>
                {action && (
                    <GlassButton
                        tone="dim"
                        label={action.label}
                        onPress={action.onPress}
                        style={{ marginTop: 8 }}
                    />
                )}
            </View>
        </Animated.View>
    );
}
