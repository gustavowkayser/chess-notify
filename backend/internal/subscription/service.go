package subscription

import (
	"context"

	"github.com/google/uuid"
)

type CreateSubscriptionInput struct {
	DeviceID string
	TournamentID string
}

type Service struct {
	repository Repository
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) CreateSubscription(ctx context.Context, input CreateSubscriptionInput) (*Subscription, error) {
	subscription := Subscription{
		ID: uuid.NewString(),
		DeviceID: input.DeviceID,
		TournamentID: input.TournamentID,
	}

	err := s.repository.Create(ctx, &subscription)

	if err != nil {
		return nil, err
	}

	return &subscription, err
}