import React from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, AppBar, Toolbar, Button } from "@material-ui/core";

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
  appBar: {
    backgroundColor: "#457b9d",
    // zIndex: theme.zIndex.drawer + 100,
    zIndex: 1400,
  },
  toolbar: theme.mixins.toolbar,
}));

const AppHeader = (props) => {
  const classes = useStyles();

  const handleGetInTouch = () => {
    const url = "https://github.com/arabinelli";
    window.open(url, "_blank");
  };

  return (
    <AppBar position="relative" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
          onClick={props.toggleDrawerFunction}
        >
          {props.isMenuOpen ? <MenuOpenIcon /> : <MenuIcon />}
        </IconButton>
        <Typography variant="h5" className={classes.title}>
          Twitter Hashtag Mapper
        </Typography>
        <Button color="inherit" onClick={handleGetInTouch}>
          Get in touch!
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;
