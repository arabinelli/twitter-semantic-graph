import React, { useState } from "react";
// import { Typography, Slider } from "@material-ui/core";
import "./topicController.css";

// import { makeStyles } from "@material-ui/core/styles";

const TopicController = (props) => {
  // const [showExtendedTopics, setShowExtendedTopics] = useState(false);

  // const useStyles = makeStyles((theme) => ({
  //   inputFields: {
  //     margin: theme.spacing(2),
  //     marginTop: theme.spacing(3),
  //   },
  // }));

  // const classes = useStyles();

  // const handleButtonClick = () => {
  //   setShowExtendedTopics(!showExtendedTopics);
  // };

  return props.showExtendedTopics ? (
    <div className="topic-controller">
      <div id="topic-controller-head">
        <div id="number-of-topics">
          <p>{props.communities.length} topics have been found!</p>
        </div>
        <div id="topic-controller-close" onClick={props.handleButtonClick}>
          Close
        </div>
      </div>

      <div id="topic-controller-body">
        <div id="previous" onClick={props.handlePreviousCommunity}>
          {"<< Prev"}
        </div>
        <div id="topic-selected">
          {props.selectedCommunity === ""
            ? "No topic selected"
            : "Topic " + String(props.selectedCommunity + 1)}
        </div>
        <div id="next" onClick={props.handleNextCommunity}>
          {"Next >>"}
        </div>
      </div>
    </div>
  ) : (
    <div
      id="show-topics-button"
      className="topic-controller"
      onClick={props.handleButtonClick}
    >
      Click here to explore the topics
    </div>
  );
};

export default TopicController;
