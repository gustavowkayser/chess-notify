package middleware

import (
	"log"
	"net/http"
)

func LogMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			log.Printf("%s %s", r.Method, r.URL.Path)

			next.ServeHTTP(w, r)
		})
	}
}