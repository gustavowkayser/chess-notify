package database

import (
	"context"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func NewSqliteDatabase(ctx context.Context, dsn string) (*gorm.DB, error) {
	conn, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	return conn, err
}
