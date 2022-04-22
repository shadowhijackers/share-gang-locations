package models

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"sync"
)

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
var m sync.Mutex
var wg sync.WaitGroup

func AddOrUpdateUserLocation(gangId string, userId string, latlng Latlng) {
	wg.Add(1)
	if GANG_LOCATIONS_DB[gangId] == nil {
		GANG_LOCATIONS_DB[gangId] = make(map[string]Latlng)
	}
	GANG_LOCATIONS_DB[gangId][userId] = latlng
	go BackUpDB(&m, &wg)
	wg.Wait()
}

// currently not using this func  due to persist the user data
func RemovedUserLocation(gangId string, userId string) {
	wg.Add(1)
	if GANG_LOCATIONS_DB[gangId] != nil {
		delete(GANG_LOCATIONS_DB, gangId)
		if len(GANG_LOCATIONS_DB[gangId]) == 0 {
			delete(GANG_LOCATIONS_DB, gangId)
		}
	}
	go BackUpDB(&m, &wg)
	wg.Wait()
}

func GetGangLocations(gangId string) map[string]Latlng {
	return GANG_LOCATIONS_DB[gangId]
}

func BackUpDB(m *sync.Mutex, wg *sync.WaitGroup) {
	m.Lock()
	content, err := json.Marshal(GANG_LOCATIONS_DB)
	if err != nil {
		log.Println(err)
	}
	err = ioutil.WriteFile("backup.json", content, 0644)
	if err != nil {
		log.Fatal(err)
	}
	m.Unlock()
	wg.Done()
}

func RestoreDBFromBackUped() {
	content, err := ioutil.ReadFile("backup.json")
	if err != nil {
		log.Fatal(err)
	}
	err = json.Unmarshal(content, &GANG_LOCATIONS_DB)
	if err != nil {
		log.Fatal(err)
	}
}

func CleanAllData() {
	GANG_LOCATIONS_DB = make(map[string]map[string]Latlng)
	content, err := json.Marshal(GANG_LOCATIONS_DB)
	if err != nil {
		log.Println(err)
	}
	err = ioutil.WriteFile("backup.json", content, 644)
	if err != nil {
		log.Println(err)
	}
}
