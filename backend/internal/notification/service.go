package notification

import (
	"context"
	"fmt"
	"log"
)

type Provider interface {
	Send(context.Context, Notification) error
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
		notification := Notification{
			TournamentID:    tournamentId,
			DevicePushToken: sub.DevicePushToken,
			Title:           "Nova rodada: " + sub.TournamentName,
			Message:         fmt.Sprintf("Rodada %d de %d emparceirada", sub.TournamentRound, sub.TournamentTotal),
			Data:            map[string]string{},
		}

		// Outbox Pattern
		err := s.repository.CreateNotification(ctx, notification)

		if err != nil {
			log.Printf("Error trying to notify device: %s\n", sub.DeviceID)
			continue
		}

		err = s.provider.Send(ctx, notification)

		log.Printf("Notification sent to %s\n", sub.DevicePushToken)

		if err != nil {
			log.Printf("Error trying to notify device: %s\n", sub.DeviceID)
			continue
		}
	}

	return nil
}

func (s *Service) List(ctx context.Context, deviceId string) (*[]Notification, error) {
	notifications, err := s.repository.ListNotifications(ctx, deviceId)
	if err != nil {
		return nil, err
	}
	return notifications, nil
}
