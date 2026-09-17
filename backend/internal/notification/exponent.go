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
	pushToken string,
	title string,
	body string,
	data map[string]string,
) error {
	tkn := exponent.MustParseToken(pushToken)
	res, err := e.client.PublishSingle(ctx, &exponent.Message{
		To:       []*exponent.Token{tkn},
		Title:    title,
		Body:     body,
		Data:     data,
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
