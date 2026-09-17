import {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";

const SPRING = { damping: 18, stiffness: 320, mass: 0.6 };

/** Subtle shrink while pressed, springing back on release. */
export function usePressScale(pressedScale = 0.96) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return {
        animatedStyle,
        onPressIn: () => {
            scale.value = withSpring(pressedScale, SPRING);
        },
        onPressOut: () => {
            scale.value = withSpring(1, SPRING);
        },
    };
}
