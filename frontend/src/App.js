import React, { useState, useEffect } from "react";
import "./App.css";
import NetworkViz from "./graph/graph";
import SplashScreen from "./components/splash/splash";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import MenuIcon from "@material-ui/icons/Menu";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Menu,
  Drawer,
  TextField,
  MenuItem,
} from "@material-ui/core";

const drawerWidth = "20vw";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "100vh",
  },
  drawer: {
    padding: theme.spacing(1),
    width: drawerWidth,
    flexShrink: 0,
    // height: "90vh",
    // alignContent: "bottom",
    "& .MuiTextField-root": {
      width: "18vw",
    },
    "& .MuiButton-root": {
      backgroundColor: "#d10019",
    },
    "& .MuiButton-label": {
      color: "#f1faee",
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#f1faee",
  },

  inputFields: {
    margin: theme.spacing(2),
    marginTop: theme.spacing(3),
  },
  drawerTitle: {
    margin: theme.spacing(2),
  },
  appBar: {
    backgroundColor: "#457b9d",
    // zIndex: theme.zIndex.drawer + 100,
    zIndex: 1400,
  },
  toolbar: theme.mixins.toolbar,
}));

const languages = [
  {
    value: "",
    label: "Any",
  },
  {
    value: "en",
    label: "English",
  },
  {
    value: "it",
    label: "Italian",
  },
  {
    value: "de",
    label: "German",
  },
  {
    value: "fr",
    label: "French",
  },
  {
    value: "es",
    label: "Spanish",
  },
];

function App() {
  const [formIsSubmitted, setFormIsSubmitted] = useState(false);
  const [typedHashtag, setTypedHashtag] = useState("");
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState("");

  const classes = useStyles();

  const toggleDrawer = () => {
    setMenuOpen(!isMenuOpen);
  };

  const handleLanguageChoice = (event) => {
    setLanguage(event.target.value);
  };

  const handleFormSubmit = (event) => {
    setFormIsSubmitted(false);
    event.preventDefault();
    console.log(typedHashtag);
    console.log(language);
    setFormIsSubmitted(true);
    toggleDrawer();
  };

  return (
    <div className={classes.root}>
      <AppBar position="relative" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
          >
            {isMenuOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h5" className={classes.title}>
            Twitter Hashtag Mapper
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={toggleDrawer}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <Typography variant="h6" className={classes.drawerTitle}>
          What are you looking for?
        </Typography>
        <form
          className={classes.textFields}
          noValidate
          autoComplete="off"
          onSubmit={handleFormSubmit}
        >
          <div className={classes.inputFields}>
            <TextField
              id="standard-basic"
              label="Hashtags"
              multiline
              value={typedHashtag}
              onChange={(e) => {
                setTypedHashtag(e.target.value);
              }}
            />
          </div>
          <div className={classes.inputFields}>
            <TextField
              id="select-language"
              select
              label="Language"
              value={language}
              onChange={handleLanguageChoice}
              helperText="Select the language you're interested in"
            >
              {languages.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={classes.inputFields}>
            <Button variant="contained" type="submit">
              Get Graph!
            </Button>
          </div>
        </form>
      </Drawer>
      <>
        {formIsSubmitted === true ? (
          <NetworkViz hashtags={typedHashtag} language={language} />
        ) : (
          <SplashScreen />
        )}
      </>
    </div>
  );
}

export default App;
