package main

import (
	"chess-notify/internal/auth"
	"chess-notify/internal/subscription"

	"github.com/gin-gonic/gin"
	"github.com/robfig/cron/v3"
)

type application struct {
	router *gin.Engine
	config appConfig
	jobs []*cron.Cron
}

type appConfig struct {
	Addr string
}

func NewServer(config appConfig) application {
	return application{
		router: gin.Default(),
		config: config,
	}
}

func (app *application) Run() {
	for _, job := range app.jobs {
		job.Start()
	}
	app.router.Run(app.config.Addr)	
}

func (app *application) RegisterRoutes(
	authHandler auth.Handler,
	subscriptionHandler subscription.Handler,
) {
	v1 := app.router.Group("/api/v1")

	auth.ApplyRoutes(v1, &authHandler)
	subscription.ApplyRoutes(v1, &subscriptionHandler)
}

func (app *application) RegisterJob(
	spec string,
	handler func(),
) {
	c := cron.New()
	c.AddFunc(spec, handler)

	app.jobs = append(app.jobs, c)
}
