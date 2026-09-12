package tournament

import (
	"context"
	"database/sql"
)

type Repository interface {
	Create(ctx context.Context, tournament *Tournament) error
	GetByURL(ctx context.Context, url string) (*Tournament, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, tournament *Tournament) error {
	query := `
		INSERT INTO tournaments (
			id,
			url,
			current_round,
			total_rounds,
			name,
			last_checked_at
		) VALUES ($1, $2, $3, $4, $5, $6);
	`

	_, err := r.db.ExecContext(
		ctx, 
		query,
		tournament.ID,
		tournament.URL,
		tournament.CurrentRound,
		tournament.TotalRounds,
		tournament.Name,
		tournament.LastCheckedAt,
	)

	return err
}

func (r *repository) GetByURL(ctx context.Context, url string) (*Tournament, error) {
	query := `
		SELECT id, url, name, current_round, total_rounds, last_checked_at, created_at, updated_at
		FROM tournaments WHERE url = $1;
	`

	var tournament Tournament
	err := r.db.QueryRowContext(ctx, query, url).Scan(
		&tournament.ID,
		&tournament.URL,
		&tournament.Name,
		&tournament.CurrentRound,
		&tournament.TotalRounds,
		&tournament.LastCheckedAt,
		&tournament.CreatedAt,
		&tournament.UpdatedAt,
	)

	if err != nil {
		return nil, err
	}

	return &tournament, nil
}