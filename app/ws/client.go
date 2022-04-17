package ws

import (
	"fmt"
	"log"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 100) / 10
	maxMessageSize = 512
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func ServeWS(c *gin.Context) {
	fmt.Println(c.GetHeader("token"))
	gangId := c.Param("gangId")

	// connect to web socket
	wsconn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Printf("error: %v", err)
	}

	conn := &connection{ws: wsconn, send: make(chan map[string]models.Latlng)}
	g := &gang{conn: conn, gangId: gangId}

	// adding new connection or new member
	SocketHub.add <- *g

	// waiting for location from browser client or gang member
	go g.reciveLocations()

	// sending location to browser client or gang member
	go g.transmitLocations()
}
