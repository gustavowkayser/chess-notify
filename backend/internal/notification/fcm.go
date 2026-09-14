package notification

import (
	"context"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/messaging"
	"google.golang.org/api/option"
)

type FCM struct {
	client *messaging.Client
}

func NewFCM(ctx context.Context, credentialsPath string) (Provider, error) {
	opt := option.WithAuthCredentialsFile(
		option.ServiceAccount, 
		"./.secrets/firebase-service-account.json",
	)
	app, err := firebase.NewApp(ctx, nil, opt)

	if err != nil {
		return nil, err
	}

	client, err := app.Messaging(ctx)

	if err != nil {
		return nil, err
	}

	return &FCM{
		client: client,
	}, nil
}

func (f *FCM) Send(
	ctx context.Context,
	token string,
	title string,
	body string,
	data map[string]string,
) error {
	message := &messaging.Message{
		Token: token,
		Notification: &messaging.Notification{
			Title: title,
			Body: body,
		},
	}

	_, err := f.client.Send(ctx, message)

	return err
}