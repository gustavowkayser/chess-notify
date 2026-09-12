package utils

import (
	"encoding/json"
	"net/http"
)

type WriteReader[T any, U any] struct {
	request *http.Request
	writer http.ResponseWriter
}

func NewWriteReader[T any, U any](req *http.Request, writer http.ResponseWriter) WriteReader[T, U] {
	return WriteReader[T, U]{
		request: req,
		writer: writer,
	}
}

func (wr *WriteReader[T, U]) DecodeRequest(st T) *T {
	err := json.NewDecoder(wr.request.Body).Decode(&st)
	if err != nil {
		http.Error(
			wr.writer,
			"Invalid request body",
			http.StatusBadRequest,
		)
		return nil
	}

	return &st
}

func (wr *WriteReader[T, U]) EncodeResponse(data U) (map[string]any, error) {
	value, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	var out map[string]any
	if err := json.Unmarshal(value, &out); err != nil {
		return nil, err
	}

	return out, nil
}

func (wr *WriteReader[T, U]) WriteError(status int, message string, details string) {
	wr.writer.Header().Set(
		"Content-Type", "application/json",
	)

	wr.writer.WriteHeader(status)

	json.NewEncoder(wr.writer).Encode(
		map[string]any{
			"success": false,
			"message": message,
			"error": details,
		},
	)
}

func (wr *WriteReader[T, U]) WriteResponse(status int, message string, data any) {
	wr.writer.Header().Set(
		"Content-Type", "application/json",
	)

	wr.writer.WriteHeader(status)

	json.NewEncoder(wr.writer).Encode(
		map[string]any{
			"success": true,
			"message": message,
			"data": data,
		},
	)
}