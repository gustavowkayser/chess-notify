package application

import (
	"chess-notify/internal/database"
	"chess-notify/internal/device"
	"chess-notify/internal/middleware"
	"chess-notify/internal/notification"
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
	AuthMiddleware  func(http.Handler) http.Handler
	LogMiddleware   func(http.Handler) http.Handler
	TournamentJob   *tournament.Job
	NotificationJob *notification.Job
}

func New() (*App, error) {
	config := LoadConfig()

	db, err := database.NewPostgres(config.DatabaseURL)
	if err != nil {
		return nil, err
	}

	err = database.Migrate(db, context.Background())
	if err != nil {
		return nil, err
	}

	argon2config := device.ArgonConfig {
		Salt: []byte(config.Secret),
		TimeCost: 2,
		MemoryCost: 64 * 1024,
		Threads: 4,
		KeyLength: 32,
	}

	chessProvider := tournament.NewProvider()
	notificationProvider := notification.NewExponent()

	notificationRepository := notification.NewRepository(db)
	notificationService := notification.NewService(notificationRepository, notificationProvider)

	deviceRepository := device.NewRepository(db)
	deviceService := device.NewService(deviceRepository, argon2config)
	deviceHandler := device.NewHandler(deviceService)

	tournamentRepository := tournament.NewRepository(db)

	subscriptionRepository := subscription.NewRepository(db)
	subscriptionService := subscription.NewService(subscriptionRepository, tournamentRepository, chessProvider)
	subscriptionHandler := subscription.NewHandler(subscriptionService)

	authMiddleware := middleware.DeviceAuth(deviceService)
	logMiddleware := middleware.LogMiddleware()

	notificationCh := make(chan *notification.Notification)

	tournamentService := tournament.NewService(chessProvider, tournamentRepository)
	tournamentJob := tournament.NewJob(tournamentService, notificationCh)
	notificationJob := notification.NewJob(notificationService, notificationCh)
	// tournamentHandler := tournament.NewHandler(tournamentService)

	return &App{
		Config:              config,
		DB:                  db,
		DeviceHandler:       deviceHandler,
		SubscriptionHandler: subscriptionHandler,
		AuthMiddleware:      authMiddleware,
		LogMiddleware:       logMiddleware,
		TournamentJob:       tournamentJob,
		NotificationJob:     notificationJob,
		// TournamentHandler: tournamentHandler,
	}, nil
}

func (app *App) Run() error {
	handler := app.routes()

	app.TournamentJob.InitRefresh()
	go app.NotificationJob.Init()

	log.Printf("Running server on port: %s\n", app.Config.Port)
	return http.ListenAndServe(":"+app.Config.Port, handler)
}
