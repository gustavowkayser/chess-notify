package application

import (
	"net/http"

	"github.com/go-chi/chi"
)

func (app *App) routes() http.Handler {
	router := chi.NewRouter()

	router.Use(app.LogMiddleware)
	
	router.Get("/v1/health", HealthHandler)
	router.Post("/v1/devices", app.DeviceHandler.Register)

	router.Group(func(r chi.Router) {
		r.Use(app.AuthMiddleware)

		r.Post("/v1/subscriptions", app.SubscriptionHandler.CreateSubscription)
		r.Delete("/v1/subscriptions/{id}", app.SubscriptionHandler.RemoveSubscription)
	})

	return router
}