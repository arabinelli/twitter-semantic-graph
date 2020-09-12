import React, { useRef, useEffect } from "react";
import useWindowDimensions from "../../utils/windowSize";
import p5 from "p5";
import "./animatedBackground.css";

const AnimatedBackground = (props) => {
  var nParticles = 120;
  var particles = [];
  var particleSize = 90;
  var maxCounter = 40;
  var lines = [];
  var speedFactor = 0.8;

  const { height, width } = useWindowDimensions();

  const processingRef = useRef();
  const Sketch = (p) => {
    p.checkCollision = () => {
      lines = [];
      for (var i = 0; i < nParticles; i++) {
        for (var j = 0; j < nParticles; j++) {
          if (i !== j) {
            var distance = p5.Vector.dist(
              particles[i].position,
              particles[j].position
            );
            if (distance < particleSize) {
              if (particles[i].counter === 0) {
                particles[i].direction.rotate(Math.random());
                particles[i].counter = maxCounter;
              }
              if (particles[j].counter === 0) {
                particles[j].direction.rotate(Math.random());
                particles[j].counter = maxCounter;
              }
              lines.push([
                particles[i].position,
                particles[j].position,
                distance,
              ]);
            }
          }
        }
      }
    };

    p.createParticle = () => {
      var particle = {};

      particle.position = p.createVector(
        Math.random() * width,
        Math.random() * height
      );

      particle.direction = p.createVector(
        (Math.random() - 0.5) * 2 * speedFactor,
        (Math.random() - 0.5) * 2 * speedFactor
      );

      particle.update = function () {
        this.position.add(this.direction);
        if (this.position.x > width || this.position.x < 0) {
          //this.position.x = Math.random() * width;
          this.direction.rotate(Math.random());
        }
        if (this.position.y > height || this.position.y < 0) {
          //this.position.y = Math.random() * height;
          this.direction.rotate(Math.random());
        }
        if (this.counter > 0) {
          this.counter -= 1;
        }
      };

      particle.counter = 0;

      return particle;
    };

    p.setup = () => {
      // use parent to render the canvas in this ref
      // (without that p5 will render the canvas outside of your component)
      p.createCanvas(width, height * 0.9);
      p.stroke("#a8dadc70");
      p.fill("#a8dadc70");

      for (var i = 0; i < nParticles; i++) {
        particles.push(p.createParticle());
      }
    };

    p.draw = () => {
      p.background("#0a131f");

      p.checkCollision();
      for (var i = 0; i < nParticles; i++) {
        particles[i].update();
        p.ellipse(particles[i].position.x, particles[i].position.y, 5);
      }

      for (var i = 0; i < lines.length; i++) {
        var color = p.map(lines[i][2], 0, particleSize, 0, 255);
        p.stroke("#aaaaaa20");
        p.line(lines[i][0].x, lines[i][0].y, lines[i][1].x, lines[i][1].y);
      }
    };
  };

  useEffect(() => {
    const newp5 = new p5(Sketch, processingRef.current);
  }, []);

  return <div ref={processingRef} id="background-container" />;
};

export default AnimatedBackground;
