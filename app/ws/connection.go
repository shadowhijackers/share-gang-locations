package ws

import (
	"github.com/gorilla/websocket"
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

type userLocation struct {
	Latlng models.Latlng `json: "latlng"`
	UserId string        `json: "userId"`
}

type connection struct {
	ws     *websocket.Conn
	userId string
	send   chan map[string]models.Latlng
}

func (conn *connection) write(msgType int, locations []byte) error {
	return conn.ws.WriteMessage(msgType, locations)
}

func (conn *connection) writeJSON(locations map[string]models.Latlng) error {
	return conn.ws.WriteJSON(locations)
}

func (conn *connection) readJSON() (userLocation, error) {
	loc := userLocation{}
	err := conn.ws.ReadJSON(&loc)
	return loc, err
}
