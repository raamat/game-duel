import React from 'react';

interface ScoreboardProps {
  score: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
  return (
    <div>
      <h2>Счет: {score}</h2>
    </div>
  );
};

export default Scoreboard;
