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
        <p>HOLD ON A SEC...</p>
        <p>YOUR DATA IS BEING DOWNLOADED FROM TWITTER!</p>
      </div>
    </div>
  );
};

export default LoadScreen;
