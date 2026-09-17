package database

import (
	"database/sql"
	_ "modernc.org/sqlite"
)

func NewSqlite(url string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", url)

	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return db, nil
}