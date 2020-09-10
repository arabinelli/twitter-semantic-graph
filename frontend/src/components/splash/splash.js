import React from "react";
import "./splash.css";
import AnimatedBackground from "../animatedBackground/animatedBackground";

const SplashScreen = () => {
  return (
    <div>
      <AnimatedBackground />
      <div className="welcome">
        <p>What are you gonna search today?</p>
        <p>Open the side menu to start...</p>
      </div>
    </div>
  );
};

export default SplashScreen;
