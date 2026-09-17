import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import Animated, {
    FadeInUp,
    FadeOutUp,
    LinearTransition,
} from "react-native-reanimated";
import type { Subscription } from "@/domain/entities/Subscription";
import {
    getTournamentStatus,
    type Tournament,
} from "@/domain/entities/Tournament";
import { RoundProgress } from "@/presentation/components/subscriptions/RoundProgress";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassButton } from "@/presentation/components/ui/GlassButton";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { formatRoundLabel } from "@/presentation/formatters/tournament";
import { usePressScale } from "@/presentation/hooks/usePressScale";

const LAYOUT = LinearTransition.duration(220);

interface TournamentCardProps {
    subscription: Subscription;
    /** Whether the options below the card are shown. */
    isExpanded: boolean;
    onPress: (tournament: Tournament) => void;
    onToggleOptions: (subscription: Subscription) => void;
    onUnsubscribe: (subscription: Subscription) => void;
}

export function TournamentCard({
    subscription,
    isExpanded,
    onPress,
    onToggleOptions,
    onUnsubscribe,
}: TournamentCardProps) {
    const { t } = useTranslation();
    const { tournament } = subscription;
    const press = usePressScale(0.98);
    const status = getTournamentStatus(tournament);
    const roundsLeft = tournament.totalRounds - tournament.currentRound;

    return (
        <Animated.View layout={LAYOUT} className="gap-2">
            <Animated.View style={press.animatedStyle}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isExpanded }}
                    accessibilityHint={t("tournament.cardHint")}
                    onPress={() =>
                        isExpanded
                            ? onToggleOptions(subscription)
                            : onPress(tournament)
                    }
                    onLongPress={() => onToggleOptions(subscription)}
                    onPressIn={press.onPressIn}
                    onPressOut={press.onPressOut}
                >
                    <GlassSurface
                        tone="dim"
                        className="flex-row items-center gap-4 p-5"
                        style={{ backgroundColor: "rgba(15, 17, 22, 0.78)" }}
                    >
                        <View className="flex-1 gap-2">
                            <AppText variant="title" numberOfLines={2}>
                                {tournament.name}
                            </AppText>
                            <View className="flex-row items-center gap-2">
                                <AppText
                                    variant="caption"
                                    className="text-smoke"
                                >
                                    {formatRoundLabel(tournament)}
                                </AppText>
                                {status === "ongoing" && (
                                    <AppText variant="caption">
                                        {t("tournament.roundsLeft", {
                                            count: roundsLeft,
                                        })}
                                    </AppText>
                                )}
                            </View>
                        </View>
                        <RoundProgress
                            current={tournament.currentRound}
                            total={tournament.totalRounds}
                        />
                    </GlassSurface>
                </Pressable>
            </Animated.View>

            {isExpanded && (
                <Animated.View
                    entering={FadeInUp.duration(220)}
                    exiting={FadeOutUp.duration(160)}
                    className="flex-row gap-2"
                >
                    <GlassButton
                        tone="dim"
                        icon="external"
                        label={t("tournament.openPage")}
                        disabled={!tournament.url}
                        onPress={() => onPress(tournament)}
                        style={{ flex: 1, opacity: tournament.url ? 1 : 0.5 }}
                    />
                    <GlassButton
                        tone="dim"
                        variant="danger"
                        icon="trash"
                        label={t("common.remove")}
                        onPress={() => onUnsubscribe(subscription)}
                        style={{ flex: 1 }}
                    />
                </Animated.View>
            )}
        </Animated.View>
    );
}
