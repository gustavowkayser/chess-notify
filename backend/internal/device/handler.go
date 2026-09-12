package device

import (
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

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterDeviceRequest

	wr := utils.NewWriteReader[RegisterDeviceRequest, RegisterDeviceResponse](r, w)
	req = *wr.DecodeRequest(req)

	device, err := h.service.RegisterDevice(r.Context(), req)

	if err != nil {
		wr.WriteError(
			http.StatusBadRequest,
			"Error trying to register device",
			err.Error(),
		)
		return
	}
	
	response, err := wr.EncodeResponse(RegisterDeviceResponse{
		DeviceID: device.ID,
		DeviceToken: device.PushToken,
	})

	if err != nil {
		wr.WriteError(
			http.StatusBadRequest,
			"Error trying to register device",
			err.Error(),
		)
		return
	}

	wr.WriteResponse(
		http.StatusOK, 
		"Device registered successfuly",
		response,
	)
}