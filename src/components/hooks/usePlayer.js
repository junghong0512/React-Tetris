import { useState, useCallback } from "react";

import { TETROMINOS, randomTetromino } from "../../tetrominos";
import { STAGE_WIDTH, checkCollision } from "../../gameHelpers";

export const usePlayer = () => {
  // Initial set of player
  const [player, setPlayer] = useState({
    pos: { x: 0, y: 0 },
    tetromino: TETROMINOS[0].shape,
    collided: false,
  });

  const rotate = (matrix, direction) => {
    // Make the rows to colums(transpose)
    const rotatedTetro = matrix.map((_, index) => {
      return matrix.map((column) => {
        return column[index];
      });
    });
    // Reverse each row to get a rotated matrix (Turn clockwise)
    if (direction > 0) {
      return rotatedTetro.map((row) => row.reverse());
    }
    return rotatedTetro.reverse();
  };

  // Checking collision
  const playerRotate = (stage, direction) => {
    // Copy the player completly
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, direction);

    const pos = clonedPlayer.pos.x;
    let offset = 1;
    while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;
      offset = offset + (offset > 0 ? -1 : 1);
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -direction);
        clonedPlayer.pos.x = pos;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({ x, y, collided }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback(() => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 }, // Set the position at the center top
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate];
};
