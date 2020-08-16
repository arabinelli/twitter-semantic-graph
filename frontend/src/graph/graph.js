import React, { useState, useEffect } from "react";
import { Graph } from "react-d3-graph";
// import data from "../../sample_data/graph_data_filtered.json";

const NetworkViz = () => {
  // graph payload (with minimalist structure)
  //   data = {
  //     nodes: [{ id: "Harry" }, { id: "Sally" }, { id: "Alice" }],
  //     links: [
  //       { source: "Harry", target: "Sally" },
  //       { source: "Harry", target: "Alice" },
  //     ],
  //   };

  const [status, setStatus] = useState("idle");
  const [hasError, setErrors] = useState(false);
  const [dataHasLoaded, setDataLoaded] = useState(false);
  const [data, setData] = useState({ nodes: [], links: [] });

  useEffect(() => {
    const abortcontroller = new AbortController();
    const signal = abortcontroller.signal;

    async function fetchGraphData() {
      await fetch("http://localhost/get-graph", {
        method: "POST",
        body: JSON.stringify({
          hashtags: ["#digitalhealth"],
          languages: ["en"],
          filter_node_frequency: 0,
          filter_link_frequency: 0,
        }),
        signal: signal,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("This is your data", data);
          setData(data);
          setDataLoaded(true);
        })
        .catch((err) => {
          console.log(err);
          setErrors(true);
        });

      // try {
      //   const data = await res.json();
      //   setData(data);
      // } catch (error) {
      //   console.log(error);
      // }

      return function cleanup() {
        abortcontroller.abort();
      };
    }
    console.log("Fetching!");
    setStatus("fetching");
    fetchGraphData();
  }, []);

  // the graph configuration, you only need to pass down properties
  // that you want to override, otherwise default ones will be used
  const myConfig = {
    nodeHighlightBehavior: true,
    height: window.innerHeight,
    width: window.innerWidth,
    d3: { gravity: -150, linkStrength: 0.3 },
    node: {
      color: "#a8dadc",
      size: 120,
      highlightStrokeColor: "blue",
      labelProperty: "name",
      fontColor: "white",
    },
    link: {
      highlightColor: "lightblue",
      color: "#AAAAAA",
      opacity: 0.5,
    },
  };

  // // graph event callbacks
  // const onClickGraph = function () {
  //   window.alert(`Clicked the graph background`);
  // };

  // const onClickNode = function (nodeId) {
  //   window.alert(`Clicked node ${nodeId}`);
  // };

  // const onDoubleClickNode = function (nodeId) {
  //   window.alert(`Double clicked node ${nodeId}`);
  // };

  // const onRightClickNode = function (event, nodeId) {
  //   window.alert(`Right clicked node ${nodeId}`);
  // };

  // const onMouseOverNode = function (nodeId) {
  //   window.alert(`Mouse over node ${nodeId}`);
  // };

  // const onMouseOutNode = function (nodeId) {
  //   window.alert(`Mouse out node ${nodeId}`);
  // };

  // const onClickLink = function (source, target) {
  //   window.alert(`Clicked link between ${source} and ${target}`);
  // };

  // const onRightClickLink = function (event, source, target) {
  //   window.alert(`Right clicked link between ${source} and ${target}`);
  // };

  // const onMouseOverLink = function (source, target) {
  //   window.alert(`Mouse over in link between ${source} and ${target}`);
  // };

  // const onMouseOutLink = function (source, target) {
  //   window.alert(`Mouse out link between ${source} and ${target}`);
  // };

  // const onNodePositionChange = function (nodeId, x, y) {
  //   window.alert(
  //     `Node ${nodeId} is moved to new position. New position is x= ${x} y= ${y}`
  //   );
  // };

  return (
    <>
      {dataHasLoaded === true ? (
        <Graph
          id="graph-id" // id is mandatory, if no id is defined rd3g will throw an error
          data={data}
          config={myConfig}
        />
      ) : (
        <p>Data is loading. Please wait...</p>
      )}
    </>
  );
};

export default NetworkViz;
