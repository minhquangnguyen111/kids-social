import React, { useState, useEffect } from "react";
import GamePieces from "./GamePieces";
import "./snakegame.css";
const GameState = () => {
   const [score, setScore] = useState(0);
   const [highScore, setHighScore] = useState(
      parseInt(localStorage.getItem("highScore")) || 0
   );
   const [gameOver, setGameOver] = useState(false);
   const [collisionType, setCollisionType] = useState(null);

   const handleGameOver = (type) => {
      setGameOver(true);

      if (score > highScore) {
         setHighScore(score);
         localStorage.setItem("highScore", score.toString());
      }

      setCollisionType(type);
   };

   const handleResetGame = () => {
      setScore(0);
      setGameOver(false);
   };

   useEffect(() => {
      const handleKeyPress = (e) => {
         if (gameOver && e.key === "Enter") {
            handleResetGame();
         }
      };

      window.addEventListener("keydown", handleKeyPress);

   }, [gameOver]);

   return (
      <div className="game-container ">
         <span className="flex justify-center items-center p-5 text-3xl text-purple-500">TRÒ CHƠI RẮN SĂN MỒI</span>
         <div className="text-lg py-3">Nhấn phím mũi tên để di chuyển!</div>
         

         {gameOver && (
            <div className="game-over">
               <p>---GAME OVER--- {collisionType === "wall" ? "Đụng phải tường rồi!" : "Bạn đã tự ăn mình rồi!"}!</p>
               <p>Nhấn 'Enter' để chơi lại.</p>
            </div>
         )}
         {!gameOver && (
            <GamePieces
               score={score}
               setScore={setScore}
               onGameOver={(type) => handleGameOver(type)}
            />
         )}
         <p className="score">Điểm của bạn: {score}</p>
         <p className="high-score">Điểm cao nhất: {highScore}</p>
      </div>
   );
};

export default GameState;