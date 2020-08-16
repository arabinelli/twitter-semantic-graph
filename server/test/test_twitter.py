import pytest

from connectors.twitter import TwitterClient

twitter_client = TwitterClient()


def test_twitter_client_cannot_create_query_without_hashtags():
    with pytest.raises(ValueError):
        hashtags = []
        twitter_client._build_query(hashtags)


def test_twitter_client_can_create_query_with_one_hashtag():
    hashtags = ["#thishashtag"]
    query = twitter_client._build_query(hashtags)
    assert query == "#thishashtag"


def test_twitter_client_can_create_query_with_multiple_hashtags():
    hashtags = ["#onehashtag", "#otherhashtag"]
    query = twitter_client._build_query(hashtags)
    assert query == "#onehashtag OR #otherhashtag"


def test_twitter_client_can_create_query_with_one_language():
    hashtags = ["#onehashtag", "#otherhashtag"]
    language = ["it"]
    query = twitter_client._build_query(hashtags, languages=language)
    assert query == "#onehashtag OR #otherhashtag lang:it"


def test_twitter_client_can_create_query_with_multiple_languages():
    hashtags = ["#onehashtag", "#otherhashtag"]
    language = ["it", "en"]
    query = twitter_client._build_query(hashtags, languages=language)
    assert query == "#onehashtag OR #otherhashtag lang:it OR lang:en"


def test_twitter_client_can_create_query_filtering_retweets():
    hashtags = ["#onehashtag", "#otherhashtag"]
    query = twitter_client._build_query(hashtags, filter_retweets=True)
    assert query == "#onehashtag OR #otherhashtag -filter:retweets"


def test_twitter_client_can_retreive_env_variables():
    twitter_client._read_keys_from_env_variables()


def test_twitter_client_can_successfully_authenticate():
    twitter_client._authenticate()
    twitter_client.api.verify_credentials()
