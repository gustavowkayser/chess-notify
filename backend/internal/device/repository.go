package device

import (
	"context"
	"database/sql"
)

type Repository interface {
	Create(ctx context.Context, device *Device) error
	FindByID(ctx context.Context, id string) (*Device, error)
	FindByCredentialsHash(ctx context.Context, hash string) (*Device, error)
}

type repository struct {
	db *sql.DB
}

func NewRepository(db *sql.DB) Repository {
	return &repository{db: db}
}

func (r *repository) Create(ctx context.Context, device *Device) error {
	query := `
		INSERT INTO devices (
			id,
			credential_hash,
			push_token,
			platform,
			app_version,
		) VALUES ($1, $2, $3, $4, $5)
	`

	_, err := r.db.ExecContext(
		ctx, 
		query, 
		device.ID,
		device.CredentialHash, 
		device.PushToken, 
		device.Platform, 
		device.AppVersion,
	)

	return err
}

func (r *repository) FindByID(ctx context.Context, id string) (*Device, error) {
	query := `
		SELECT * FROM devices WHERE id = $1
	`

	var device Device
	err := r.db.QueryRowContext(ctx, query, id).Scan(&device)

	if err != nil {
		return nil, err
	}

	return &device, nil
}

func (r *repository) FindByCredentialsHash(ctx context.Context, hash string) (*Device, error) {
	query := `
		SELECT * FROM devices WHERE credentials_hash = $1
	`

	var device Device
	err := r.db.QueryRowContext(ctx, query, hash).Scan(&device)

	if err != nil {
		return nil, err
	}

	return &device, nil
}