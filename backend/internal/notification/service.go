package notification

import (
	"context"
	"log"
)

type Provider interface {
	Send(context.Context, string, string, string, map[string]string) error
}

type Service struct {
	repository Repository
	provider   Provider
}

func NewService(repository Repository, provider Provider) *Service {
	return &Service{
		repository: repository,
		provider:   provider,
	}
}

func (s *Service) SendNotification(
	ctx context.Context,
	tournamentId string,
) error {
	subs, err := s.repository.GetSubscriptionsWithDevice(ctx, tournamentId)

	if err != nil {
		return err
	}

	for _, sub := range *subs {
		err := s.provider.Send(
			ctx,
			sub.DevicePushToken,
			"Nova rodada: "+sub.TournamentName,
			"Rodada "+string(sub.TournamentRound)+" de "+string(sub.TournamentTotal)+" lançada",
			map[string]string{},
		)

		log.Printf("Notification sent to %s\n", sub.DevicePushToken)

		if err != nil {
			log.Printf("Error trying to notify device: %s\n", sub.DeviceID)
			continue
		}
	}

	return nil
}
