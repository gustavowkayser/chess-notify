package application

import (
	"chess-notify/internal/chess"
	"chess-notify/internal/database"
	"chess-notify/internal/device"
	"chess-notify/internal/middleware"
	"chess-notify/internal/subscription"
	"chess-notify/internal/tournament"
	"context"
	"database/sql"
	"log"
	"net/http"
)

type App struct {
	Config Config
	DB     *sql.DB

	DeviceHandler       *device.Handler
	SubscriptionHandler *subscription.Handler
	// TournamentHandler *tournament.Handler
	AuthMiddleware func(http.Handler) http.Handler
	LogMiddleware  func(http.Handler) http.Handler
}

func New() (*App, error) {
	config := LoadConfig()

	log.Println(config.DatabaseURL)

	db, err := database.NewPostgres(config.DatabaseURL)
	if err != nil {
		return nil, err
	}

	err = database.Migrate(db, context.Background())
	if err != nil {
		return nil, err
	}

	chessProvider := chess.NewProvider()

	deviceRepository := device.NewRepository(db)
	deviceService := device.NewService(deviceRepository)
	deviceHandler := device.NewHandler(deviceService)

	tournamentRepository := tournament.NewRepository(db)

	subscriptionRepository := subscription.NewRepository(db)
	subscriptionService := subscription.NewService(subscriptionRepository, tournamentRepository, chessProvider)
	subscriptionHandler := subscription.NewHandler(subscriptionService)

	authMiddleware := middleware.DeviceAuth(deviceService)
	logMiddleware := middleware.LogMiddleware()

	// tournamentService := tournament.NewService(tournamentRepository)
	// tournamentHandler := tournament.NewHandler(tournamentService)

	return &App{
		Config:              config,
		DB:                  db,
		DeviceHandler:       deviceHandler,
		SubscriptionHandler: subscriptionHandler,
		AuthMiddleware:      authMiddleware,
		LogMiddleware:       logMiddleware,
		// TournamentHandler: tournamentHandler,
	}, nil
}

func (app *App) Run() error {
	handler := app.routes()

	log.Printf("Running server on port: %s\n", app.Config.Port)
	return http.ListenAndServe(":"+app.Config.Port, handler)
}
