package main

import (
	"flag"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/shadowhijackers/share-gang-locations/app"
)

func init() {

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {
	var port int
	flag.IntVar(&port, "port", 8080, "Specify the port to listen to.")
	flag.Parse()
	// addr := fmt.Sprintf(":%d", ":" + os.Getenv("PORT"))
	a := app.App{}
	a.Initializer()
	err := a.Router.Run(":" + os.Getenv("PORT"))
	app.HandleError(err)
}
