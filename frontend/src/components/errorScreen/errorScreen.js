import React from "react";
import "./errorScreen.css";

const ErrorScreen = () => {
  return (
    <div className="error">
      <div className="text">
        <h1>:(</h1>
        <h3>It's not you, it's us!</h3>
        <h4>#DontBlameItOnOtters</h4>
        <p>Hopefully, a refresh will fix this...</p>
      </div>
    </div>
  );
};

export default ErrorScreen;
