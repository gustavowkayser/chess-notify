import { setItemAsync } from "expo-secure-store";
import type DeviceService from "@/infrastructure/services/deviceService";

export interface CreateDeviceInput {
    pushToken: string;
    appVersion: string;
    platform: string;
    notificationsEnabled: boolean;
}

export default class CreateDeviceUseCase {
    constructor(readonly deviceService: DeviceService) {}

    async execute(input: CreateDeviceInput) {
        const device = await this.deviceService.upsertDevice({
            pushToken: input.pushToken,
            appVersion: input.appVersion,
            platform: input.platform,
            active: input.notificationsEnabled,
        });

        await setItemAsync("credentialsToken", device.data.deviceToken);

        return;
    }
}
