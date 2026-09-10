package subscription

import (
	"github.com/gin-gonic/gin"
)

func ApplyRoutes(router *gin.RouterGroup, handler *Handler) {
	router.POST("/subscribe", handler.Subscribe)
}
