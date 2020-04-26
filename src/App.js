import React, { useState, useEffect } from "react";
import "./styles.css";

const width = Math.min(window.innerWidth, 768);
function Villian() {
  const [leftOffset, setLeftOffset] = useState();
  const [punchLeft, setPunchLeft] = useState();
  const [punchRight, setPunchRight] = useState();
  useEffect(() => {
    const intervalId = setInterval(() => {
      setLeftOffset((Math.random() * width) / 2);
    }, 800);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() > 0.5) {
        setPunchLeft(true);
      } else {
        setPunchLeft(false);
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (Math.random() > 0.5) {
        setPunchRight(true);
      } else {
        setPunchRight(false);
      }
    }, 2000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="villian"
      style={{
        transform: `translateX(${leftOffset}px)`
      }}
    >
      <div className="head">🤖</div>
      <div className="cogs">
        <div
          class="cog"
          style={{
            animation: punchLeft && "punch 1s"
          }}
        >
          <div className="cog-left">⚙</div>
        </div>

        <div style={{ width: "2rem" }} />
        <div
          class="cog"
          style={{
            animation: punchRight && "punch 1s"
          }}
        >
          <div className="cog cog-right">⚙</div>
        </div>
      </div>
    </div>
  );
}
export default function App() {
  return (
    <div className="ring">
      <Villian />
      {/* <div>👊</div> */}
      <div className="fists">
        <div className="fist-left">
          <button className="fist">🤜</button>
        </div>
        <div className="fist-right">
          <button className="fist">🤛</button>
        </div>
      </div>
    </div>
  );
}
