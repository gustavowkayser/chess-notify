import Constants from "expo-constants";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import CreateDeviceUseCase from "@/application/useCases/CreateDeviceUseCase";
import { api } from "@/infrastructure/services/api";
import DeviceService from "@/infrastructure/services/deviceService";
import {
    getRoundNotificationsEnabled,
    setRoundNotificationsEnabled,
} from "@/infrastructure/storage/notificationPreference";

export function useDevice() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [isUpdatingNotifications, setUpdatingNotifications] = useState(false);

    useEffect(() => {
        getRoundNotificationsEnabled().then(setNotificationsEnabled);
    }, []);

    const upsertDevice = (pushToken: string, enabled: boolean) => {
        const service = new DeviceService(api);
        const useCase = new CreateDeviceUseCase(service);

        return useCase.execute({
            pushToken: pushToken,
            appVersion: Constants.manifest2?.runtimeVersion ?? "0.0.0",
            platform: Platform.OS,
            notificationsEnabled: enabled,
        });
    };

    const createDevice = async (pushToken: string) => {
        setLoading(true);
        setError(null);

        try {
            await upsertDevice(pushToken, await getRoundNotificationsEnabled());
        } catch (error: any) {
            console.log("Error: ", JSON.stringify(error, null, 2));
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    /** Turns round notifications on or off, reverting if the update fails. */
    const toggleNotifications = async (pushToken: string, enabled: boolean) => {
        const previous = notificationsEnabled;

        setNotificationsEnabled(enabled);
        setUpdatingNotifications(true);

        try {
            await upsertDevice(pushToken, enabled);
            await setRoundNotificationsEnabled(enabled);
        } catch (error) {
            setNotificationsEnabled(previous);
            throw error;
        } finally {
            setUpdatingNotifications(false);
        }
    };

    return {
        createDevice,
        isLoading,
        error,
        notificationsEnabled,
        isUpdatingNotifications,
        toggleNotifications,
    };
}
