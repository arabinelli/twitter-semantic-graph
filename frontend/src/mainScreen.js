import React from "react";
import NetworkViz from "./components/graph/graph";
import SplashScreen from "./components/splash/splash";
import LoadScreen from "./components/loading/loading";
import { useState, useGlobal } from "reactn";
import TweetModal from "./components/tweetsModal/tweetsModal";
import fetchHashtagTweets from "./services/fetchHashtagTweets";

const MainScreen = (props) => {
  const [isTweetModalOpen, setTweetModalOpen] = useState(false);
  const [hasDataLoaded, setDataLoaded] = useState(false);
  const [tweetsData, setTweetsData] = useState("");
  const [selectedHashtag, setSelectedHashtag] = useState("");

  const [inputedHashtag] = useGlobal("inputedHashtag");
  const [inputedLanguage] = useGlobal("inputedLanguage");

  const handleNodeClick = async (node, event) => {
    setDataLoaded(false);
    setTweetModalOpen(isTweetModalOpen ? false : true);
    setSelectedHashtag(node.name);
    let data = await fetchHashtagTweets(
      inputedHashtag,
      inputedLanguage,
      node.name
    ).then((data) => {
      return data;
    });
    setTweetsData(data);
    setDataLoaded(true);
  };

  const handleTweetModalBackgroundClick = () => {
    setTweetModalOpen(false);
  };

  return (
    <>
      {props.formIsSubmitted ? (
        props.dataHasLoaded ? (
          <div>
            <NetworkViz
              data={props.graphData}
              handleNodeClick={handleNodeClick}
            />
            <TweetModal
              isModalOpen={isTweetModalOpen}
              handleBackgroundClick={handleTweetModalBackgroundClick}
              tweets={tweetsData}
              hasDataLoaded={hasDataLoaded}
              selectedHashtag={selectedHashtag}
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
