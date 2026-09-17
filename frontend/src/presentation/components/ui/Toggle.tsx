import { useEffect } from "react";
import { Pressable } from "react-native";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { colors } from "@/presentation/theme/tokens";

const TRACK_WIDTH = 50;
const TRACK_HEIGHT = 30;
const THUMB_SIZE = 20;
const INSET = (TRACK_HEIGHT - THUMB_SIZE) / 2 - 1;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - INSET * 2 - 2;

interface ToggleProps {
    value: boolean;
    disabled?: boolean;
    accessibilityLabel: string;
    onValueChange: (value: boolean) => void;
}

/** Switch with an inset thumb: white while off, black on the lit track. */
export function Toggle({
    value,
    disabled = false,
    accessibilityLabel,
    onValueChange,
}: ToggleProps) {
    const progress = useSharedValue(value ? 1 : 0);

    useEffect(() => {
        progress.value = withTiming(value ? 1 : 0, { duration: 200 });
    }, [value]);

    const trackStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [colors.surfaceRaised, colors.accent],
        ),
        borderColor: interpolateColor(
            progress.value,
            [0, 1],
            ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.35)"],
        ),
    }));

    const thumbStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [colors.smoke, colors.background],
        ),
        transform: [{ translateX: progress.value * TRAVEL }],
    }));

    return (
        <Pressable
            accessibilityRole="switch"
            accessibilityLabel={accessibilityLabel}
            accessibilityState={{ checked: value, disabled }}
            disabled={disabled}
            hitSlop={8}
            onPress={() => onValueChange(!value)}
            style={{ opacity: disabled ? 0.45 : 1 }}
        >
            <Animated.View
                style={[
                    {
                        width: TRACK_WIDTH,
                        height: TRACK_HEIGHT,
                        borderRadius: TRACK_HEIGHT / 2,
                        borderWidth: 1,
                        padding: INSET,
                        justifyContent: "center",
                    },
                    trackStyle,
                ]}
            >
                <Animated.View
                    style={[
                        {
                            width: THUMB_SIZE,
                            height: THUMB_SIZE,
                            borderRadius: THUMB_SIZE / 2,
                        },
                        thumbStyle,
                    ]}
                />
            </Animated.View>
        </Pressable>
    );
}
