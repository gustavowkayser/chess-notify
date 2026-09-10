package auth

import "github.com/gin-gonic/gin"

func ApplyRoutes(router *gin.RouterGroup, handler *Handler) {
	auth := router.Group("auth")

	auth.POST("/create-token", handler.CreateToken)
}
