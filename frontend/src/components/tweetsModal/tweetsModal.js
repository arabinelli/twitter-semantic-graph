import React from "react";
import "./tweetsModal.css";
import TweetCard from "./tweetCard/tweetCard";
import { Ring } from "react-spinners-css";

const TweetModal = (props) => {
  const showHideClassName = props.isModalOpen
    ? "tweet-modal display-block"
    : "tweet-modal display-none";

  return (
    <>
      <div className={showHideClassName} onClick={props.handleBackgroundClick}>
        {props.hasDataLoaded ? (
          <section className="tweet-modal-main">
            <div className="tweet-modal-main header">
              <p className="modal-header">
                Tweets for '{props.selectedHashtag}'
              </p>
            </div>
            <div className="tweet-modal-main body">
              {props.tweets.map((item) => {
                return (
                  <TweetCard
                    accountName={item.username}
                    accountHandle={item.userhandle}
                    tweet={item.text}
                    datetime={item.datetime}
                  />
                );
              })}
            </div>
          </section>
        ) : (
          <div className="loading-tweets">
            <Ring color="#a8dadc" size={50} />
          </div>
        )}
      </div>
    </>
  );
};

export default TweetModal;
