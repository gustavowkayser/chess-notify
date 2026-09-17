import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";

export function TournamentCardSkeleton() {
    const opacity = useSharedValue(0.5);

    useEffect(() => {
        opacity.value = withRepeat(
            withTiming(1, { duration: 900, easing: Easing.inOut(Easing.ease) }),
            -1,
            true,
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

    return (
        <Animated.View style={animatedStyle}>
            <GlassSurface tone="dim" className="gap-4 p-5">
                <View className="h-6 w-24 rounded-full bg-surface-raised" />
                <View className="h-5 w-3/4 rounded-full bg-surface-raised" />
                <View className="h-1.5 rounded-full bg-surface-raised" />
            </GlassSurface>
        </Animated.View>
    );
}
