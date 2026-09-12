package tournament

import (
	"context"

	"github.com/robfig/cron/v3"
)

type Job struct {
	service *Service
}

func NewJob(service *Service) *Job {
	return &Job{ service: service }
}

func (j *Job) InitRefresh() {
	c := cron.New()
	c.AddFunc("@every 1m", j.Refresh)

	c.Start()
}

func (j *Job) Refresh() {
	// Runs every minute
	ctx := context.Background()
	j.service.Refresh(ctx)
}