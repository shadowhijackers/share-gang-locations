package main

import (
	"flag"
	"log"
	"os"

	"github.com/joho/godotenv"
	"github.com/shadowhijackers/share-gang-locations/app"
	"github.com/shadowhijackers/share-gang-locations/app/models"
	"github.com/shadowhijackers/share-gang-locations/app/schedulers"
)

func init() {
	models.RestoreDBFromBackUped()
	schedulers.StartDataCleaner()

	err := godotenv.Load(".env")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}

func main() {

	var env string
	flag.StringVar(&env, "env", "prod", "specify the environment")
	flag.Parse()

	a := app.App{}
	a.Initializer()

	var err error
	if env == "dev" {
		// for dev test
		err = a.Router.RunTLS(":"+os.Getenv("PORT"), os.Getenv("CERT"), os.Getenv("KEY"))
	} else {
		err = a.Router.Run(":" + os.Getenv("PORT"))
	}
	app.HandleError(err)
}
