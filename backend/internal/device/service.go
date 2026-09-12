package device

import (
	"context"
	"crypto/sha256"

	"github.com/google/uuid"
)

type Service struct {
	repository Repository
}

func NewService(repository Repository) *Service {
	return &Service{
		repository: repository,
	}
}

func (s *Service) RegisterDevice(ctx context.Context, req RegisterDeviceRequest) (*Device, error) {
	id := uuid.NewString()
	hash := sha256.New()

	credentialHash := id + req.PushToken + req.AppVersion + req.Platform

	hash.Write([]byte(credentialHash))

	device := Device{
		ID: id,
		CredentialHash: string(hash.Sum(nil)),
		PushToken: req.PushToken,
		AppVersion: req.AppVersion,
		Platform: req.Platform,
	}

	err := s.repository.Create(ctx, &device)

	if err != nil {
		return nil, err
	}

	return &device, nil
}

func (s *Service) Authenticate(ctx context.Context, token string) (*Device, error) {
	device, err := s.repository.FindByCredentialsHash(ctx, token)

	if err != nil {
		return nil, err
	}

	return device, nil
}