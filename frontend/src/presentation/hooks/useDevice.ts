import Constants from "expo-constants";
import { useState } from "react";
import { Platform } from "react-native";
import CreateDeviceUseCase from "@/application/useCases/CreateDeviceUseCase";
import { api } from "@/infrastructure/services/api";
import DeviceService from "@/infrastructure/services/deviceService";

export function useDevice() {
    const [isLoading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createDevice = async (pushToken: string) => {
        setLoading(true);
        setError(null);

        try {
            const service = new DeviceService(api);
            const useCase = new CreateDeviceUseCase(service);

            await useCase.execute({
                pushToken: pushToken,
                appVersion: Constants.manifest2?.runtimeVersion ?? "0.0.0",
                platform: Platform.OS,
            });
        } catch (error: any) {
            console.log("Error: ", JSON.stringify(error, null, 2));
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { createDevice, isLoading, error };
}
