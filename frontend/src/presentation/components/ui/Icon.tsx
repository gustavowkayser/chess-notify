import { type AndroidSymbol, type SFSymbol, SymbolView } from "expo-symbols";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";
import { colors } from "@/presentation/theme/tokens";

const icons = {
    search: { ios: "magnifyingglass", android: "search" },
    close: { ios: "xmark", android: "close" },
    external: { ios: "arrow.up.right", android: "arrow_outward" },
    bell: { ios: "bell.fill", android: "notifications" },
    bellOff: { ios: "bell.slash.fill", android: "notifications_off" },
    add: { ios: "plus", android: "add" },
    check: { ios: "checkmark", android: "check" },
    link: { ios: "link", android: "link" },
    warning: { ios: "exclamationmark.triangle.fill", android: "warning" },
    knight: { ios: "crown.fill", android: "chess_knight" },
    trophy: { ios: "trophy.fill", android: "trophy" },
    trash: { ios: "trash", android: "delete" },
    globe: { ios: "globe", android: "globe" },
    chevronDown: { ios: "chevron.down", android: "keyboard_arrow_down" },
    chevronUp: { ios: "chevron.up", android: "keyboard_arrow_up" },
    dots: { ios: "ellipsis", android: "more_horiz" },
} as const satisfies Record<string, { ios: SFSymbol; android: AndroidSymbol }>;

export type IconName = keyof typeof icons;

interface IconProps {
    name: IconName;
    size?: number;
    color?: ColorValue;
    style?: StyleProp<ViewStyle>;
}

export function Icon({
    name,
    size = 20,
    color = colors.smoke,
    style,
}: IconProps) {
    const { ios, android } = icons[name];

    return (
        <SymbolView
            name={{ ios, android, web: android }}
            size={size}
            tintColor={color}
            weight="medium"
            style={style}
        />
    );
}
