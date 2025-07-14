import React from "react";
import Box from "./Box";

const style = {
width: "300px",
height: "300px",
margin: "8 auto",
display: "grid",
gridTemplate: "repeat(3, 1fr) / repeat(3, 1fr)",
gap: "1px",
};

const Board = ({ value, onClick }) => {
  return (
    <div style={style}>
      {value.map((val, index) => (
        <Box
          key={index}
          onClick={() => onClick(index)}
          value={val}
        />
      ))}
    </div>
  );
};

export default Board;
