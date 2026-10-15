package notification

import (
	"context"
	"database/sql"
)

type Repository interface {
	GetSubscriptionsWithDevice(ctx context.Context, tournamentId string) (*[]SubscriptionDeviceView, error)
	CreateNotification(ctx context.Context, notification Notification) error
	ListNotifications(ctx context.Context, deviceId string) (*[]Notification, error)
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

func (r *repository) CreateNotification(ctx context.Context, notification Notification) error {
	query := `
		INSERT INTO notifications (tournament_id, device_push_token, title, message, data)
		VALUES ($1, $2, $3, $4, $5)
	`

	_, err := r.db.ExecContext(
		ctx,
		query,
		notification.TournamentID,
		notification.DevicePushToken,
		notification.Title,
		notification.Message,
		notification.Data,
	)
	return err
}

func (r *repository) ListNotifications(ctx context.Context, deviceId string) (*[]Notification, error) {
	query := `
		SELECT
			tournament_id,
			device_push_token,
			title,
			message,
			data
		FROM notifications
		WHERE device_push_token = $1
	`

	var notifications []Notification
	rows, err := r.db.QueryContext(ctx, query, deviceId)
	if err != nil {
		return nil, err
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	for rows.Next() {
		var notification Notification
		rows.Scan(
			&notification.TournamentID,
			&notification.DevicePushToken,
			&notification.Title,
			&notification.Message,
			&notification.Data,
		)
		notifications = append(notifications, notification)
	}

	rows.Close()

	return &notifications, nil
}
