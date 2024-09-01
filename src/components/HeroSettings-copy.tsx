import React, { useState } from 'react';

// Определяем тип для героя
interface Hero {
  name: string;
  shooting: number;
  speed: number;
}

const HeroSettings: React.FC = () => {
  // Состояние для хранения настроек героев
  const [heroes, setHeroes] = useState<Hero[]>([
    { name: 'Герой 1', shooting: 5, speed: 10 },
    { name: 'Герой 2', shooting: 7, speed: 12 },
    { name: 'Герой 3', shooting: 4, speed: 8 },
  ]);

  // Функция для обновления настроек
  const updateSetting = (index: number, type: 'shooting' | 'speed', value: number) => {
    const newHeroes = [...heroes];
    newHeroes[index][type] = value;
    setHeroes(newHeroes);
  };

  return (
    <div>
      <h1>Настройки героев</h1>
      {heroes.map((hero, index) => (
        <div key={index} style={{ margin: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <h2>{hero.name}</h2>
          <label>
            Частота стрельбы:
            <input
              type="range"
              min="1"
              max="10"
              value={hero.shooting}
              onChange={(e) => updateSetting(index, 'shooting', parseInt(e.target.value))}
            />
            {hero.shooting}
          </label>
          <br />
          <label>
            Скорость передвижения:
            <input
              type="range"
              min="1"
              max="20"
              value={hero.speed}
              onChange={(e) => updateSetting(index, 'speed', parseInt(e.target.value))}
            />
            {hero.speed}
          </label>
        </div>
      ))}
    </div>
  );
};

export default HeroSettings;


