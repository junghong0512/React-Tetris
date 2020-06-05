import React from "react";

import Cell from "./Cell";

const Stage = ({ stage }) => {
  console.log(stage);
  return (
    <div>
      {stage.map((row) => {
        return row.map((cell, x) => {
          return <Cell key={x} type={cell[0]} />;
        });
      })}
    </div>
  );
};

export default Stage;
