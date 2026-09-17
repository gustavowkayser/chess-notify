import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { Subscription } from "@/domain/entities/Subscription";
import { getTournamentStatus } from "@/domain/entities/Tournament";
import { AppText } from "@/presentation/components/ui/AppText";

export function SubscriptionsSummary({
    subscriptions,
}: {
    subscriptions: Subscription[];
}) {
    const { t } = useTranslation();
    const inProgress = subscriptions.filter(
        ({ tournament }) => getTournamentStatus(tournament) !== "upcoming",
    ).length;
    const notStarted = subscriptions.length - inProgress;

    return (
        <View className="items-center pb-8 pt-4">
            <AppText tone="muted">{t("subscriptions.summaryTitle")}</AppText>
            <AppText
                variant="display"
                style={{
                    lineHeight: 72,
                    letterSpacing: -2,
                    fontVariant: ["tabular-nums"],
                }}
            >
                {subscriptions.length}
            </AppText>
            <View className="flex-row items-center gap-2">
                <View className="h-1.5 w-1.5 rounded-full bg-accent" />
                <AppText tone="muted" className="text-sm">
                    {t("subscriptions.summarySubtitle", {
                        inProgress,
                        notStarted,
                    })}
                </AppText>
            </View>
        </View>
    );
}
