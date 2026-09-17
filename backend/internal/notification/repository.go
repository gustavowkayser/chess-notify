package notification

import (
	"context"
	"database/sql"
)

type Repository interface {
	GetSubscriptionsWithDevice(ctx context.Context, tournamentId string) (*[]SubscriptionDeviceView, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{
		db: db,
	}
}

func (r *repository) GetSubscriptionsWithDevice(ctx context.Context, tournamentId string) (*[]SubscriptionDeviceView, error) {
	query := `
		SELECT 
		subscriptions.id,
		subscriptions.tournament_id,
		devices.id,
		devices.push_token,
		tournaments.name,
		tournaments.current_round,
		tournaments.total_rounds
		FROM subscriptions 
		INNER JOIN devices ON subscriptions.device_id = devices.id
		INNER JOIN tournaments ON subscriptions.tournament_id = tournaments.id
		WHERE subscriptions.tournament_id = $1 AND devices.active = true;
	`

	var subs []SubscriptionDeviceView
	rows, err := r.db.QueryContext(ctx, query, tournamentId)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		var row SubscriptionDeviceView
		rows.Scan(
			&row.SubscriptionID,
			&row.TournamentID,
			&row.DeviceID,
			&row.DevicePushToken,
			&row.TournamentName,
			&row.TournamentRound,
			&row.TournamentTotal,
		)

		if rows.Err() != nil {
			continue
		}

		subs = append(subs, row)
	}

	rows.Close()

	return &subs, nil
}