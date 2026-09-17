import { useTranslation } from "react-i18next";
import { View } from "react-native";
import type { TournamentStatus } from "@/domain/entities/Tournament";
import { AppText } from "@/presentation/components/ui/AppText";

export function TournamentStatusChip({ status }: { status: TournamentStatus }) {
    const { t } = useTranslation();

    const appearance: Record<
        TournamentStatus,
        { label: string; container: string; dot: string; text: string }
    > = {
        upcoming: {
            label: t("tournament.notStarted"),
            container: "bg-surface-raised",
            dot: "bg-subtle",
            text: "text-muted",
        },
        ongoing: {
            label: t("tournament.inProgress"),
            container: "bg-accent-deep",
            dot: "bg-accent",
            text: "text-accent",
        },
        finalRound: {
            label: t("tournament.finalRound"),
            container: "bg-surface-raised",
            dot: "bg-smoke",
            text: "text-smoke",
        },
    };

    const { label, container, dot, text } = appearance[status];

    return (
        <View
            className={`flex-row items-center gap-1.5 self-start rounded-full py-1 pl-2 pr-2.5 ${container}`}
        >
            <View className={`h-1.5 w-1.5 rounded-full ${dot}`} />
            <AppText variant="caption" className={text}>
                {label}
            </AppText>
        </View>
    );
}
