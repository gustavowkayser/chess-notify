package subscription

import (
	"chess-notify/internal/middleware"
	"chess-notify/internal/utils"
	"net/http"

	"github.com/go-chi/chi"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{
		service: service,
	}
}

func (h *Handler) CreateSubscription(w http.ResponseWriter, r *http.Request) {
	var req CreateSubscriptionRequest

	wr := utils.NewWriteReader[CreateSubscriptionRequest, CreateSubscriptionResponse](r, w)
	req = *wr.DecodeRequest(req)

	device := middleware.DeviceFromContext(r.Context())

	subscription, err := h.service.Subscribe(r.Context(), CreateSubscriptionInput{
		DeviceID:      device.ID,
		TournamentURL: req.TournamentURL,
	})

	if err != nil {
		wr.WriteError(
			http.StatusBadRequest,
			"Error trying to subscribe to tournament",
			err.Error(),
		)
		return
	}

	response, err := wr.EncodeResponse(CreateSubscriptionResponse{
		SubscriptionID: subscription.ID,
	})

	if err != nil {
		wr.WriteError(
			http.StatusBadRequest,
			"Error trying to subscribe to tournament",
			err.Error(),
		)
		return
	}

	wr.WriteResponse(
		http.StatusOK,
		"Subscribed to the tournament successfuly",
		response,
	)
}

func (h *Handler) RemoveSubscription(w http.ResponseWriter, r *http.Request) {
	wr := utils.NewWriteReader[RemoveSubscriptionRequest, RemoveSubscriptionResponse](r, w)
	id := chi.URLParam(r, "id")

	device := middleware.DeviceFromContext(r.Context())

	err := h.service.Unsubscribe(r.Context(), RemoveSubscriptionInput{
		DeviceID:       device.ID,
		SubscriptionID: id,
	})

	if err != nil {
		wr.WriteError(
			http.StatusBadRequest,
			"Could not unsubscribe from tournament",
			err.Error(),
		)
		return
	}
}
