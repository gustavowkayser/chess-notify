import { Text, View } from "react-native";
import "@/global.css";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotification } from "@/presentation/context/NotificationContext";
import { useDevice } from "@/presentation/hooks/useDevice";

export default function HomeScreen() {
    const { expoPushToken, error: _notificationError, notification: _notification } = useNotification();
    const { createDevice, isLoading: _isLoading, error: _deviceError } = useDevice();

    useEffect(() => {
        if (expoPushToken) {
            createDevice(expoPushToken);
        }
    }, [expoPushToken]);

    return (
        <SafeAreaView>
            <View className="flex justify-center items-center bg-blue-700 h-full">
                <Text className="font-normal text-xl">Hello World</Text>
            </View>
        </SafeAreaView>
    );
}
