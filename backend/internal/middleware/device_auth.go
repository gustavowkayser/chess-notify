package middleware

import (
	"chess-notify/internal/device"
	"context"
	"net/http"
)

func DeviceFromContext(ctx context.Context) *device.Device {
	device, ok := ctx.Value("device").(*device.Device)

	if !ok {
		return nil
	}

	return device
}

func DeviceAuth(authService *device.Service) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			token := r.Header.Get("Authorization")

			if token == "" {
				http.Error(
					w,
					"Missing authorization",
					http.StatusUnauthorized,
				)
				return
			}

			device, err := authService.Authenticate(r.Context(), token)
			if err != nil {
				http.Error(
					w,
					"Unauthorized",
					http.StatusUnauthorized,
				)
			}

			ctx := context.WithValue(
				r.Context(),
				"device",
				device,
			)

			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}