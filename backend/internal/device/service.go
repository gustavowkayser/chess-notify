package device

import (
	"context"
	"crypto/sha256"
	"encoding/hex"

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

	credential := id + req.PushToken + req.AppVersion + req.Platform

	hash := sha256.Sum256([]byte(credential))
	credentialHash := hex.EncodeToString(hash[:])

	device := Device{
		ID: id,
		CredentialHash: credentialHash,
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