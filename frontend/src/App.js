import React, { useState } from "react";
import "./App.css";
import AppHeader from "./components/appHeader/appHeader";
import AppDrawer from "./components/drawer/drawer";
import fetchGraphData from "./services/fetchBaseData";
import MainScreen from "./mainScreen";
import { useGlobal, setGlobal } from "reactn";

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

setGlobal({
  inputedHashtag: "",
  inputedLanguage: "",
});

function App() {
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);
  const [graphData, setGraphData] = useState({
    graph_data: { nodes: [], links: [] },
    communities: [],
  });
  const [typedHashtag, setTypedHashtag] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("");
  const [dataHasLoaded, setDataLoaded] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState("");

  const [inputedHashtag, setInputedHashtag] = useGlobal("inputedHashtag");
  const [inputedLanguage, setInputedLanguage] = useGlobal("inputedLanguage");

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

  const handleGraphBackgroundClick = (event) => {
    setSelectedCommunity("");
  };

  const handleCommunitySelectionChange = (event, newValue) => {
    console.log(newValue);
    newValue === 0
      ? setSelectedCommunity("")
      : setSelectedCommunity(Number(newValue - 1));
    console.log(selectedCommunity);
  };

  const handleFormSubmit = async (event) => {
    setDataLoaded(false);
    event.preventDefault();
    setFormIsSubmitted(true);
    toggleDrawer();
    setInputedHashtag(typedHashtag);
    setInputedLanguage(language);
    let data = await fetchGraphData(typedHashtag, language).then((data) => {
      return data;
    });
    console.log(data.communities);
    setGraphData(data);
    setDataLoaded(true);
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
        dataHasLoaded={dataHasLoaded}
        communities={graphData.communities}
        handleCommunitySelectionChange={handleCommunitySelectionChange}
        selectedCommunity={selectedCommunity}
      />
      <MainScreen
        dataHasLoaded={dataHasLoaded}
        formIsSubmitted={formIsSubmitted}
        graphData={graphData.graph_data}
        communities={graphData.communities}
        selectedCommunity={selectedCommunity}
        handleBackgroundClick={handleGraphBackgroundClick}
      />
    </div>
  );
}

export default App;
