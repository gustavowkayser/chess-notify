package subscription

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

type subscribeRequest struct {
	TournamentUrl string `json:"tournament_url" binding:"required"`
}

func NewHandler(service *Service) Handler {
	return Handler{
		service: service,
	}
}

func (h *Handler) HandleAuthentication(c *gin.Context) *string {
	userToken, found := strings.CutPrefix(c.GetHeader("Authorization"), "Bearer ")

	if !found {
		c.JSON(http.StatusUnauthorized, gin.H{
			"success": false,
			"message": "Invalid authentication",
		})
		return nil
	}

	return &userToken
}

func (h *Handler) Subscribe(c *gin.Context) {
	var r subscribeRequest

	if err := c.BindJSON(&r); err != nil {
		c.JSON(http.StatusUnprocessableEntity, gin.H{
			"success": false,
			"message": "Invalid body",
			"error": err.Error(),
		})
		return
	}

	userToken := h.HandleAuthentication(c)
	if userToken == nil { return }

	id, err := h.service.Subscribe(r.TournamentUrl, *userToken)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"success": false,
			"message": "Could not subscribe to tournament",
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Subscribed successfuly to tournament",
		"data": gin.H{
			"tournament_id": id,
		},
	})
}

func (h *Handler) Unsubscribe(c *gin.Context) {
	userToken := h.HandleAuthentication(c)
	if userToken == nil { return }

	err := h.service.Unsubscribe(tournamentId)
}
