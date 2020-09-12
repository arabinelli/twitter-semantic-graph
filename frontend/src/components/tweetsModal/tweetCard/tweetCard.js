import React from "react";
import "./tweetCard.css";

const TweetCard = (props) => {
  return (
    <>
      <div className="card">
        <p className="account-name">{props.accountName}</p>
        <p className="user-handle">{props.twitter_handle}</p>
        <p className="tweet">{props.tweet}</p>
        <p className="datetime">{props.datetime}</p>
      </div>
    </>
  );
};

export default TweetCard;
