package device

type Device struct {
	ID             string
	Credentials    string
	CredentialHash string
	PushToken      string
	Platform       string
	AppVersion     string
	Active         bool
}

type ArgonConfig struct {
    Salt       []byte
    TimeCost   uint32
    MemoryCost uint32
    Threads    uint8
    KeyLength  uint32
}