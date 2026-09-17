/** Mirrors the @theme block in src/global.css. */
export const colors = {
    background: "#000000",
    surface: "#0f1116",
    surfaceRaised: "#161920",
    hairline: "#1d2028",
    smoke: "#f2f2f4",
    muted: "#8d909b",
    subtle: "#565a66",
    accent: "#a9c4ff",
    accentDeep: "#1b2a52",
    glow: "#1b45ff",
    danger: "#ff9494",
} as const;

export const fonts = {
    regular: "Inter_400Regular",
    medium: "Inter_500Medium",
    semibold: "Inter_600SemiBold",
    bold: "Inter_700Bold",
} as const;

export const radii = {
    md: 16,
    lg: 22,
    xl: 28,
    full: 999,
} as const;

/**
 * Light reflection on glass edges. The glow comes from the top of the screen,
 * so upper edges catch more light than lower ones.
 */
export const lightEdges = {
    lit: {
        borderTopColor: "rgba(169, 196, 255, 0.12)",
        borderLeftColor: "rgba(169, 196, 255, 0.05)",
        borderRightColor: "rgba(169, 196, 255, 0.05)",
        borderBottomColor: "rgba(169, 196, 255, 0.07)",
    },
    dim: {
        borderTopColor: "rgba(255, 255, 255, 0.1)",
        borderLeftColor: "rgba(255, 255, 255, 0.05)",
        borderRightColor: "rgba(255, 255, 255, 0.05)",
        borderBottomColor: "rgba(255, 255, 255, 0.02)",
    },
} as const;

export const sheens = {
    lit: "linear-gradient(180deg, rgba(255, 255, 255, 0.015) 0%, rgba(40, 70, 200, 0.06) 55%, rgba(255, 255, 255, 0.01) 100%)",
    dim: "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.015) 100%)",
} as const;
