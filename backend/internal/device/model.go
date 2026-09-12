package device

type Device struct {
	ID string
	CredentialHash string
	PushToken string
	Platform string
	AppVersion string
	Active bool
}
