import pytest

from twitter.client import TwitterClient

twitter_client = TwitterClient()

def test_twitter_client_can_retreive_env_variables():
    twitter_client._read_keys_from_env_variables()

def test_twitter_client_can_successfully_authenticate():
    twitter_client._authenticate()
    twitter_client.api.verify_credentials()