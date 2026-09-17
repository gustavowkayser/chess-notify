import { BlurView } from "expo-blur";
import type { PropsWithChildren, RefObject } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    useWindowDimensions,
    View,
} from "react-native";
import Animated, {
    type EntryExitAnimationFunction,
    FadeIn,
    FadeOut,
    useAnimatedKeyboard,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { lightEdges } from "@/presentation/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DROP_SPRING = { damping: 24, stiffness: 240, mass: 0.9 };
const GAP = 10;
const MIN_HEIGHT = 180;

const dropIn: EntryExitAnimationFunction = () => {
    "worklet";
    return {
        initialValues: {
            opacity: 0,
            transform: [{ translateY: -28 }, { scale: 0.96 }],
        },
        animations: {
            opacity: withTiming(1, { duration: 220 }),
            transform: [
                { translateY: withSpring(0, DROP_SPRING) },
                { scale: withSpring(1, DROP_SPRING) },
            ],
        },
    };
};

const liftOut: EntryExitAnimationFunction = () => {
    "worklet";
    return {
        initialValues: {
            opacity: 1,
            transform: [{ translateY: 0 }, { scale: 1 }],
        },
        animations: {
            opacity: withTiming(0, { duration: 160 }),
            transform: [
                { translateY: withTiming(-16, { duration: 180 }) },
                { scale: withTiming(0.98, { duration: 180 }) },
            ],
        },
    };
};

interface SearchDrawerProps extends PropsWithChildren {
    /** Distance from the top of the screen to the bottom of the search bar. */
    top: number;
    /** View whose content is blurred behind the glass (required on Android). */
    blurTarget: RefObject<View | null>;
    onDismiss: () => void;
}

export function SearchDrawer({
    top,
    blurTarget,
    onDismiss,
    children,
}: SearchDrawerProps) {
    const { height: windowHeight } = useWindowDimensions();
    const keyboard = useAnimatedKeyboard();

    const sizeStyle = useAnimatedStyle(() => ({
        maxHeight: Math.max(
            MIN_HEIGHT,
            windowHeight - top - GAP * 2 - keyboard.height.value,
        ),
    }));

    return (
        <>
            <AnimatedPressable
                accessibilityLabel="Close search"
                entering={FadeIn.duration(260)}
                exiting={FadeOut.duration(200)}
                onPress={onDismiss}
                style={[styles.backdrop, { top }]}
            />

            <Animated.View
                entering={dropIn}
                exiting={liftOut}
                style={[styles.drawer, lightEdges.lit, { top: top + GAP }]}
            >
                <BlurView
                    blurTarget={blurTarget}
                    blurMethod="dimezisBlurViewSdk31Plus"
                    intensity={55}
                    tint="dark"
                    style={StyleSheet.absoluteFill}
                />
                <View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill, styles.tint]}
                />
                <View
                    pointerEvents="none"
                    style={[StyleSheet.absoluteFill, styles.laterals]}
                />
                <Animated.View style={sizeStyle}>
                    <ScrollView
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="on-drag"
                        contentContainerStyle={styles.content}
                    >
                        {children}
                    </ScrollView>
                </Animated.View>
            </Animated.View>
        </>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(3, 4, 8, 0.5)",
    },
    drawer: {
        position: "absolute",
        left: 12,
        right: 12,
        borderRadius: 28,
        borderWidth: 1,
        overflow: "hidden",
        transformOrigin: "top",
        boxShadow: "0 24px 48px rgba(0, 0, 0, 0.45)",
    },
    tint: {
        experimental_backgroundImage:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.9) 100%)",
    },
    // Light leaking in through both sides of the glass.
    laterals: {
        experimental_backgroundImage:
            "linear-gradient(90deg, rgba(120, 160, 255, 0) 0%, rgba(120, 160, 255, 0) 14%, rgba(120, 160, 255, 0) 86%, rgba(120, 160, 255, 0) 100%)",
    },
    content: {
        padding: 8,
        gap: 2,
    },
});
