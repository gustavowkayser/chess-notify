package tournament

import "time"

type Tournament struct {
	ID string
	URL string
	Name string
	CurrentRound int 
	TotalRounds int
	LastCheckedAt time.Time
	CreatedAt time.Time
	UpdatedAt time.Time
}
