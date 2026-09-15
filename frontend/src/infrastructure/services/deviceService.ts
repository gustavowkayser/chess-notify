import type { AxiosInstance } from "axios";

interface Response<T> {
    success: boolean;
    message: string;
    data: T;
}

interface CreateDeviceRequest {
    pushToken: string;
    appVersion: string;
    platform: string;
}

interface CreateDeviceResponse {
    deviceId: string;
    deviceToken: string;
}

interface UpdateDeviceRequest {
    pushToken: string;
    deviceToken: string;
}

interface UpdateDeviceResponse {
    deviceId: string;
}

export default class DeviceService {
    constructor(readonly apiClient: AxiosInstance) {}

    public async createDevice(
        request: CreateDeviceRequest,
    ): Promise<Response<CreateDeviceResponse>> {
        const response = await this.apiClient.post("/v1/devices", request);
        return response.data;
    }

    public async updateDevice(
        request: UpdateDeviceRequest,
    ): Promise<Response<UpdateDeviceResponse>> {
        const response = await this.apiClient.put("/v1/devices", request);
        return response.data;
    }
}
