package database

import (
	"time"

	"gorm.io/gorm"
)

type Tournament struct {
	gorm.Model
	ID string
	URL string
	Name string
	CurrentRound int
	TotalRounds int
	Active bool
	UpdatedAt time.Time
}

type Subscription struct {
	gorm.Model
	ID string
	UserID string
	TournamentID string
	Active bool
	CreatedAt time.Time
}

type Event struct {
	gorm.Model
	ID string
	Type string
	TournamentID string
	CreatedAt time.Time
}

func Migrate(db *gorm.DB) {
	db.AutoMigrate(
		&Tournament{},
		&Subscription{},
		&Event{},
	)
}
