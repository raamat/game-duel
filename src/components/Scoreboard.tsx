import React from "react";

interface ScoreboardProps {
  scoreHero1: number;
  scoreHero2: number;
}

const Scoreboard: React.FC<ScoreboardProps> = ({ scoreHero1, scoreHero2 }) => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {scoreHero1} : {scoreHero2}
      </h2>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: "#6a0dad",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center" as "center",
  },
  title: {
    color: "#ffffff",
    fontSize: "40px",
  },
};

export default Scoreboard;
