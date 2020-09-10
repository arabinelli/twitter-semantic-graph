import React, { useState } from "react";
import "./App.css";
import AppHeader from "./components/appHeader/appHeader";
import AppDrawer from "./components/drawer/drawer";
import fetchGraphData from "./services/fetchBaseData";
import MainScreen from "./mainScreen";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function App() {
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [typedHashtag, setTypedHashtag] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [dataHasLoaded, setDataLoaded] = useState(false);

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

  const handleFormSubmit = async (event) => {
    setDataLoaded(false);
    event.preventDefault();
    console.log("In handleFormSubmit:", typedHashtag);
    console.log("In handleFormSubmit:", language);
    setFormIsSubmitted(true);
    toggleDrawer();
    let data = await fetchGraphData(typedHashtag, language).then((data) => {
      return data;
    });
    setDataLoaded(true);
    setGraphData(data);
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
      <MainScreen
        dataHasLoaded={dataHasLoaded}
        formIsSubmitted={formIsSubmitted}
        graphData={graphData}
      />
    </div>
  );
}

export default App;
