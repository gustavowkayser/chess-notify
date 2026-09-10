package subscription

import (
	"chess-notify/internal/chessresults"
	"chess-notify/internal/database"
)

type Service struct {
	chessresultsProvider *chessresults.ChessResultsProvider
	repository           *database.Repository
}

func NewService(chessresultsProvider *chessresults.ChessResultsProvider, repo *database.Repository) Service {
	return Service{
		chessresultsProvider: chessresultsProvider,
		repository:           repo,
	}
}

func (s *Service) Subscribe(tournamentUrl, userId string) (*string, error) {
	// Get tournament if exists
	tournament, exists := s.repository.GetTournamentByURL(tournamentUrl)

	// If not, create a new one
	if !exists {
		tournament, err := s.chessresultsProvider.GetTournament(tournamentUrl)

		if err != nil {
			return nil, err
		}

		err = s.repository.CreateTournament(*tournament)

		if err != nil {
			return nil, err
		}
	}

	// Create subscription
	id, err := s.repository.CreateSubscription(tournament.ID, userId)

	return id, err
}
