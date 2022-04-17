package app

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func indexHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{
		"Id": GenerateUId(),
	})
}

func gangLocationsHandler(c *gin.Context) {
	c.HTML(http.StatusOK, "locations.html", nil)
}
