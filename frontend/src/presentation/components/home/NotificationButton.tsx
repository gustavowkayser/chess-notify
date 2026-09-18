import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon } from "@/presentation/components/ui/Icon";
import { usePressScale } from "@/presentation/hooks/usePressScale";
import { colors, radii } from "@/presentation/theme/tokens";

interface NotificationButtonProps {
    enabled: boolean;
    /** False while the push token is unavailable, e.g. permission denied. */
    isAvailable: boolean;
    isUpdating: boolean;
    onChange: (enabled: boolean) => void;
}

export function NotificationButton({
    enabled,
    isAvailable,
    isUpdating,
    onChange,
}: NotificationButtonProps) {
    const { t } = useTranslation();
    const press = usePressScale();
    const isOn = isAvailable && enabled;

    const handlePress = () => {
        if (!isAvailable || isUpdating) {
            return;
        }
        onChange(!enabled);
    };

    return (
        <Animated.View style={press.animatedStyle}>
            <Pressable
                accessibilityRole="button"
                accessibilityLabel={isOn ? t("alerts.on") : t("alerts.off")}
                accessibilityState={{
                    checked: isOn,
                    disabled: !isAvailable || isUpdating,
                }}
                disabled={!isAvailable || isUpdating}
                onPressIn={press.onPressIn}
                onPressOut={press.onPressOut}
                onPress={handlePress}
            >
                <GlassSurface
                    radius={radii.full}
                    className="h-11 w-11 items-center justify-center"
                    style={isOn ? styles.activeSurface : undefined}
                >
                    {isUpdating ? (
                        <ActivityIndicator size="small" color={colors.accent} />
                    ) : (
                        <Icon
                            name={isOn ? "bell" : "bellOff"}
                            size={18}
                            color={isOn ? colors.accent : colors.muted}
                        />
                    )}
                </GlassSurface>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    activeSurface: {
        backgroundColor: "rgba(27, 42, 82, 0.4)",
        borderTopColor: "rgba(169, 196, 255, 0.25)",
        borderLeftColor: "rgba(169, 196, 255, 0.12)",
        borderRightColor: "rgba(169, 196, 255, 0.12)",
        borderBottomColor: "rgba(169, 196, 255, 0.1)",
        boxShadow: "0 0 10px rgba(27, 69, 255, 0.25)",
    },
});
