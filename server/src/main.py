from typing import Optional, List
from fastapi import FastAPI
from pydantic import BaseModel

from connectors.twitter import TwitterClient
from logic.network import NetworkBuilder
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["http://localhost", "http://localhost:3000", "http://localhost:3001"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class GraphRequest(BaseModel):
    hashtags: List[str]
    languages: Optional[List[str]] = None
    filter_retweets: Optional[bool] = True
    filter_node_frequency: Optional[int] = 0
    filter_link_frequency: Optional[int] = 0


def make_graph(request: GraphRequest):
    twitter_client = TwitterClient()
    tweets, full_text = twitter_client.search_tweets_by_hashtags(
        request.hashtags,
        filter_retweets=request.filter_retweets,
        languages=request.languages,
    )
    print("Fetching tweets...")
    corpus = [tweet.full_text for tweet in tweets]
    print("Building the graph...")
    network_builder = NetworkBuilder()
    network_builder.load_clean_corpus(corpus)
    keywords_to_remove = request.hashtags if len(request.hashtags) == 1 else []
    graph = network_builder.build_graph(
        filter_node_frequency=request.filter_node_frequency,
        filter_link_frequency=request.filter_link_frequency,
        keywords_to_remove=keywords_to_remove,
    )
    return graph


@app.post("/get-graph")
async def root(request: GraphRequest):
    print("received")
    print(request)
    return make_graph(request)
