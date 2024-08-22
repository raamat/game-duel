import React from 'react';

interface GameOverProps {
  score: number;
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ score, onRestart }) => {
  return (
    <div>
      <h2>Игра окончена!</h2>
      <p>Ваш счет: {score}</p>
      <button onClick={onRestart}>Перезапустить игру</button>
    </div>
  );
};

export default GameOver;