import React, { useState, useEffect } from "react";

// Определяем тип для героя
interface HeroSettings {
  name: string;
  shooting: number;
  speed: number;
}

interface HeroSettingsProps {
  onUpdate: (heroes: HeroSettings[]) => void;
}

const HeroSettings: React.FC<HeroSettingsProps> = ({ onUpdate }) => {
  // Состояние для хранения настроек героев
  const [heroes, setHeroes] = useState<HeroSettings[]>([
    { name: "Герой 1", shooting: 5, speed: 10 },
    { name: "Герой 2", shooting: 7, speed: 12 },
  ]);

  // Эффект для вызова onUpdate при первом рендере и при изменении heroes
  useEffect(() => {
    onUpdate(heroes); // Передаем состояние героев в родительский компонент
  }, [heroes]);

  // Функция для обновления настроек
  const updateSetting = (
    index: number,
    type: "shooting" | "speed",
    value: number
  ) => {
    const newHeroes = [...heroes];
    newHeroes[index][type] = value;
    setHeroes(newHeroes);
    onUpdate(heroes);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Настройки героев</h1>
      <div style={styles.heroContainer}>
        {heroes.map((hero, index) => (
          <div key={index} style={styles.heroPanel}>
            <h2 style={styles.heroName}>{hero.name}</h2>
            <label style={styles.label}>
              Частота стрельбы:
              <input
                type="range"
                min="1"
                max="10"
                value={hero.shooting}
                onChange={(e) =>
                  updateSetting(index, "shooting", parseInt(e.target.value))
                }
                style={styles.slider}
              />
              {hero.shooting}
            </label>
            <br />
            <label style={styles.label}>
              Скорость передвижения:
              <input
                type="range"
                min="1"
                max="20"
                value={hero.speed}
                onChange={(e) =>
                  updateSetting(index, "speed", parseInt(e.target.value))
                }
                style={styles.slider}
              />
              {hero.speed}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

// Стили для компонента
const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#f3f0ff",
    borderRadius: "8px",
  },
  title: {
    color: "#6a0dad",
    textAlign: "center" as "center",
  },
  heroContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginTop: "20px",
  },
  heroPanel: {
    backgroundColor: "#e6d8ff",
    borderRadius: "8px",
    padding: "20px",
    width: "30%",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  heroName: {
    color: "#4b0082",
    marginBottom: "10px",
  },
  label: {
    display: "block",
    margin: "10px 0",
    color: "#4b0082",
  },
  slider: {
    marginLeft: "10px",
    marginRight: "10px",
  },
};

export default HeroSettings;
