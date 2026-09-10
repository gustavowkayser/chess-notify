package database

import (
	"context"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Repository struct {
	db  *gorm.DB
	ctx context.Context
}

func NewRepository(db *gorm.DB, ctx context.Context) Repository {
	return Repository{
		db:  db,
		ctx: ctx,
	}
}

func (r *Repository) GetTournamentByURL(tournamentUrl string) (*Tournament, bool) {
	tournament, err := gorm.G[Tournament](r.db).Where("url = ?", tournamentUrl).First(r.ctx)

	if err != nil {
		return nil, false
	}

	return &tournament, true
}

func (r *Repository) CreateTournament(tournament Tournament) error {
	err := gorm.G[Tournament](r.db).Create(r.ctx, &tournament)

	return err
}

func (r *Repository) CreateSubscription(tournamentId, userId string) (*string, error) {
	subscription := &Subscription{
		ID: uuid.New().String(), 
		TournamentID: tournamentId, 
		UserID: userId,
		Active: true,
	}
	err := gorm.G[Subscription](r.db).Create(r.ctx, subscription)

	if err != nil {
		return nil, err
	}

	return &subscription.ID, nil
}

func (r *Repository) DeactivateSubscription(id string) error {
	_, err := gorm.G[Subscription](r.db).Update(r.ctx, "active", false)

	return err
}

func (r *Repository) GetActiveTournaments() (*[]Tournament, error) {
	tournaments, err := gorm.G[Tournament](r.db).Where("active = true").Find(r.ctx)

	if err != nil {
		return nil, err
	}

	return &tournaments, nil
}
