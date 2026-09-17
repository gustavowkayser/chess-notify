import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { AppText } from "@/presentation/components/ui/AppText";
import { colors } from "@/presentation/theme/tokens";

const SIZE = 60;
const THICKNESS = 5;

interface RoundProgressProps {
    current: number;
    total: number;
}

/**
 * Ring filled clockwise by the share of rounds paired, closing on the final
 * round. Built from two clipped half-rings, so it needs no SVG.
 */
export function RoundProgress({ current, total }: RoundProgressProps) {
    const { t } = useTranslation();
    const target = total > 0 ? Math.min(Math.max(current / total, 0), 1) : 0;
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(target, { duration: 700 });
    }, [target]);

    // Each half-ring starts hidden outside its clip and rotates into view:
    // the right one over the first half of the progress, the left one after.
    const rightStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${45 - 180 + 360 * Math.min(progress.value, 0.5)}deg`,
            },
        ],
    }));

    const leftStyle = useAnimatedStyle(() => ({
        transform: [
            {
                rotate: `${45 + 360 * Math.max(progress.value - 0.5, 0)}deg`,
            },
        ],
    }));

    return (
        <View
            accessibilityLabel={
                total > 0
                    ? t("tournament.roundOf", { current, total })
                    : t("tournament.notStarted")
            }
            style={styles.container}
        >
            <View style={styles.track} />

            <View style={[styles.clip, { left: SIZE / 2 }]}>
                <Animated.View
                    style={[styles.halfRing, { left: -SIZE / 2 }, rightStyle]}
                />
            </View>
            <View style={[styles.clip, { left: 0 }]}>
                <Animated.View
                    style={[styles.halfRing, { left: 0 }, leftStyle]}
                />
            </View>

            <View style={styles.label}>
                <AppText variant="label">{total > 0 ? current : "–"}</AppText>
                {total > 0 && <AppText variant="caption">/{total}</AppText>}
            </View>
        </View>
    );
}

const ring = {
    position: "absolute",
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    borderWidth: THICKNESS,
} as const;

const styles = StyleSheet.create({
    container: {
        width: SIZE,
        height: SIZE,
    },
    track: {
        ...ring,
        borderColor: colors.hairline,
    },
    clip: {
        position: "absolute",
        top: 0,
        width: SIZE / 2,
        height: SIZE,
        overflow: "hidden",
    },
    // Top and right borders span 10:30 to 4:30; the base 45° rotation
    // turns that into the right half (12 to 6).
    halfRing: {
        ...ring,
        top: 0,
        borderTopColor: colors.accent,
        borderRightColor: colors.accent,
        borderBottomColor: "transparent",
        borderLeftColor: "transparent",
    },
    label: {
        ...StyleSheet.absoluteFill,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
