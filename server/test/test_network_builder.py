import pandas as pd
from network.builder import NetworkBuilder

network_builder = NetworkBuilder()


def test_builder_can_correctly_split_strings():
    corpus = [
        "#this is an #example of a tweet\n\nI want this to be split-well!",
        "Another #example of a #corpus #entry!! LOL",
    ]
    result = pd.Series(
        [
            [
                "#this",
                "is",
                "an",
                "#example",
                "of",
                "a",
                "tweet",
                "I",
                "want",
                "this",
                "to",
                "be",
                "split",
                "well",
            ],
            ["Another", "#example", "of", "a", "#corpus", "#entry", "LOL"],
        ],
        name="corpus",
    )
    network_builder.load_clean_corpus(corpus)
    assert (result == network_builder.data["corpus"]).all()


def test_builder_can_correctly_extract_hashtags():
    corpus = [
        "#this is an #example of a tweet\n\nI want this to be split-well!",
        "Another #example... of a #corpus #entry!! LOL",
    ]
    result = pd.Series(
        [["#this", "#example"], ["#example", "#corpus", "#entry"]], name="keyword"
    )
    network_builder._extract_from_corpus(by="hashtag")

    assert (result == network_builder.data["keyword"]).all()
