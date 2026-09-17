import { useRef, useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon } from "@/presentation/components/ui/Icon";
import { useLanguage } from "@/presentation/hooks/useLanguage";
import { colors, radii } from "@/presentation/theme/tokens";

export function LanguageDropdown() {
    const { currentOption, languages, changeLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<View>(null);
    const [menuLayout, setMenuLayout] = useState<{
        top: number;
        right: number;
    } | null>(null);

    const openDropdown = () => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
            const screenWidth = Dimensions.get("window").width;
            setMenuLayout({
                top: y + height + 6,
                right: Math.max(16, screenWidth - (x + width)),
            });
            setIsOpen(true);
        });
    };

    const handleSelect = async (code: typeof currentOption.code) => {
        setIsOpen(false);
        await changeLanguage(code);
    };

    return (
        <>
            <View ref={triggerRef} collapsable={false}>
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t("language.select")}
                    accessibilityState={{ expanded: isOpen }}
                    onPress={openDropdown}
                    className="active:opacity-80"
                >
                    <GlassSurface
                        radius={radii.full}
                        className="h-11 flex-row items-center gap-2 px-3.5"
                        style={
                            isOpen
                                ? {
                                      borderColor: colors.accent,
                                      boxShadow:
                                          "0 0 12px rgba(27, 69, 255, 0.4)",
                                  }
                                : undefined
                        }
                    >
                        <Icon
                            name="globe"
                            size={16}
                            color={isOpen ? colors.accent : colors.smoke}
                        />
                        <AppText variant="label" className="text-smoke">
                            {currentOption.nativeName}
                        </AppText>
                        <Icon
                            name={isOpen ? "chevronUp" : "chevronDown"}
                            size={12}
                            color={colors.muted}
                        />
                    </GlassSurface>
                </Pressable>
            </View>

            <Modal
                transparent
                visible={isOpen}
                animationType="none"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => setIsOpen(false)}
                >
                    {menuLayout && (
                        <Animated.View
                            entering={FadeInDown.duration(180)}
                            exiting={FadeOutUp.duration(120)}
                            style={[
                                styles.menuContainer,
                                {
                                    top: menuLayout.top,
                                    right: menuLayout.right,
                                },
                            ]}
                        >
                            <GlassSurface
                                tone="dim"
                                radius={radii.lg}
                                className="p-1.5 min-w-[170px]"
                                style={styles.menuSurface}
                            >
                                <View className="px-3 py-1.5 border-b border-border-hairline mb-1">
                                    <AppText
                                        variant="caption"
                                        className="text-muted text-[11px] uppercase tracking-wider"
                                    >
                                        {t("language.select")}
                                    </AppText>
                                </View>

                                {languages.map((lang) => {
                                    const isSelected =
                                        lang.code === currentOption.code;

                                    return (
                                        <Pressable
                                            key={lang.code}
                                            accessibilityRole="button"
                                            accessibilityLabel={lang.nativeName}
                                            accessibilityState={{
                                                selected: isSelected,
                                            }}
                                            onPress={() =>
                                                handleSelect(lang.code)
                                            }
                                            className={`flex-row items-center justify-between px-3 py-2.5 rounded-lg active:bg-surface-raised ${
                                                isSelected
                                                    ? "bg-surface-raised/80"
                                                    : ""
                                            }`}
                                        >
                                            <View className="flex-row items-center gap-2.5">
                                                <AppText className="text-base">
                                                    {lang.flag}
                                                </AppText>
                                                <AppText
                                                    variant="label"
                                                    className={
                                                        isSelected
                                                            ? "text-smoke font-inter-semibold"
                                                            : "text-smoke/80 font-inter"
                                                    }
                                                >
                                                    {lang.nativeName}
                                                </AppText>
                                            </View>

                                            {isSelected && (
                                                <Icon
                                                    name="check"
                                                    size={14}
                                                    color={colors.accent}
                                                />
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </GlassSurface>
                        </Animated.View>
                    )}
                </Pressable>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    menuContainer: {
        position: "absolute",
        zIndex: 9999,
    },
    menuSurface: {
        backgroundColor: "rgba(18, 22, 31, 0.95)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.6)",
    },
});
