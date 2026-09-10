package auth

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) Handler {
	return Handler{
		service: service,
	}
}

func (h *Handler) CreateToken(c *gin.Context) {
	token := h.service.CreateToken()
	
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"message": "Token created successfully",
		"data": gin.H{
			"token": token,
		},
	})
}
