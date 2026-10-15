package notification

import (
	"context"
	"log"

	"github.com/9ssi7/exponent"
)

type Exponent struct {
	client *exponent.Client
}

func NewExponent() Provider {
	c := exponent.NewClient()

	return &Exponent{
		client: c,
	}
}

func (e *Exponent) Send(
	ctx context.Context,
	notification Notification,
) error {
	tkn := exponent.MustParseToken(notification.DevicePushToken)
	res, err := e.client.PublishSingle(ctx, &exponent.Message{
		To:       []*exponent.Token{tkn},
		Title:    notification.Title,
		Body:     notification.Message,
		Data:     notification.Data,
		Sound:    "default",
		Priority: exponent.HighPriority,
	})

	if err != nil {
		return err
	}

	for _, receipt := range res {
		if receipt.IsOk() {
			log.Println("Notification sent successfully")
		} else {
			log.Println("Notification failed")
		}
	}

	return nil
}
