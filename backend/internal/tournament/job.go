package tournament

import (
	"chess-notify/internal/chessresults"
	"chess-notify/internal/database"
	"log"
	"strconv"
)

type Job struct {
	provider      *chessresults.ChessResultsProvider
	repo          *database.Repository
	notifications *chan *database.Tournament
}

func NewJob(provider *chessresults.ChessResultsProvider, repo *database.Repository, notChannel *chan *database.Tournament) Job {
	return Job{
		provider:      provider,
		repo:          repo,
		notifications: notChannel,
	}
}

func (j *Job) RefreshHandler() {
	// This function will execute every 1 minute

	log.Println("Starting refresh...")

	tournaments, err := j.repo.GetActiveTournaments()

	log.Printf("Found %d tournaments", len(*tournaments))

	if err != nil {
		log.Printf("Error ocurred when refreshing: %s\n", err.Error())
		return
	}

	jobs := make(chan *database.Tournament)

	for i := 0; i < 10; i++ {
		go worker(jobs, *j.notifications, j.provider)
	}

	for _, tournament := range *tournaments {
		jobs <- &tournament
	}

	close(jobs)
}

func worker(jobs chan *database.Tournament, ch chan *database.Tournament, provider *chessresults.ChessResultsProvider) {
	for tournament := range jobs {
		updatedTournament, err := provider.GetTournament(tournament.URL)

		if err != nil {
			log.Printf("Error when fetching tournament %s: %s\n", tournament.URL, err.Error())
			continue
		}

		currentRound := tournament.CurrentRound
		updatedRound := updatedTournament.CurrentRound

		log.Printf("Current Round: %s", strconv.Itoa(currentRound))

		if currentRound == updatedRound {
			continue
		}
		
		log.Printf("New round pairing for %s", tournament.ID)
		ch <- updatedTournament
	}
}
