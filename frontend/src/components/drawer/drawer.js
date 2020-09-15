import React from "react";
import {
  Typography,
  Button,
  Drawer,
  TextField,
  MenuItem,
} from "@material-ui/core";

import { makeStyles } from "@material-ui/core/styles";

const AppDrawer = (props) => {
  const drawerWidth = "20vw";

  const useStyles = makeStyles((theme) => ({
    root: {
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
      "& .MuiTextField-root": {
        width: "18vw",
      },
      "& .MuiButton-contained": {
        backgroundColor: "#d10019",
        "& .MuiButton-label": {
          color: "#f1faee",
        },
      },
      "& .Mui-disabled": {
        backgroundColor: "#00000026",
      },
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#f1faee",
    },
    inputFields: {
      margin: theme.spacing(2),
      marginTop: theme.spacing(2),
    },
    drawerTitle: {
      margin: theme.spacing(2),
    },
    toolbar: theme.mixins.toolbar,
  }));

  const classes = useStyles();

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

  return (
    <Drawer
      anchor="left"
      open={props.isMenuOpen}
      onClose={props.toggleDrawerFunction}
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
        onSubmit={props.handleFormSubmit}
      >
        <div className={classes.inputFields}>
          <TextField
            required
            id="standard-basic"
            label="Hashtags"
            multiline
            value={props.typedHashtag}
            onChange={props.handleHashtagChange}
          />
        </div>
        <div className={classes.inputFields}>
          <TextField
            id="select-language"
            select
            label="Language"
            value={props.language}
            onChange={props.handleLanguageChoice}
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
          <Button
            className={
              props.typedHashtag === ""
                ? classes.drawer["& .Mui-disabled"]
                : classes.drawer.button
            }
            variant="contained"
            type="submit"
            disabled={props.typedHashtag === "" ? true : false}
          >
            Get Graph!
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

export default AppDrawer;
