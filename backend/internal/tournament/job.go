package tournament

import (
	"chess-notify/internal/notification"
	"context"

	"github.com/robfig/cron/v3"
)

type Job struct {
	service *Service
	notificationCh chan *notification.Notification
}

func NewJob(service *Service, notificationCh chan *notification.Notification) *Job {
	return &Job{ service: service, notificationCh: notificationCh, }
}

func (j *Job) InitRefresh() {
	c := cron.New()
	c.AddFunc("@every 1m", j.Refresh)

	c.Start()
}

func (j *Job) Refresh() {
	// Runs every minute
	ctx := context.Background()
	j.service.Refresh(ctx, j.notificationCh)
}