import type { AxiosInstance } from "axios";

interface Response<T> {
    success: boolean;
    message: string;
    data: T;
}

interface UpsertDeviceRequest {
    pushToken: string;
    appVersion: string;
    platform: string;
}

interface UpsertDeviceResponse {
    deviceId: string;
    deviceToken: string;
}

export default class DeviceService {
    constructor(readonly apiClient: AxiosInstance) {}

    public async upsertDevice(
        request: UpsertDeviceRequest,
    ): Promise<Response<UpsertDeviceResponse>> {
        const response = await this.apiClient.put("/v1/devices", request);
        return response.data;
    }
}
