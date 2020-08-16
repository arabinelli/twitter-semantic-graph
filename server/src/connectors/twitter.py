import os
import tweepy as tw


class TwitterClient:
    def __init__(self):
        self._authenticate()

    def _authenticate(self):
        """Handles Twitter authentication flow and creates an API object
        """
        self._read_keys_from_env_variables()
        auth = tw.OAuthHandler(
            self.twitter_keys["CONSUMER_KEY"], self.twitter_keys["CONSUMER_SECRET"]
        )
        auth.set_access_token(
            self.twitter_keys["ACCESS_TOKEN_KEY"],
            self.twitter_keys["ACCESS_TOKEN_SECRET"],
        )
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

    def search_tweets_by_hashtags(
        self,
        hashtags: list,
        date_from="",
        date_to="",
        filter_retweets=False,
        languages=[],
        full_tweet=True,
        tweets_limit=500,
    ):
        """Search Twitter for tweets containing one or more hashtags provided. 

        Args:
            hashtags (list): A list containing one or more hashtags to be searched
            date_from (str, optional): The earliest posting date (%Y-%m-%d) of tweets to be retreived. Defaults to "".
            date_to (str, optional): The latest posting date (%Y-%m-%d) of tweets to be retreived. Defaults to "".
            filter_retweets (bool, optional): Should retweets be omitted? Defaults to False.
            languages (list, optional): Limit the research to one or more given languages. Defaults to all languages.
            full_tweet (bool, optional): Should full tweets (opposed to truncating to 140 chars) be returned? Defaults to True.
            tweets_limit (int, optional): The maximum number of tweets to be retreived, useful for performance reasons. Defaults to 500

        Returns:
            tw.tweets: iterator of tweets
            full_tweet: boolean specifying if full tweets were retreived
        """
        query = self._build_query(
            hashtags=hashtags, filter_retweets=filter_retweets, languages=languages
        )

        tweet_mode = "extended" if full_tweet else "compat"

        tweets = tw.Cursor(
            self.api.search, q=query, since=date_from, tweet_mode=tweet_mode
        )

        return tweets.items(tweets_limit), full_tweet

    def _build_query(
        self, hashtags: list, filter_retweets=False, languages=[],
    ):
        """Builds a Twitter hashtag query. 

        Args:
            hashtags (list): A list containing one or more hashtags to be searched
            filter_retweets (bool, optional): Should retweets be omitted? Defaults to False.
            languages (list, optional): Limit the research to one or more given languages. Defaults to all languages.

        Raises:
            TypeError: If the hashtags is not a list
            ValueError: If the hashtags list is empty
        """
        if type(hashtags) != list:
            raise TypeError(
                "The hashtags parameters should be of list type. "
                + str(type(hashtags))
                + " was provided"
            )
        if len(hashtags) == 0:
            raise ValueError("The list of hashtags should contain at least 1 element")
        if type(languages) == str and len(languages) == 2:
            Warning(
                "languages was supplied as a string rather than a list. Type will be casted to list assuming a single entry"
            )
            languages = [languages]
        elif type(languages) != list:
            raise TypeError(
                "The languages parameter should be a list type. "
                + str(type(languages))
                + " was provided"
            )

        query_string = " OR ".join(hashtags)
        if len(languages) > 0:
            query_string += " "
            query_string += " OR ".join(
                ["lang:" + language_code for language_code in languages]
            )
        if filter_retweets:
            query_string += " -filter:retweets"

        return query_string

