package subscription

import (
	"context"
	"database/sql"
)

type Repository interface {
	Create(ctx context.Context, subscription *Subscription) error
	GetByID(ctx context.Context, id string) (*Subscription, error)
	Delete(ctx context.Context, id string) error
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

func (r *repository) GetByID(ctx context.Context, id string) (*Subscription, error) {
	query := `
		SELECT id, device_id, tournament_id FROM subscriptions
		WHERE id = $1;
	`

	var subscription Subscription
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&subscription.ID,
		&subscription.DeviceID,
		&subscription.TournamentID,
	)

	if err != nil {
		return nil, err
	}

	return &subscription, nil
}

func (r *repository) Delete(ctx context.Context, id string) error {
	query := `
		DELETE FROM subscriptions WHERE id = $1;
	`

	_, err := r.db.ExecContext(ctx, query, id)

	return err
}