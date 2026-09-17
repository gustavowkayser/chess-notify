import type { RefObject } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, TextInput, View } from "react-native";
import Animated, {
    FadeIn,
    FadeOut,
    LinearTransition,
} from "react-native-reanimated";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon } from "@/presentation/components/ui/Icon";
import { colors } from "@/presentation/theme/tokens";

const LAYOUT = LinearTransition.duration(240);

interface SearchBarProps {
    inputRef: RefObject<TextInput | null>;
    value: string;
    isActive: boolean;
    onChangeText: (value: string) => void;
    onFocus: () => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export function SearchBar({
    inputRef,
    value,
    isActive,
    onChangeText,
    onFocus,
    onCancel,
    onSubmit,
}: SearchBarProps) {
    const { t } = useTranslation();
    return (
        <View className="flex-row items-center gap-3">
            <Animated.View layout={LAYOUT} style={{ flex: 1 }}>
                <GlassSurface
                    radius={999}
                    className="h-13 flex-row items-center gap-2.5 pl-4 pr-2"
                    style={isActive && activeStyle}
                >
                    <Icon
                        name="search"
                        size={18}
                        color={isActive ? colors.accent : colors.muted}
                    />
                    <TextInput
                        ref={inputRef}
                        value={value}
                        onChangeText={onChangeText}
                        onFocus={onFocus}
                        onSubmitEditing={onSubmit}
                        placeholder={t("search.placeholder")}
                        placeholderTextColor={colors.muted}
                        selectionColor={colors.accent}
                        cursorColor={colors.accent}
                        keyboardAppearance="dark"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="search"
                        className="h-full flex-1 py-0 font-inter text-base text-smoke"
                    />
                    {value.length > 0 && (
                        <Pressable
                            accessibilityRole="button"
                            accessibilityLabel={t("search.clear")}
                            hitSlop={8}
                            onPress={() => onChangeText("")}
                            className="h-8 w-8 items-center justify-center rounded-full bg-surface-raised"
                        >
                            <Icon name="close" size={14} color={colors.muted} />
                        </Pressable>
                    )}
                </GlassSurface>
            </Animated.View>

            {isActive && (
                <Animated.View
                    entering={FadeIn.duration(220)}
                    exiting={FadeOut.duration(120)}
                    layout={LAYOUT}
                >
                    <Pressable
                        accessibilityRole="button"
                        hitSlop={10}
                        onPress={onCancel}
                    >
                        <AppText variant="label" tone="accent">
                            {t("common.cancel")}
                        </AppText>
                    </Pressable>
                </Animated.View>
            )}
        </View>
    );
}

const activeStyle = {
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    borderLeftColor: "rgba(255, 255, 255, 0.05)",
    borderRightColor: "rgba(255, 255, 255, 0.05)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
    boxShadow: "0 0 12px rgba(27, 69, 255, 0)",
};
