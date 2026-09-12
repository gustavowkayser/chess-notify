package tournament

import (
	"context"
	"database/sql"
	"log"
)

type Repository interface {
	Create(ctx context.Context, tournament *Tournament) error
	GetByURL(ctx context.Context, url string) (*Tournament, error)
	GetAllActive(ctx context.Context) (*[]Tournament, error)
	Update(ctx context.Context, id string, tournament *Tournament) error
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

func (r *repository) GetAllActive(ctx context.Context) (*[]Tournament, error) {
	query := `
		SELECT
		id,
		url,
		name,
		current_round,
		total_rounds,
		last_checked_at,
		created_at,
		updated_at
		FROM tournaments
		WHERE current_round != total_rounds
	`

	var tournaments []Tournament
	rows, err := r.db.QueryContext(ctx, query)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var tournament Tournament
		rows.Scan(
			&tournament.ID,
			&tournament.URL,
			&tournament.Name,
			&tournament.CurrentRound,
			&tournament.TotalRounds,
			&tournament.LastCheckedAt,
			&tournament.CreatedAt,
			&tournament.UpdatedAt,
		)

		if rows.Err() != nil {
			return nil, rows.Err()
		}

		tournaments = append(tournaments, tournament)
	}

	rows.Close()

	return &tournaments, nil
}

func (r *repository) Update(ctx context.Context, id string, tournament *Tournament) error {
	query := `
		UPDATE tournaments
		SET url = $1,
		name = $2,
		current_round = $3,
		total_rounds = $4,
		last_checked_at = $5,
		created_at = $6,
		updated_at = $7
		WHERE id = $8;
	`
	
	rows, err := r.db.ExecContext(
		ctx,
		query,
		&tournament.URL,
		&tournament.Name,
		&tournament.CurrentRound,
		&tournament.TotalRounds,
		&tournament.LastCheckedAt,
		&tournament.CreatedAt,
		&tournament.UpdatedAt,
		id,
	)

	aff, _ := rows.RowsAffected()
	log.Printf("Rows: %d\n", aff)

	return err
}
