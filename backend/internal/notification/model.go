package notification

type Notification struct {
	TournamentID      string
	DevicePushToken   string
	Title             string
	Message           string
	Data              map[string]string
}
