import {
    ActivityIndicator,
    Pressable,
    type PressableProps,
    type StyleProp,
    type ViewStyle,
} from "react-native";
import Animated from "react-native-reanimated";
import { AppText } from "@/presentation/components/ui/AppText";
import {
    GlassSurface,
    type GlassTone,
} from "@/presentation/components/ui/GlassSurface";
import { Icon, type IconName } from "@/presentation/components/ui/Icon";
import { usePressScale } from "@/presentation/hooks/usePressScale";
import { colors } from "@/presentation/theme/tokens";

interface GlassButtonProps extends Omit<PressableProps, "children" | "style"> {
    label?: string;
    icon?: IconName;
    tone?: GlassTone;
    variant?: "glass" | "accent" | "danger";
    isLoading?: boolean;
    style?: StyleProp<ViewStyle>;
}

export function GlassButton({
    label,
    icon,
    tone = "lit",
    variant = "glass",
    isLoading = false,
    disabled,
    style,
    ...props
}: GlassButtonProps) {
    const press = usePressScale();
    const foreground = foregrounds[variant];
    const padding = label ? "px-4" : "w-11";

    return (
        <Animated.View style={[press.animatedStyle, style]}>
            <Pressable
                accessibilityRole="button"
                disabled={disabled || isLoading}
                onPressIn={press.onPressIn}
                onPressOut={press.onPressOut}
                {...props}
            >
                <GlassSurface
                    tone={tone}
                    radius={999}
                    className={`h-11 flex-row items-center justify-center gap-2 ${padding}`}
                    style={variant === "accent" && styles.accent}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color={foreground} />
                    ) : (
                        <>
                            {icon && (
                                <Icon
                                    name={icon}
                                    size={18}
                                    color={foreground}
                                />
                            )}
                            {label && (
                                <AppText
                                    variant="label"
                                    style={{ color: foreground }}
                                >
                                    {label}
                                </AppText>
                            )}
                        </>
                    )}
                </GlassSurface>
            </Pressable>
        </Animated.View>
    );
}

const foregrounds = {
    glass: colors.smoke,
    accent: colors.background,
    danger: colors.danger,
} as const;

const styles = {
    accent: {
        backgroundColor: colors.accent,
        borderTopColor: "rgba(255, 255, 255, 0.7)",
        borderLeftColor: "rgba(255, 255, 255, 0.35)",
        borderRightColor: "rgba(255, 255, 255, 0.35)",
        borderBottomColor: "rgba(255, 255, 255, 0.15)",
    },
} satisfies Record<string, ViewStyle>;
