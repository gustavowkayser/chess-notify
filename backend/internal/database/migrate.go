package database

import (
	"context"
	"database/sql"
	"log"
	"os"
)

func Migrate(db *sql.DB, ctx context.Context) error {
	log.Println("Running migrations...")
	
	path := "./internal/database/migrations/"
	migrations, err := os.ReadDir(path)

	if err != nil {
		return err
	}

	for _, file := range migrations {
		content, err := os.ReadFile(path + file.Name())

		if err != nil {
			return err
		}

		_, err = db.ExecContext(ctx, string(content))

		if err != nil {
			return err
		}
	}

	log.Println("Migrations finished")
	return nil
}