package models

type Latlng struct {
	Lat float64 `json:"lat"`
	Lng float64 `json:"lng"`
}

type userId string
type gangId string

/**
*  SAMPLE DATA
* ------------
*  {
*	   "gang_1":{
*		   "user_1": { lat: 12.0023, lng: 80.2323 }
*	   }
*  }
**/
var GANG_LOCATIONS_DB = make(map[gangId]map[userId]Latlng)
