import { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon } from "@/presentation/components/ui/Icon";
import { useLanguage } from "@/presentation/hooks/useLanguage";
import { colors, radii } from "@/presentation/theme/tokens";

const COLLAPSED_WIDTH = 44;
const EXPANDED_WIDTH = 176;

interface LanguageExpandableButtonProps {
    isOpen?: boolean;
    onToggle?: () => void;
    onClose?: () => void;
}

export function LanguageExpandableButton({
    isOpen: controlledIsOpen,
    onToggle: controlledOnToggle,
    onClose: controlledOnClose,
}: LanguageExpandableButtonProps) {
    const { currentOption, languages, changeLanguage, t } = useLanguage();
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isControlled = controlledIsOpen !== undefined;
    const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

    const toggle = () => {
        if (isControlled) {
            controlledOnToggle?.();
        } else {
            setInternalIsOpen((prev) => !prev);
        }
    };

    const close = () => {
        if (isControlled) {
            controlledOnClose?.();
        } else {
            setInternalIsOpen(false);
        }
    };

    const progress = useSharedValue(isOpen ? 1 : 0);

    useEffect(() => {
        progress.value = withSpring(isOpen ? 1 : 0, {
            damping: 20,
            stiffness: 220,
            mass: 0.8,
        });
    }, [isOpen, progress]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const width = interpolate(
            progress.value,
            [0, 1],
            [COLLAPSED_WIDTH, EXPANDED_WIDTH],
        );
        return {
            width,
        };
    });

    const animatedOptionsStyle = useAnimatedStyle(() => {
        const opacity = interpolate(progress.value, [0, 0.4, 1], [0, 0, 1]);
        const translateX = interpolate(progress.value, [0, 1], [16, 0]);
        return {
            opacity,
            transform: [{ translateX }],
        };
    });

    const handleSelectLanguage = async (code: typeof currentOption.code) => {
        await changeLanguage(code);
        close();
    };

    return (
        <View style={styles.anchorWrapper}>
            <Animated.View style={[styles.container, animatedContainerStyle]}>
                <GlassSurface
                    radius={radii.full}
                    tone="lit"
                    style={[styles.surface, isOpen && styles.activeSurface]}
                >
                    <Animated.View
                        style={[styles.optionsContainer, animatedOptionsStyle]}
                        pointerEvents={isOpen ? "auto" : "none"}
                    >
                        {languages.map((lang) => {
                            const isSelected = lang.code === currentOption.code;

                            return (
                                <Pressable
                                    key={lang.code}
                                    accessibilityRole="button"
                                    accessibilityLabel={lang.nativeName}
                                    accessibilityState={{
                                        selected: isSelected,
                                    }}
                                    onPress={() =>
                                        handleSelectLanguage(lang.code)
                                    }
                                    className="active:opacity-70"
                                    style={[
                                        styles.langButton,
                                        isSelected && styles.selectedLangButton,
                                    ]}
                                >
                                    <AppText style={styles.flagText}>
                                        {lang.flag}
                                    </AppText>
                                </Pressable>
                            );
                        })}
                    </Animated.View>

                    <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={t("language.select")}
                        accessibilityState={{ expanded: isOpen }}
                        onPress={toggle}
                        className="active:opacity-80"
                        style={styles.dotsButton}
                    >
                        <Icon
                            name="dots"
                            size={18}
                            color={isOpen ? colors.accent : colors.smoke}
                        />
                    </Pressable>
                </GlassSurface>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    anchorWrapper: {
        alignItems: "flex-end",
        justifyContent: "center",
        height: 44,
    },
    container: {
        height: 44,
        overflow: "hidden",
        borderRadius: radii.full,
    },
    surface: {
        height: 44,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    activeSurface: {
        borderColor: colors.accent,
        boxShadow: "0 0 12px rgba(27, 69, 255, 0.4)",
    },
    optionsContainer: {
        position: "absolute",
        left: 6,
        right: 44,
        top: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
    },
    langButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedLangButton: {
        backgroundColor: "rgba(27, 42, 82, 0.8)",
        borderWidth: 1,
        borderColor: colors.accent,
    },
    flagText: {
        fontSize: 18,
        lineHeight: 22,
        textAlign: "center",
        includeFontPadding: false,
    },
    dotsButton: {
        width: 44,
        height: 44,
        alignItems: "center",
        justifyContent: "center",
    },
});
