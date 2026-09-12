package application

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port string
	DatabaseURL string
}

func LoadConfig() Config {
	err := godotenv.Load()
	if err != nil {
		return Config{}
	}
	
	return Config{
		Port: os.Getenv("PORT"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
	}
}