package auth

import "github.com/google/uuid"

type Service struct {}

func NewService() Service {
	return Service{}
}

func (s *Service) CreateToken() string {
	token := uuid.New()

	return token.String()
}
