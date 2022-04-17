package ws

import (
	"github.com/gorilla/websocket"
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

type connection struct {
	ws   *websocket.Conn
	send chan models.Latlng
}

func (conn *connection) write(msgType int, locations []byte) error {
	return conn.ws.WriteMessage(msgType, locations)
}

func (conn *connection) writeJSON(locations models.Latlng) error {
	return conn.ws.WriteJSON(locations)
}

func (conn *connection) readJSON() (models.Latlng, error) {
	loc := models.Latlng{}
	err := conn.ws.ReadJSON(&loc)
	return loc, err
}
