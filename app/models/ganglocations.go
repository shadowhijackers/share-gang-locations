package models

type Latlng struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

/**
*  SAMPLE DATA
* ------------
*  {
*	   "gang_1":{
*		   "user_1": { lat: 12.0023, lng: 80.2323 }
*	   }
*  }
**/
var GANG_LOCATIONS_DB = make(map[string]map[string]Latlng)

func AddOrUpdateUserLocation(gangId string, userId string, latlng Latlng) {
	if GANG_LOCATIONS_DB[gangId] == nil {
		GANG_LOCATIONS_DB[gangId] = make(map[string]Latlng)
	}
	GANG_LOCATIONS_DB[gangId][userId] = latlng
}

func RemovedUserLocation(gangId string, userId string) {
	if GANG_LOCATIONS_DB[gangId] != nil {
		delete(GANG_LOCATIONS_DB, gangId)
		if len(GANG_LOCATIONS_DB[gangId]) == 0 {
			delete(GANG_LOCATIONS_DB, gangId)
		}
	}
}

func GetGangLocations(gangId string) map[string]Latlng {
	return GANG_LOCATIONS_DB[gangId]
}
