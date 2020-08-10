from typing import Optional, List
from fastapi import FastAPI
from pydantic import BaseModel

from twitter.client import TwitterClient
from network.builder import NetworkBuilder

app = FastAPI()


class GraphRequest(BaseModel):
    hashtags: List[str]
    languages: Optional[List[str]] = None
    filter_retweets: Optional[bool] = True
    filter_frequency: Optional[int] = 0


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
    graph = network_builder.build_graph(filter_term_frequency=request.filter_frequency)
    return graph


@app.post("/get-graph")
async def root(request: GraphRequest):
    return make_graph(request)
