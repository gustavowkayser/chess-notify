package database

import (
	"database/sql"
	_ "github.com/lib/pq"
)

func NewPostgres(url string) (*sql.DB, error) {
	db, err := sql.Open("postgres", url)

	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}