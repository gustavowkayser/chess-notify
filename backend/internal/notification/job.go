package notification

import (
	"context"
	"log"
)

type Job struct {
	service        *Service
	notificationCh chan *Notification
}

func NewJob(service *Service, notificationCh chan *Notification) *Job {
	return &Job{
		service:        service,
		notificationCh: notificationCh,
	}
}

func (j *Job) Init() {
	for job := range j.notificationCh {
		err := j.service.SendNotification(
			context.Background(), 
			job.TournamentID,
		)

		if err != nil {
			log.Printf("Error occured when pushing notification: %s\n", err.Error())
		}
	}
}
