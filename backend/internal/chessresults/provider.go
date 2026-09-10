package chessresults

import (
	"chess-notify/internal/database"

	"github.com/google/uuid"
)

type ChessResultsProvider struct{}

func NewChessResultsProvider() ChessResultsProvider {
	return ChessResultsProvider{}
}

func (p *ChessResultsProvider) GetTournament(tournamentUrl string) (*database.Tournament, error) {
	return &database.Tournament{
		ID:           uuid.New().String(),
		Name:         "Teste",
		URL:          "https://chess-results.com/",
		CurrentRound: 1,
		TotalRounds:  9,
		Active:       true,
	}, nil
}
