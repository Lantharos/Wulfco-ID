package api

import (
	"backend-go/api/modules"
	"encoding/json"
	"github.com/go-chi/chi/v5"
	"net/http"
)

func interfaceToJson(response interface{}) (string, error) {
	var encodedResponse, err = json.Marshal(response)
	if err != nil {
		return "", err
	}

	return string(encodedResponse), nil
}

func callModule(response interface{}, w http.ResponseWriter) {
	encodedResponse, err1 := interfaceToJson(response)
	if err1 != nil {
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_, err2 := w.Write([]byte(encodedResponse))
	if err2 != nil {
		_, err := w.Write([]byte(`{"status": "error", "message": "Failed to write response", "code": "500"}`))
		if err != nil {
			return
		}
	}
}

func HandleRoutes(r chi.Router) {
	r.Post("/login", func(w http.ResponseWriter, r *http.Request) { callModule(modules.Login(r), w) })
}
