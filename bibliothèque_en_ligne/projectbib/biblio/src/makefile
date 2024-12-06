make_local_server: 
	python3 manage.py runserver
make_up: 
	docker-compose up 
make_build: 
	docker-compose build
make_down:
	docker-compose down 
make_buid_without_cache:
	docker-compose build  --no-cache --progress=plain
make_run: 
	make_down && make_up 
