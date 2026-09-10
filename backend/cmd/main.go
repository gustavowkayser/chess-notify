package main

import (
	"chess-notify/internal/auth"
	"chess-notify/internal/chessresults"
	"chess-notify/internal/database"
	"chess-notify/internal/subscription"
	"chess-notify/internal/tournament"
	"context"
	"log"
	"os"
)

func main() {
	
	context := context.Background()
	db, err := database.NewSqliteDatabase(context, "app.db")
	if err != nil {
		log.Fatalf("Error trying to connect to database: %s", err.Error())
		os.Exit(1)
	}

	database.Migrate(db)

	repository := database.NewRepository(db, context)

	chessResultsProvider := chessresults.NewChessResultsProvider()

	subscriptionService := subscription.NewService(&chessResultsProvider, &repository)
	subscriptionHandler := subscription.NewHandler(&subscriptionService)

	authService := auth.NewService()
	authHandler := auth.NewHandler(&authService)

	notificationsChannel := make(chan *database.Tournament)
	refreshHandler := tournament.NewJob(&chessResultsProvider, &repository, &notificationsChannel)

	config := appConfig{
		Addr: ":8080",
	}
	
	app := NewServer(config)
	app.RegisterJob(
		"@every 1m",
		refreshHandler.RefreshHandler,
	)
	app.RegisterRoutes(
		authHandler,
		subscriptionHandler,
	)
	app.Run()
}
