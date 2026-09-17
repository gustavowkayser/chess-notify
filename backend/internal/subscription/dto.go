package subscription

type CreateSubscriptionRequest struct {
	TournamentURL string
}

type CreateSubscriptionResponse struct {
	SubscriptionID string `json:"subscription_id"`
}

type RemoveSubscriptionRequest struct {
	SubscriptionID string
}

type RemoveSubscriptionResponse struct {
	SubscriptionID string
}

type ListSubscriptionsResponse = ListSubscriptionsView
