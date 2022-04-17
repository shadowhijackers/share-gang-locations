package app

import (
	"github.com/gin-gonic/gin"
	"github.com/shadowhijackers/share-gang-locations/app/ws"
)

type App struct {
	Router *gin.Engine
}

func (a *App) Initializer() {
	go ws.SocketHub.Listener()
	a.Router = gin.New()
	a.setupRouters()
}

func (a *App) setupRouters() {
	a.Router.Delims("<?go", "?>")
	a.Router.Static("/assets", "./public/assets")
	a.Router.LoadHTMLGlob("public/views/*.html")

	a.Router.GET("/", indexHandler)
	a.Router.GET("/gangs/:gangId/locations", gangLocationsHandler)
	a.Router.GET("/ws/gangs/:gangId/locations", ws.ServeWS)
}
