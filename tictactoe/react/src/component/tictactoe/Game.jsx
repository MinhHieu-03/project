import React, { useState, useEffect } from "react";
import Board from "./Board";

const winPattern = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const isMon = (board) => {
  for (let [a, b, c] of winPattern) {
    if (board[a] && board[a] === board[b] && board[b] === board[c]) {
      return true;
    }
  }
  return false;
};

const isDraw = (board) => board.every((cell) => cell !== "");

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(""));
  const [isGameStopped, setGameStop] = useState(false);
  const [message, setMessage] = useState("");
  const [isHumanTurn, setIsHumanTurn] = useState(true);

  const player = {
    human: "X",
    computer: "O",
  };

  const handleClick = (pos) => {
    if (isGameStopped || !isHumanTurn || board[pos]) return;

    const boardCopy = [...board];
    boardCopy[pos] = player.human;
    setBoard(boardCopy);
    setIsHumanTurn(false); // kết thúc lượt người
  };

  useEffect(() => {
    if (isMon(board)) {
      const winner = isHumanTurn ? "Máy" : "Bạn"; // người vừa đánh thắng
      setMessage(`${winner} thắng!`);
      setGameStop(true);
      return;
    }

    if (isDraw(board)) {
      setMessage("Hòa!");
      setGameStop(true);
      return;
    }

    if (!isHumanTurn) {
      const timeout = setTimeout(() => {
        const move = determineComputerMove(board, player);
        if (move !== -1) {
          const boardCopy = [...board];
          boardCopy[move] = player.computer;
          setBoard(boardCopy);
          setIsHumanTurn(true);
        }
      }, 500);

      return () => clearTimeout(timeout);
    }
  }, [board, isHumanTurn]);

  const handleReset = () => {
    setBoard(Array(9).fill(""));
    setGameStop(false);
    setMessage("Tic Tac Toe");
    setIsHumanTurn(true);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh", // Chiếm toàn bộ chiều cao màn hình
        backgroundColor: "#ffdec3", // màu nền nhẹ
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Tic Tac Toe</h1>

      <Board value={board} onClick={handleClick} />

      {isGameStopped && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <h1 style={{ marginBottom: "10px" }}>{message}</h1>
          <button onClick={handleReset}>Chơi lại</button>
        </div>
      )}
    </div>
  );
};

export default Game;

function determineComputerMove(board, player) {
  // 1. Kiểm tra nếu máy có thể thắng
  for (let pattern of winPattern) {
    const [a, b, c] = pattern;
    const line = [board[a], board[b], board[c]];
    const counts = line.filter((cell) => cell === player.computer).length;
    const empties = line.filter((cell) => !cell).length;

    if (counts === 2 && empties === 1) {
      const index = [a, b, c].find((i) => board[i] === "");
      return index;
    }
  }

  // 2. Kiểm tra nếu người sắp thắng → chặn
  for (let pattern of winPattern) {
    const [a, b, c] = pattern;
    const line = [board[a], board[b], board[c]];
    const counts = line.filter((cell) => cell === player.human).length;
    const empties = line.filter((cell) => !cell).length;

    if (counts === 2 && empties === 1) {
      const index = [a, b, c].find((i) => board[i] === "");
      return index;
    }
  }

  // 3. Không có ai sắp thắng → chọn ô random
  const emptyCells = board
    .map((val, idx) => (!val ? idx : null))
    .filter((val) => val !== null);

  if (emptyCells.length === 0) return -1;

  const randomIndex = Math.floor(Math.random() * emptyCells.length);
  return emptyCells[randomIndex];
}
