import React, { useState, useEffect, useRef, useCallback } from "react";
import { sqrt, max } from "mathjs";
import ForceGraph2D from "react-force-graph-2d";
import useWindowDimensions from "../../utils/windowSize";
import "./graph.css";

const NetworkViz = (props) => {
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState(null);

  const forceRef = useRef(null);
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    if (forceRef.current != null) {
      forceRef.current.d3Force("charge").strength(-350);
      forceRef.current.d3Force("link").distance(300);
    }
  });

  const nodeObject = useCallback(
    (node, ctx, globalScale) => {
      const label = node.name;
      const fontSize = max(10, 3 * sqrt(node.size)) / globalScale;
      ctx.font = highlightNodes.has(node.id)
        ? `${fontSize}px Montserrat`
        : `${fontSize}px Montserrat`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(
        (n) => n + fontSize * 0.5
      ); // some padding
      if (highlightNodes.size === 0) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      } else {
        ctx.fillStyle = highlightNodes.has(node.id)
          ? "rgba(0, 0, 0, 0.3)"
          : "rgba(0, 0, 0, 0)";
      }
      ctx.fillRect(
        node.x - bckgDimensions[0] / 2,
        node.y - bckgDimensions[1] / 2,
        ...bckgDimensions
      );

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (highlightNodes.size === 0) {
        ctx.fillStyle = "#a8dadc";
      } else {
        ctx.fillStyle = highlightNodes.has(node.id) ? "#a8dadc" : "#303030";
      }

      ctx.fillText(label, node.x, node.y);
    },
    [highlightNodes]
  );

  const updateHighlight = () => {
    setHighlightNodes(highlightNodes);
    setHighlightLinks(highlightLinks);
  };

  const handleNodeHover = (node) => {
    if (props.selectedCommunity === "") {
      highlightNodes.clear();
      highlightLinks.clear();
      if (node) {
        highlightNodes.add(node.id);
        if (node.neighbors) {
          node.neighbors.forEach((neighbor) => highlightNodes.add(neighbor.id));
          node.links.forEach((link) => highlightLinks.add(link));
        }
      }
      console.log(highlightLinks);
      setHoverNode(node || null);
      updateHighlight();
    }
  };

  const handleLinkHover = (link) => {
    highlightNodes.clear();
    highlightLinks.clear();

    if (link) {
      highlightLinks.add(link);
      highlightNodes.add(link.source);
      highlightNodes.add(link.target);
    }

    updateHighlight();
  };

  useEffect(() => {
    highlightNodes.clear();
    highlightLinks.clear();
    if (props.selectedCommunity !== "") {
      props.communities[props.selectedCommunity].forEach((id) => {
        highlightNodes.add(id);
        // node.links.forEach((link) => highlightLinks.add(link));
      });
      // setHoverNode(node || null);
      forceRef.current.zoomToFit(600, 100, (node) => {
        return highlightNodes.has(node.id) ? true : false;
      });
    } else {
      forceRef.current.centerAt(0, 0, 900);
      forceRef.current.zoom(0.45, 900);
    }
    updateHighlight();
  }, [props.selectedCommunity]);

  return (
    <div className="network">
      <ForceGraph2D
        height={height * 0.9}
        width={width}
        graphData={props.data}
        nodeLabel="name"
        nodeRelSize={6}
        linkColor={(link) => {
          if (highlightLinks.size === 0) {
            if (props.selectedCommunity !== "") {
              return highlightNodes.has(link.source.id) &&
                highlightNodes.has(link.target.id)
                ? "#AAAAAA80"
                : "#AAAAAA20";
            } else {
              return "#AAAAAA40";
            }
          } else {
            return highlightLinks.has(link) ? "#AAAAAA80" : "#AAAAAA20";
          }
        }}
        linkWidth={(link) => (highlightLinks.has(link) ? 2 : 1)}
        linkOpacity={0.3}
        linkCurvature={0.2}
        nodeCanvasObject={nodeObject}
        d3AlphaMin={0.03}
        ref={forceRef}
        onNodeHover={handleNodeHover}
        onNodeClick={props.handleNodeClick}
        onBackgroundClick={(event) => {
          props.handleBackgroundClick(event);
          highlightNodes.clear();
          highlightLinks.clear();
        }}
        warmupTicks={10}
      />
    </div>
  );
};

export default NetworkViz;
