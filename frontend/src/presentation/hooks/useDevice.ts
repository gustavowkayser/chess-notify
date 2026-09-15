import { useState } from "react";
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
                appVersion: process.env.EXPO_PUBLIC_APP_VERSION ?? "Unknown",
                platform: process.env.EXPO_OS?.toLowerCase() ?? "Unknown",
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
