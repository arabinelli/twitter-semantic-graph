import os
import tweepy as tw


class TwitterClient:
    def __init__(self):
        pass

    def _authenticate(self):
        """Handles Twitter authentication flow and creates an API object
        """
        self._read_keys_from_env_variables()
        auth = tw.OAuthHandler(
            self.twitter_keys["CONSUMER_KEY"], self.twitter_keys["CONSUMER_SECRET"]
        )
        auth.set_access_token(self.twitter_keys["ACCESS_TOKEN_KEY"], self.twitter_keys["ACCESS_TOKEN_SECRET"])
        self.api = tw.API(auth, wait_on_rate_limit=True)

    def _read_keys_from_env_variables(self):
        """Reads the twitter API keys from the environmental variable files. 
            Stores the result in the self.twitter_keys dictionary.

        Raises:
            ValueError: String including the list of the environmental variables that couldn't be loaded
        """
        self.twitter_keys = dict()
        empty_keys = []

        self.twitter_keys["CONSUMER_KEY"] = os.getenv("CONSUMER_KEY", "")
        self.twitter_keys["CONSUMER_SECRET"] = os.getenv("CONSUMER_SECRET", "")
        self.twitter_keys["ACCESS_TOKEN_KEY"] = os.getenv("ACCESS_TOKEN_KEY", "")
        self.twitter_keys["ACCESS_TOKEN_SECRET"] = os.getenv("ACCESS_TOKEN_SECRET", "")

        for key, value in self.twitter_keys.items():
            if value == "":
                empty_keys.append(key)

        if len(empty_keys) > 0:
            error_text = "Couldn't load the following keys: " + ", ".join(empty_keys)
            raise ValueError(error_text)
    
