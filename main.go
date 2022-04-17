package main

import (
	"flag"
	"fmt"

	"github.com/shadowhijackers/share-gang-locations/app"
)

func main() {
	var port int
	flag.IntVar(&port, "port", 8080, "Specify  the port to listen to.")
	flag.Parse()
	addr := fmt.Sprintf(":%d", port)

	a := app.App{}
	a.Initializer()
	err := a.Router.Run(addr)
	app.HandleError(err)
}
