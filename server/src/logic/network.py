import re, collections, math

import networkx as nx
import pandas as pd

from numpy import dot
from networkx.readwrite import json_graph
from networkx.algorithms.community import label_propagation_communities

punctuation = "!\"$%&'()*+,-./:;<=>?@[\\]^`{|}~"


class NetworkBuilder:
    extra_attributes = []
    attributes_values = dict()

    def __init__(self):
        pass

    @staticmethod
    def _clean_string(string: str):
        """Removes punctuation - except hashes - from a string and splits it into a list
        """
        regex = re.compile("[%s]" % re.escape(punctuation))
        string = regex.sub(" ", string)
        string = string.replace("  ", " ")
        string = string.split()
        return string

    def load_clean_corpus(self, corpus: list):
        """Loads the corpus into the class and does some basic cleaning

        Args:
            corpus (list): A list of strings representing the corpus to be analyzed
        """
        self.data = pd.DataFrame({"corpus": corpus})
        self.data["corpus"] = self.data.corpus.apply(lambda x: self._clean_string(x))

    def enrich_corpus(self, attribute: dict):
        """Adds additional data points to the corpus (e.g. language, sentiment, etc.). 
        Adds the data to the DataFrame and keeps a reference for how to aggregate the data in the 
        self.extra_attributes list

        Args:
            attribute (dict): a dictionary containing three keys: 
                "name" - the name of the column that will be created, 
                "values" - a list of values to be added, 
                "aggregation_mode" - how the metric should be aggregated (e.g. avg, proportion, etc.)

            Example arg:
            {
             "name": "sentiment"
             "values": [1,2,3,4,5]
             "aggregation_mode": "avg"
            }

        Raises:
            ValueError: [description]
        """

        if len(attribute["values"]) != len(self.data.corpus):
            raise ValueError(
                "The lenght of the values provided doesn't match the lenght of the corpus.\n"
                + f"The corpus has lenght {len(self.data.corpus)}"
                + f", while the data provided has lenght {len(attribute['values'])}"
            )

        self.data[attribute["name"]] = attribute["values"]
        self.extra_attributes.append({attribute["name"]: attribute["aggregation_mode"]})

    def _apply_attributes(self, one_hot_encoded_df):
        """A commit-like function to transform the attributes and add them to the graph.
        """
        for i, label in enumerate(self.labels):
            try:
                selected_idx = one_hot_encoded_df.index[
                    one_hot_encoded_df[label] != 0
                ].tolist()
                keywords_entries_df = self.data.iloc[selected_idx]
            except KeyError:
                print("Label " + label + " not found in the dataframe")
            self.attributes_values[label] = []
            for attribute in self.extra_attributes:
                if attribute["aggregation_mode"] == "avg":
                    value = keywords_entries_df[attribute["name"]].mean()
                elif attribute["aggregation_mode"] == "proportion":
                    value = collections.Counter(keywords_entries_df[attribute["name"]])
                else:
                    raise Exception(
                        f'The aggregation mode "{attribute["aggregation_mode"]}" is not yet supported'
                    )
                self.G.nodes[i][attribute["name"]] = value

    def _extract_from_corpus(self, by="hashtag"):
        """[summary]

        Args:
            by (str, optional): What should be extracted from the corpus. Defaults to "hashtag".
        """
        if by == "hashtag":
            self.data["keyword"] = self.data.corpus.apply(
                lambda x: [word.lower() for word in x if word.startswith("#")]
            )

        else:
            raise NotImplementedError

    def _calculate_network_metrics(self):
        raise NotImplementedError

    def _find_communities(self):
        communities = list(label_propagation_communities(self.G))
        multi_node_communities = [
            community for community in communities if len(community) > 1
        ]
        parsed_communities = []
        for community in multi_node_communities:
            parsed_communities.append([self.G.nodes[i] for i in community])
        return multi_node_communities

    def build_graph(
        self, filter_node_frequency=0, filter_link_frequency=0, keywords_to_remove=[]
    ):
        """Builds the graph

        Args:
            filter_term_frequency (int, optional): Filter out nodes appearing fewer times than the threshold. Defaults to 0 (no filtering).

        Returns:
            dict: A graph dictionary
        """
        self._extract_from_corpus()
        one_hot_encoded_df = pd.get_dummies(
            pd.DataFrame(self.data.keyword.values.tolist()).stack()
        )
        one_hot_encoded_df = one_hot_encoded_df.sum(axis=0, level=0)
        one_hot_encoded_df = one_hot_encoded_df.drop(keywords_to_remove, axis=1)
        terms_frequency = one_hot_encoded_df.sum(axis=0).iteritems()
        self.labels = list(one_hot_encoded_df.columns)
        adjacency_matrix = one_hot_encoded_df.values
        self.G = nx.from_numpy_matrix(dot(adjacency_matrix.T, adjacency_matrix))
        for i, label in enumerate(self.labels):
            self.G.nodes[i]["name"] = label
            freq = next(terms_frequency)
            assert freq[0] == label
            self.G.nodes[i]["frequency"] = freq[1]
            self.G.nodes[i]["size"] = freq[1]
        self._apply_attributes(one_hot_encoded_df)
        self.G.remove_edges_from(nx.selfloop_edges(self.G))
        edge_weights = nx.get_edge_attributes(self.G, "weight")
        self.G.remove_edges_from(
            (e for e, w in edge_weights.items() if w <= filter_link_frequency)
        )
        node_frequencies = nx.get_node_attributes(self.G, "frequency")
        self.G.remove_nodes_from(
            (n for n, f in node_frequencies.items() if f <= filter_node_frequency)
        )
        self.G = nx.relabel_nodes(
            self.G, dict(zip(self.G, range(0, self.G.number_of_nodes())))
        )
        return {
            "graph_data": json_graph.node_link_data(self.G),
            "communities": self._find_communities(),
        }
        # return json_graph.node_link_data(self.G)

