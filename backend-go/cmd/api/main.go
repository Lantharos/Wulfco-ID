package main

import (
	"backend-go/api"
	"backend-go/api/util/firebase"
	"github.com/dotenv-org/godotenvvault"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"log"
	"net/http"
)

func main() {
	err1 := godotenvvault.Load()
	if err1 != nil {
		log.Fatal("Error loading .env file")
	}

	firebase.Initialise()

	r := chi.NewRouter()

	r.Use(middleware.Recoverer)
	r.Use(middleware.Logger)
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.AllowContentType("application/json"))

	r.Route("/", func(r chi.Router) {
		api.HandleRoutes(r)
	})

	err2 := http.ListenAndServe(":3000", r)
	if err2 != nil {
		return
	}
}
