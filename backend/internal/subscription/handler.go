package subscription

import (
	"chess-notify/internal/middleware"
	"chess-notify/internal/utils"
	"net/http"
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

	subscription, err := h.service.CreateSubscription(r.Context(), CreateSubscriptionInput{
		DeviceID: device.ID,
		TournamentID: req.TournamentId,
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
		SubscriptionId: subscription.ID,
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