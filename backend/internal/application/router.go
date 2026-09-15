package application

import (
	"net/http"

	"github.com/go-chi/chi"
)

func (app *App) routes() http.Handler {
	router := chi.NewRouter()

	router.Use(app.LogMiddleware)
	
	router.Get("/v1/health", HealthHandler)
	router.Put("/v1/devices", app.DeviceHandler.Upsert)
	
	router.Group(func(r chi.Router) {
		r.Use(app.AuthMiddleware)

		r.Post("/v1/subscriptions", app.SubscriptionHandler.CreateSubscription)
		r.Delete("/v1/subscriptions/{id}", app.SubscriptionHandler.RemoveSubscription)
		r.Get("/v1/subscriptions", app.SubscriptionHandler.ListSubscriptions)
	})

	return router
}