#!/bin/bash
docker container inspect kafka | jq -r '.[0].NetworkSettings.Networks.local_networks.IPAddress'
