build:
	docker build -t twitter_hashtag_mapper_frontend:0.1 .

run: build
	docker run -it --rm -v ${PWD}:/app -v /app/node_modules -p 3001:3000 -e CHOKIDAR_USEPOLLING=true \
    twitter_hashtag_mapper_frontend:0.1