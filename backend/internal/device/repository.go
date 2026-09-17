package device

import (
	"context"
	"database/sql"
	"errors"
)

type Repository interface {
	Create(ctx context.Context, device *Device) error
	FindByID(ctx context.Context, id string) (*Device, error)
	FindByCredentialsHash(ctx context.Context, hash string) (*Device, error)
	Update(ctx context.Context, id string, device *Device) error
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
			credentials_hash,
			push_token,
			platform,
			app_version,
			active
		) VALUES ($1, $2, $3, $4, $5, $6);
	`

	_, err := r.db.ExecContext(
		ctx, 
		query, 
		device.ID,
		device.CredentialHash, 
		device.PushToken, 
		device.Platform, 
		device.AppVersion,
		device.Active,
	)

	return err
}

func (r *repository) FindByID(ctx context.Context, id string) (*Device, error) {
	query := `
		SELECT
		id,
		credentials_hash,
		push_token,
		app_version,
		platform,
		active
		FROM devices WHERE id = $1;
	`

	var device Device
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&device.ID,
		&device.CredentialHash,
		&device.PushToken,
		&device.AppVersion,
		&device.Platform,
		&device.Active,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	if err != nil {
		return nil, err
	}

	return &device, nil
}

func (r *repository) FindByCredentialsHash(ctx context.Context, hash string) (*Device, error) {
	query := `
		SELECT 
		id, 
		push_token, 
		platform, 
		credentials_hash, 
		app_version, 
		active 
		FROM devices 
		WHERE credentials_hash = $1;
	`

	var device Device
	err := r.db.QueryRowContext(
		ctx, 
		query, 
		hash,
	).Scan(
		&device.ID,
		&device.PushToken,
		&device.Platform,
		&device.CredentialHash,
		&device.AppVersion,
		&device.Active,
	)

	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	
	if err != nil {
		return nil, err
	}

	return &device, nil
}

func (r *repository) Update(ctx context.Context, id string, device *Device) error {
	query := `
		UPDATE devices SET
		push_token = $1,
		active = $2
		WHERE id = $3
	`

	_, err := r.db.ExecContext(ctx, query, device.PushToken, device.Active, id)

	return err
}