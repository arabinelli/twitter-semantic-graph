
build:
	docker build -t twitter_hashtag_mapper:0.1 .
	docker run -p 8000:8000 --env-file=env_file --rm twitter_hashtag_mapper:0.1 python3 -m pytest	

run: build
	docker run -p 8000:8000 --env-file=env_file --rm -it twitter_hashtag_mapper:0.1
