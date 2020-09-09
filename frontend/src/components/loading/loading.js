import React from "react";
import { Ring } from "react-spinners-css";
import "./loading.css";

const LoadScreen = () => {
  return (
    <div className="loading">
      <Ring color="#a8dadc" size={120} />
      <p>HOLD ON A SEC...</p>
      <p>YOUR DATA IS BEING DOWNLOADED FROM TWITTER!</p>
    </div>
  );
};

export default LoadScreen;
