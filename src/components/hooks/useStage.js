import { useState, useEffect } from "react";
import { createStage } from "../../gameHelpers";

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [rowsCleared, setRowsCleared] = useState(0);

  useEffect(() => {
    setRowsCleared(0);

    const sweepRows = (newStage) => {
      return newStage.reduce((acc, row) => {
        // if all the cells are not empty
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setRowsCleared((prev) => prev + 1);
          // New Array is generated
          acc.unshift(new Array(newStage[0].length).fill([0, "clear"]));
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);
    };

    const updateStage = (prevStage) => {
      // First flush the stage
      const newStage = prevStage.map((row) => {
        return row.map((cell) => {
          return cell[1] === "clear" ? [0, "clear"] : cell;
        });
      });

      // Then draw the tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            newStage[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? "merged" : "clear"}`,
            ];
          }
        });
      });

      // Then check if we collided
      if (player.collided) {
        resetPlayer(); // new tetromino
        return sweepRows(newStage); // sweep the full rows
      }

      return newStage;
    };

    setStage((prev) => updateStage(prev));
  }, [player, resetPlayer]);

  return [stage, setStage, rowsCleared];
};
