import React, { useState, useEffect } from "react";
import "./App.css";
import NetworkViz from "./graph/graph";
import SplashScreen from "./components/splash/splash";
import AppHeader from "./components/appHeader/appHeader";
import AppDrawer from "./components/drawer/drawer";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function App() {
  const [formIsSubmitted, setFormIsSubmitted] = useState(0);
  const [typedHashtag, setTypedHashtag] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [searchResult, setSearchResult] = useState("");

  const classes = useStyles();

  const toggleDrawer = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLanguageChoice = (event) => {
    setLanguage(event.target.value);
  };

  const handleHashtagChange = (event) => {
    setTypedHashtag(event.target.value);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    console.log("In handleFormSubmit:", typedHashtag);
    console.log("In handleFormSubmit:", language);
    setFormIsSubmitted(formIsSubmitted + 1);
    toggleDrawer();
    // API request here
    // set search results
  };

  return (
    <div className={classes.root}>
      <AppHeader isMenuOpen={isMenuOpen} toggleDrawerFunction={toggleDrawer} />
      <AppDrawer
        isMenuOpen={isMenuOpen}
        toggleDrawerFunction={toggleDrawer}
        handleFormSubmit={handleFormSubmit}
        typedHashtag={typedHashtag}
        handleHashtagChange={handleHashtagChange}
        language={language}
        handleLanguageChoice={handleLanguageChoice}
      />
      <>
        {formIsSubmitted ? (
          <NetworkViz
            hashtags={typedHashtag}
            language={language}
            formIsSubmitted={formIsSubmitted}
          />
        ) : (
          // change props to searchResults
          <SplashScreen />
        )}
      </>
    </div>
  );
}

export default App;
