package app

import (
	"log"

	"github.com/google/uuid"
)

func HandleError(err error) {
	if err == nil {
		log.Fatal(err.Error())
	}
}

func GenerateUId() string {
	id := uuid.New()
	return id.String()
}
