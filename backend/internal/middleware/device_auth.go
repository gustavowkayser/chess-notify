package middleware

import (
	"chess-notify/internal/device"
	"chess-notify/internal/utils"
	"context"
	"net/http"
	"strings"
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

			wr := utils.NewWriteReader[any, any](r, w)
			token := strings.TrimPrefix(r.Header.Get("Authorization"), "Bearer ")
			
			if token == "" {
				wr.WriteError(
					http.StatusUnauthorized,
					"Unauthorized",
					"Invalid token",
				)
				return
			}

			device, err := authService.Authenticate(r.Context(), token)
			if err != nil {
				wr.WriteError(
					http.StatusUnauthorized,
					"Unauthorized",
					"Invalid token",
				)
				return
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