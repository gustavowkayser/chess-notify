package subscription

type SubscriptionView struct {
	ID                    string `json:"id"`
	TournamentID          string `json:"tournament_id"`
	TournamentName        string `json:"tournament_name"`
	TournamentRound       int    `json:"tournament_round"`
	TournamentTotalRounds int    `json:"tournament_total_rounds"`
}

type ListSubscriptionsView = []SubscriptionView
