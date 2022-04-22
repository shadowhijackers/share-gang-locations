 #! /bin/bash

go mod download
go build -o bin/share-gang-locations -v . 
echo "{}" > backup.json 
chmod 644 backup.json
