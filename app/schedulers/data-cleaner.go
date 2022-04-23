package schedulers

import (
	"github.com/robfig/cron/v3"
	"github.com/shadowhijackers/share-gang-locations/app/models"
)

func StartDataCleaner() {
	cronIns := cron.New()
	cronIns.AddFunc("@daily", func() { // clear all the data in midnight
		models.CleanAllData()
	})

	cronIns.Start()
}
