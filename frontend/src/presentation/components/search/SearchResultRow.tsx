import type { ReactNode } from "react";
import { Pressable, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { AppText } from "@/presentation/components/ui/AppText";
import type { IconName } from "@/presentation/components/ui/Icon";

interface SearchResultRowProps {
    icon: IconName;
    title: string;
    subtitle: string;
    /** Position in the list, used to stagger the entrance. */
    index?: number;
    highlighted?: boolean;
    trailing?: ReactNode;
    onPress?: () => void;
}

export function SearchResultRow({
    icon,
    title,
    subtitle,
    index = 0,
    highlighted = false,
    trailing,
    onPress,
}: SearchResultRowProps) {
    return (
        <Animated.View
            entering={FadeInUp.delay(80 + index * 40)
                .duration(280)
                .withInitialValues({ transform: [{ translateY: -10 }] })}
        >
            <Pressable
                disabled={!onPress}
                onPress={onPress}
                className="flex-row items-center gap-3 rounded-2xl p-3 active:bg-white/5"
            >
                <View className="flex-1 gap-0.5">
                    <AppText variant="label" numberOfLines={1}>
                        {title}
                    </AppText>
                    <AppText variant="caption" numberOfLines={1}>
                        {subtitle}
                    </AppText>
                </View>
                {trailing}
            </Pressable>
        </Animated.View>
    );
}
