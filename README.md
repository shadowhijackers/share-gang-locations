## SHARE GANG LOCATIONS
   Hi, Share Gang locations is a real time map based project 
Which is used to __track the team locations live in a single map.__
for example you friends are started to going for some party and
you have to track everyone live in single map then you can use
this application.

## Techstack
   Application developed in Go, Gin, Gorila Websocket, Vue js 3 with minimalistic
 to write vue render code you have to follow `https://github.com/developit/htm ` 
 hypertext tagged markeup which used to write jsx code in js itself without 
 any transpiller.
  
## RUN SERVER

Run this application by following command in local environment
> go run main.go -env dev

## RUN UI
> cd public; npm run scss-watch

Docker 
> docker build -t share-gang-locations -f Dockerfile.devenv $GO_PATH/share-gang-locations
> docker run -dp 8080:8080 share-gang-locations

Test with https://localhost:8080

## APP LINK

[LIVE TEST]( https://share-gang-locations.herokuapp.com)

> Try with latest version of browsers
