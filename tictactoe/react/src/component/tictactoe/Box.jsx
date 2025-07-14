import React from "react";

const style = {
  border: "3px solid #ffdaec",
  fontSize: "30px",
  width: "100px",
  height: "100px",
  backgroundColor: "#fff0fa",
  color: "black",

};

const Box = (props) => {
  return (
    <button style={style} onClick={() => props.onClick(props.index)}>
      {props.value}
    </button>
  );
};

export default Box;
