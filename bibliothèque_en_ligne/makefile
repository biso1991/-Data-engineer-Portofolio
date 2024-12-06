build:
	docker-compose build
build-yarn:
	docker-compose -f docker-compose.yarn.yml build
build-progress:
	docker-compose -f docker-compose.yarn.yml build --progress=plain

build-yarn-nc:
	docker-compose -f docker-compose.yarn.yml build --no-cache

build-nc:
	docker-compose build --no-cache

build-progress_nc:
# build:
	docker-compose build --no-cache --progress=plain

# run_progress_nc:
# 	docker-compose build --progress=plain --no-cache
down:
	docker-compose down --volumes --remove-orphans

down-yarn:
	docker-compose -f docker-compose.yarn.yml down --volumes --remove-orphans

up:
	docker-compose up 
run:
	make down && docker-compose up 

# run-scaled:
# 	make down && docker-compose up --scale spark-worker=3

run-d:
	make down && docker-compose up -d
	
run_without_down:
	docker-compose up 

run-yarn:
	make down-yarn && docker-compose -f docker-compose.yarn.yml up

run-yarn-scaled:
	make down-yarn && docker-compose -f docker-compose.yarn.yml up --scale spark-yarn-worker=3

stop:
	docker-compose stop

stop-yarn:
	docker-compose -f docker-compose.yarn.yml stop


submit:
	docker exec da-spark-master spark-submit --master spark://spark-master:7077 --deploy-mode client ./apps/$(app)

submit-da-book:
	make submit app=data_analysis_book/$(app)

submit-yarn-test:
	docker exec da-spark-yarn-master spark-submit --master yarn --deploy-mode cluster ./examples/src/main/python/pi.py

submit-yarn-cluster:
	docker exec da-spark-yarn-master spark-submit --master yarn --deploy-mode cluster ./apps/$(app)

rm-results:
	rm -r book_data/results/*

ls-yarn:
	docker volume ls

exec_src_kafka:
	docker exec -it kafka /bin/bash

exec_zook1:
	docker exec -it  src-zoo1-1 /bin/bash

execsparkworker:
	docker exec -it spark-worker /bin/bash
	
execsparkmaster:
	docker exec -it spark-master /bin/bash

execsparkhistory:
	docker exec -it spark-history /bin/bash

exec_web-1:
	docker exec -it web-1 /bin/bash

exec_postgres:
	docker exec -it postgres-1 /bin/bash

log_worker: 
	docker container logs  da-spark-worker

log_history: 
	docker container logs da-spark-yarn-history

log_master: 
	docker container logs da-spark-yarn-master

rm_volume:
	docker volume prune

rm_system: 
	docker system prune

rm_sys_volumes:
	docker system prune -a --volumes 

list_images:
	docker images 

list_container:
	docker container ls 


################################
docker_build_1:
	sh docker_buildx

images:
	docker images


cp_file_to_container:
	docker cp web:/myproject /home/bilel/Desktop/tttttttttttttttttttttttttteeeesssssssssssssssssss



