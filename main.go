package main

import (
	"flag"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/shadowhijackers/share-gang-locations/app"
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

func init() {
	go models.RestoreDBFromBackUped()
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	var port int
	flag.IntVar(&port, "port", 8080, "Specify  the port to listen to.")
	flag.Parse()
	// addr := fmt.Sprintf(":%d", ":" + os.Getenv("PORT"))
	a := app.App{}
	a.Initializer()
	// for dev test
	err := a.Router.RunTLS(":"+os.Getenv("PORT"), "server.crt", "server.key")
	// err := a.Router.Run(":" + os.Getenv("PORT"))
	app.HandleError(err)
}
