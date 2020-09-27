import React from "react";
import { Ring } from "react-spinners-css";
import "./loading.css";
import AnimatedBackground from "../animatedBackground/animatedBackground";

const LoadScreen = () => {
  return (
    <div>
      <AnimatedBackground />
      <div className="loading">
        <Ring color="#a8dadc" size={120} />
        <p>Hold on a sec...</p>
        <p>Your data is being fetched from Twitter!</p>
      </div>
    </div>
  );
};

export default LoadScreen;
