import React from "react";
import NetworkViz from "./components/graph/graph";
import SplashScreen from "./components/splash/splash";
import LoadScreen from "./components/loading/loading";
import { useState, useGlobal } from "reactn";
import TweetModal from "./components/tweetsModal/tweetsModal";
import TopicController from "./components/topicController/topicController";
import fetchHashtagTweets from "./services/fetchHashtagTweets";

const MainScreen = (props) => {
  const [isTweetModalOpen, setTweetModalOpen] = useState(false);
  const [hasDataLoaded, setDataLoaded] = useState(false);
  const [tweetsData, setTweetsData] = useState("");
  const [selectedHashtag, setSelectedHashtag] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState("");
  const [showExtendedTopics, setShowExtendedTopics] = useState(false);

  const [inputedHashtag] = useGlobal("inputedHashtag");
  const [inputedLanguage] = useGlobal("inputedLanguage");
  const [hasError, setError] = useGlobal("hasError");

  const handleNodeClick = async (node, event) => {
    setDataLoaded(false);
    setTweetModalOpen(isTweetModalOpen ? false : true);
    setSelectedHashtag(node.name);
    let data = await fetchHashtagTweets(
      inputedHashtag,
      inputedLanguage,
      node.name,
      setError
    ).then((data) => {
      return data;
    });
    setTweetsData(data);
    setDataLoaded(true);
  };

  const handleCommunitySelectionChange = (event, newValue) => {
    console.log(newValue);
    newValue === 0
      ? setSelectedCommunity("")
      : setSelectedCommunity(Number(newValue - 1));
  };

  const handleGraphBackgroundClick = (event) => {
    setSelectedCommunity("");
    setShowExtendedTopics(false);
  };

  const handleTopicButtonClick = () => {
    setShowExtendedTopics(!showExtendedTopics);
  };

  const handleTweetModalBackgroundClick = (event) => {
    setTweetModalOpen(false);
  };

  const setNewCommunityValue = (delta) => {
    if (selectedCommunity === "") {
      if (delta === 1) {
        setSelectedCommunity(0);
      } else if (delta === -1) {
        setSelectedCommunity(props.communities.length - 1);
      }
    } else if ((selectedCommunity === 0) & (delta === -1)) {
      setSelectedCommunity("");
    } else if (
      (selectedCommunity === props.communities.length - 1) &
      (delta === 1)
    ) {
      setSelectedCommunity("");
    } else {
      setSelectedCommunity(selectedCommunity + delta);
    }
  };

  const handlePreviousCommunity = () => {
    setNewCommunityValue(-1);
  };

  const handleNextCommunity = () => {
    setNewCommunityValue(1);
  };

  return (
    <>
      {props.formIsSubmitted ? (
        props.dataHasLoaded ? (
          <div>
            <NetworkViz
              data={props.graphData}
              communities={props.communities}
              selectedCommunity={selectedCommunity}
              handleNodeClick={handleNodeClick}
              handleBackgroundClick={handleGraphBackgroundClick}
            />
            <TweetModal
              isModalOpen={isTweetModalOpen}
              handleBackgroundClick={handleTweetModalBackgroundClick}
              tweets={tweetsData}
              hasDataLoaded={hasDataLoaded}
              selectedHashtag={selectedHashtag}
            />
            <TopicController
              communities={props.communities}
              handleCommunitySelectionChange={handleCommunitySelectionChange}
              selectedCommunity={selectedCommunity}
              handlePreviousCommunity={handlePreviousCommunity}
              handleNextCommunity={handleNextCommunity}
              handleButtonClick={handleTopicButtonClick}
              showExtendedTopics={showExtendedTopics}
            />
          </div>
        ) : (
          <LoadScreen />
        )
      ) : (
        // change props to searchResults
        <SplashScreen />
      )}
    </>
  );
};

export default MainScreen;
