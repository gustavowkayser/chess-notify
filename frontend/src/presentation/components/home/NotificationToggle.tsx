import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon } from "@/presentation/components/ui/Icon";
import { Toggle } from "@/presentation/components/ui/Toggle";
import { colors, radii } from "@/presentation/theme/tokens";

interface NotificationToggleProps {
    enabled: boolean;
    /** False while the push token is unavailable, e.g. permission denied. */
    isAvailable: boolean;
    isUpdating: boolean;
    onChange: (enabled: boolean) => void;
}

export function NotificationToggle({
    enabled,
    isAvailable,
    isUpdating,
    onChange,
}: NotificationToggleProps) {
    const { t } = useTranslation();
    const isOn = isAvailable && enabled;
    const label = t("notifications.roundNotifications");

    return (
        <GlassSurface
            radius={radii.full}
            className="flex-row items-center gap-3 py-4 pl-5 pr-5"
        >
            <View
                className={`h-10 w-10 items-center justify-center rounded-full ${
                    isOn ? "bg-accent-deep" : "bg-surface-raised"
                }`}
            >
                <Icon
                    name={isOn ? "bell" : "bellOff"}
                    size={17}
                    color={isOn ? colors.accent : colors.muted}
                />
            </View>
            <View className="flex-1 gap-0.5">
                <AppText
                    variant="label"
                    className="text-[16px] font-inter-bold"
                >
                    {label}
                </AppText>
            </View>
            <Toggle
                accessibilityLabel={label}
                value={isOn}
                disabled={!isAvailable || isUpdating}
                onValueChange={onChange}
            />
        </GlassSurface>
    );
}
