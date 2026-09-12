package tournament

import (
	"context"
	"log"
	"sync"
)

type Service struct {
	provider   Provider
	repository Repository
}

func NewService(provider Provider, repository Repository) *Service {
	return &Service{
		provider:   provider,
		repository: repository,
	}
}

func (s *Service) Refresh(ctx context.Context) {
	// Runs every minute
	log.Println("Refresh tournaments...")

	jobs := make(chan *Tournament)

	var wg sync.WaitGroup

	for i := 0; i < 10; i++ {
		wg.Add(1)

		go func() {
			defer wg.Done()
			s.Worker(ctx, jobs)
		}()
	}

	tournaments, err := s.repository.GetAllActive(ctx)

	if err != nil {
		log.Fatalf("Error occured on refresh job: %s\n", err.Error())
		return
	}

	log.Printf("Found %d tournaments\n", len(*tournaments))

	for i := range *tournaments {
		select {
		case jobs <- &(*tournaments)[i]:
		case <-ctx.Done():
			break
		}
	}

	close(jobs)

	wg.Wait()
}

func (s *Service) Worker(ctx context.Context, jobs chan *Tournament) {
	for {
		select {
		case tournament, ok := <-jobs:
			if !ok {
				return
			}

			log.Printf("Processing tournament: %s\n", tournament.ID)

			updated, err := s.provider.GetTournament(tournament.URL)

			if err != nil {
				continue
			}

			if tournament.CurrentRound == updated.CurrentRound {
				continue
			}

			err = s.repository.Update(ctx, tournament.ID, updated)

			if err != nil {
				log.Printf("Error occured when updating tournament: %s\n", err.Error())
			}

		case <-ctx.Done():
			return
		}
	}
}
