package tournament

type TournamentView struct {
	TournamentURL  string `json:"tournament_url"`
	TournamentName string `json:"tournament_name"`
}

type SearchTournamentsResponse = []TournamentView
