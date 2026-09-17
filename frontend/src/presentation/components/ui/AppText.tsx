import { Text, type TextProps } from "react-native";

const variants = {
    display: "font-inter-semibold text-6xl text-smoke",
    title: "font-inter-semibold text-lg text-smoke",
    body: "font-inter text-base text-smoke",
    label: "font-inter-medium text-sm text-smoke",
    caption: "font-inter-medium text-xs text-muted",
} as const;

const tones = {
    default: "",
    muted: "text-muted",
    accent: "text-accent",
    danger: "text-danger",
} as const;

export interface AppTextProps extends TextProps {
    variant?: keyof typeof variants;
    tone?: keyof typeof tones;
}

export function AppText({
    variant = "body",
    tone = "default",
    className,
    ...props
}: AppTextProps) {
    return (
        <Text
            className={`${variants[variant]} ${tones[tone]} ${className ?? ""}`}
            {...props}
        />
    );
}
