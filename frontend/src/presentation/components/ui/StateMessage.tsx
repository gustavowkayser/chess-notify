import { View } from "react-native";
import { AppText } from "@/presentation/components/ui/AppText";
import { GlassButton } from "@/presentation/components/ui/GlassButton";
import { GlassSurface } from "@/presentation/components/ui/GlassSurface";
import { Icon, type IconName } from "@/presentation/components/ui/Icon";
import { colors } from "@/presentation/theme/tokens";

interface StateMessageProps {
    icon: IconName;
    title: string;
    description?: string;
    action?: { label: string; icon?: IconName; onPress: () => void };
}

export function StateMessage({
    icon,
    title,
    description,
    action,
}: StateMessageProps) {
    return (
        <GlassSurface tone="dim" className="items-center gap-3 px-6 py-8">
            <View className="mb-1 h-14 w-14 items-center justify-center rounded-full bg-accent-deep">
                <Icon name={icon} size={24} color={colors.accent} />
            </View>
            <AppText variant="title" className="text-center">
                {title}
            </AppText>
            {description && (
                <AppText tone="muted" className="text-center text-sm leading-5">
                    {description}
                </AppText>
            )}
            {action && (
                <GlassButton
                    tone="dim"
                    label={action.label}
                    icon={action.icon}
                    onPress={action.onPress}
                    style={{ marginTop: 8 }}
                />
            )}
        </GlassSurface>
    );
}
