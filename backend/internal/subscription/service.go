package subscription

import (
	"chess-notify/internal/chess"
	"chess-notify/internal/tournament"
	"context"
	"database/sql"
	"errors"

	"github.com/google/uuid"
)

type CreateSubscriptionInput struct {
	DeviceID      string
	TournamentURL string
}

type RemoveSubscriptionInput struct {
	DeviceID       string
	SubscriptionID string
}

type Service struct {
	repository           Repository
	tournamentRepository tournament.Repository
	chessProvider        chess.Provider
}

func NewService(
	repository Repository,
	tournamentRepository tournament.Repository,
	chessProvider chess.Provider,
) *Service {
	return &Service{
		repository:           repository,
		tournamentRepository: tournamentRepository,
		chessProvider:        chessProvider,
	}
}

func (s *Service) Subscribe(ctx context.Context, input CreateSubscriptionInput) (*Subscription, error) {
	tournament, err := s.UpsertTournament(ctx, input.TournamentURL)

	if err != nil {
		return nil, err
	}

	subscription := Subscription{
		ID:           uuid.NewString(),
		DeviceID:     input.DeviceID,
		TournamentID: tournament.ID,
	}

	err = s.repository.Create(ctx, &subscription)

	if err != nil {
		return nil, err
	}

	return &subscription, err
}

func (s *Service) Unsubscribe(ctx context.Context, input RemoveSubscriptionInput) error {
	subscription, err := s.repository.GetByID(ctx, input.SubscriptionID)

	if err != nil {
		return err
	}

	if subscription.DeviceID != input.DeviceID {
		return errors.New("Not authorized to perform this operation")
	}

	if err = s.repository.Delete(ctx, subscription.ID); err != nil {
		return err
	}

	return nil
}

func (s *Service) UpsertTournament(ctx context.Context, url string) (*tournament.Tournament, error) {
	existing, err := s.tournamentRepository.GetByURL(ctx, url)

	if existing != nil {
		return existing, nil
	}

	if !errors.Is(err, sql.ErrNoRows) {
		return nil, err
	}

	tournament, err := s.chessProvider.GetTournament(url)

	if err != nil {
		return nil, err
	}

	err = s.tournamentRepository.Create(ctx, tournament)

	if err != nil {
		return nil, err
	}

	return tournament, nil
}
