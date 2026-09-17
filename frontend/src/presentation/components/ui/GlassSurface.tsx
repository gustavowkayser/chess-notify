import { StyleSheet, View, type ViewProps } from "react-native";
import { type lightEdges, radii, sheens } from "@/presentation/theme/tokens";

export type GlassTone = keyof typeof lightEdges;

export interface GlassSurfaceProps extends ViewProps {
    /** "lit" for surfaces under the glow, "dim" for the darker areas. */
    tone?: GlassTone;
    radius?: number;
}

export function GlassSurface({
    tone = "lit",
    radius = radii.xl,
    style,
    children,
    ...props
}: GlassSurfaceProps) {
    return (
        <View
            style={[styles.surface, { borderRadius: radius }, style]}
            {...props}
        >
            <View
                pointerEvents="none"
                style={[
                    StyleSheet.absoluteFill,
                    {
                        borderRadius: radius,
                        experimental_backgroundImage: sheens[tone],
                    },
                ]}
            />
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    surface: {
        borderWidth: 1,
        backgroundColor: "rgba(0, 0, 0, 1)",
        borderTopColor: "rgba(255, 255, 255, 0.1)",
        borderLeftColor: "rgba(255, 255, 255, 0.05)",
        borderRightColor: "rgba(255, 255, 255, 0.05)",
        borderBottomColor: "rgba(255, 255, 255, 0.05)",
        overflow: "hidden",
    },
});
