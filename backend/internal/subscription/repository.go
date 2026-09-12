package subscription

import (
	"context"
	"database/sql"
)

type Repository interface {
	Create(ctx context.Context, subscription *Subscription) error
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, subscription *Subscription) error {
	query := `
		INSERT INTO subscriptions (
			id,
			device_id,
			tournament_id
		) VALUES ($1, $2, $3)
		RETURNING id;
	`

	_, err := r.db.ExecContext(ctx, query, subscription.ID, subscription.DeviceID, subscription.TournamentID)

	return err
}
