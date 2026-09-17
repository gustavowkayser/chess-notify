import { StyleSheet, View } from "react-native";

/** The blue light spilling from the top of the screen, with a faint echo below. */
export function GlowBackground() {
    return (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <View style={[StyleSheet.absoluteFill, styles.top]} />
            <View style={[StyleSheet.absoluteFill, styles.bottom]} />
        </View>
    );
}

const styles = StyleSheet.create({
    top: {
        experimental_backgroundImage:
            "radial-gradient(130% 60% at 50% 0%, rgba(32, 72, 255, 0.12) 0%, rgba(22, 50, 190, 0.06) 16%, rgba(10, 18, 60, 0.08) 70%, rgba(5, 6, 10, 0) 100%)",
    },
    bottom: {
        experimental_backgroundImage:
            "radial-gradient(160% 28% at 50% 100%, rgba(27, 69, 255, 0.05) 0%, rgba(27, 69, 255, 0.02) 55%, rgba(5, 6, 10, 0) 100%)",
    },
});
