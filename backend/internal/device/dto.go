package device

type RegisterDeviceRequest struct {
	PushToken string `json:"pushToken"`
	Platform string `json:"platform"`
	AppVersion string `json:"appVersion"`
}

type RegisterDeviceResponse struct {
	DeviceID string `json:"deviceId"`
	DeviceToken string `json:"deviceToken"`
}
