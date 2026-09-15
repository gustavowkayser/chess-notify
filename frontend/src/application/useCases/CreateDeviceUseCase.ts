import { getItemAsync, setItemAsync } from "expo-secure-store";
import type DeviceService from "@/infrastructure/services/deviceService";

export interface CreateDeviceInput {
    pushToken: string;
    appVersion: string;
    platform: string;
}

export default class CreateDeviceUseCase {
    constructor(readonly deviceService: DeviceService) {}

    async execute(input: CreateDeviceInput) {
        const credentialsToken = await getItemAsync("credentialsToken");

        if (!credentialsToken) {
            const device = await this.deviceService.createDevice({
                pushToken: input.pushToken,
                appVersion: input.appVersion,
                platform: input.platform,
            });

            await setItemAsync("credentialsToken", device.data.deviceToken);

            return;
        }

        await this.deviceService.updateDevice({
            pushToken: input.pushToken,
            deviceToken: credentialsToken,
        });
    }
}
