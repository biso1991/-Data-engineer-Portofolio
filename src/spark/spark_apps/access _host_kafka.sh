host = docker container inspect kafka | jq -r '.[0].Config.Hostname' 
