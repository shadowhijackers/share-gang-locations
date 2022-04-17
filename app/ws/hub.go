package ws

import (
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

type message struct {
	gangId string
	data   userLocation
}

type hub struct {
	gangs     map[string]map[*connection]bool
	add       chan gang
	remove    chan gang
	broadcast chan message
}

func (h *hub) AddGang(g gang) {
	if h.gangs[g.gangId] == nil {
		h.gangs[g.gangId] = make(map[*connection]bool)
	}
	h.gangs[g.gangId][g.conn] = true
}

func (h *hub) RemoveGang(g gang) {
	connections := h.gangs[g.gangId]
	if connections != nil {
		if _, ok := connections[g.conn]; ok {
			delete(connections, g.conn)
			close(g.conn.send)
			if len(connections) == 0 {
				delete(h.gangs, g.gangId)
			}
		}
	}
}

func (h *hub) BroadCastLocations(m message) {
	connections := h.gangs[m.gangId]
	if connections != nil {
		gl := models.GetGangLocations(m.gangId)
		for c := range connections {
			select {
			case c.send <- gl:
			default:
				g := gang{c, m.gangId}
				h.RemoveGang(g)
			}
		}
	}
}

func New() *hub {
	return &hub{
		gangs:     make(map[string]map[*connection]bool),
		add:       make(chan gang),
		remove:    make(chan gang),
		broadcast: make(chan message),
	}
}

var SocketHub = New()

func (h *hub) Listener() {
	for {
		select {
		case g := <-h.add:
			h.AddGang(g)

		case g := <-h.remove:
			h.RemoveGang(g)

		case m := <-h.broadcast:
			h.BroadCastLocations(m)
		}
	}
}
