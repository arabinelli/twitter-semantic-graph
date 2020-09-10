import React from "react";
import NetworkViz from "./components/graph/graph";
import SplashScreen from "./components/splash/splash";
import LoadScreen from "./components/loading/loading";

const MainScreen = (props) => {
  return (
    <>
      {props.formIsSubmitted ? (
        props.dataHasLoaded ? (
          <NetworkViz data={props.graphData} />
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
