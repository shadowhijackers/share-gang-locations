package ws

import (
	"log"
	"time"

	"github.com/gorilla/websocket"
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

type gang struct {
	conn   *connection
	gangId string
}

func (g *gang) reciveLocations() {
	defer func() {
		SocketHub.remove <- *g
		g.conn.ws.Close()
	}()

	g.conn.ws.SetReadLimit(maxMessageSize)
	g.conn.ws.SetReadDeadline(time.Now().Add(pongWait))
	g.conn.ws.SetPongHandler(func(string) error { g.conn.ws.SetReadDeadline(time.Now().Add(pongWait)); return nil })

	for {
		msg, err := g.conn.readJSON()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				log.Printf("error: %v", err)
			}
			break
		}
		models.AddOrUpdateUserLocation(g.gangId, msg.UserId, msg.Latlng)
		if g.conn.userId == "" {
			g.conn.userId = msg.UserId
		}
		m := &message{data: msg, gangId: g.gangId}
		SocketHub.broadcast <- *m
	}
}

func (g *gang) transmitLocations() {
	defer func() {
		SocketHub.remove <- *g
		g.conn.ws.Close()
	}()

	t := time.NewTicker(pingPeriod)
	for {
		select {
		case msg, ok := <-g.conn.send:
			if !ok {
				g.conn.write(websocket.CloseMessage, []byte{})
				return
			}
			if err := g.conn.writeJSON(msg); err != nil {
				return
			}
		case <-t.C:
			if err := g.conn.write(websocket.PingMessage, []byte{}); err != nil {
				return
			}
		}
	}
}
