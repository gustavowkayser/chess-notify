import { View } from "react-native";
import { NotificationButton } from "@/presentation/components/home/NotificationButton";
import { LanguageExpandableButton } from "@/presentation/components/language/LanguageExpandableButton";

export type AlertsStatus = "on" | "off" | "pending";

interface HomeHeaderProps {
    notificationsEnabled: boolean;
    isNotificationsAvailable: boolean;
    isUpdatingNotifications: boolean;
    onToggleNotifications: (enabled: boolean) => void;
    isLanguageOpen?: boolean;
    onToggleLanguage?: () => void;
    onCloseLanguage?: () => void;
}

export function HomeHeader({
    notificationsEnabled,
    isNotificationsAvailable,
    isUpdatingNotifications,
    onToggleNotifications,
    isLanguageOpen,
    onToggleLanguage,
    onCloseLanguage,
}: HomeHeaderProps) {
    return (
        <View className="flex-row items-center justify-between">
            <NotificationButton
                enabled={notificationsEnabled}
                isAvailable={isNotificationsAvailable}
                isUpdating={isUpdatingNotifications}
                onChange={onToggleNotifications}
            />
            <LanguageExpandableButton
                isOpen={isLanguageOpen}
                onToggle={onToggleLanguage}
                onClose={onCloseLanguage}
            />
        </View>
    );
}
