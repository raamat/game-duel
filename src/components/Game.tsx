import React, { useState, useEffect, useRef } from 'react';
import Canvas from './Canvas';
import Hero from './Hero';
import Spell from './Spell';
import SettingsMenu from './SettingsMenu';
import Scoreboard from './Scoreboard';

interface HeroProps {
  x: number;
  y: number;
  color: string;
  direction: number; // 1 - вверх, -1 - вниз
}

const Game: React.FC = () => {
  const [hero1, setHero1] = useState<HeroProps>({ x: 100, y: 300, color: 'blue', direction: 1 });
  const [hero2, setHero2] = useState<HeroProps>({ x: 700, y: 300, color: 'red', direction: -1 });
  const [spells, setSpells] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [hero1SpellColor, setHero1SpellColor] = useState('blue');
  const [hero2SpellColor, setHero2SpellColor] = useState('red');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Рисуем героев
    ctx.fillStyle = hero1.color;
    ctx.beginPath();
    ctx.arc(hero1.x, hero1.y, 20, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hero2.color;
    ctx.beginPath();
    ctx.arc(hero2.x, hero2.y, 20, 0, Math.PI * 2);
    ctx.fill();

    // Рисуем заклинания
    spells.forEach(spell => {
      ctx.fillStyle = spell.color;
      ctx.beginPath();
      ctx.arc(spell.x, spell.y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };

  const moveHeroes = () => {
    // Двигаем первого героя
    if (hero1.y + hero1.direction * 5 < 20 || hero1.y + hero1.direction * 5 > 580) {
      setHero1(prev => ({ ...prev, direction: -prev.direction }));
    }
    setHero1(prev => ({ ...prev, y: prev.y + prev.direction * 5 }));

    // Двигаем второго героя
    if (hero2.y + hero2.direction * 5 < 20 || hero2.y + hero2.direction * 5 > 580) {
      setHero2(prev => ({ ...prev, direction: -prev.direction }));
    }
    setHero2(prev => ({ ...prev, y: prev.y + prev.direction * 5 }));
  };

  const shootSpell = (hero: HeroProps) => {
    const newSpell = {
      x: hero.x,
      y: hero.y,
      color: hero.color,
      direction: hero === hero1 ? 1 : -1,
    };
    setSpells(prev => [...prev, newSpell]);
  };

  const updateSpells = () => {
    setSpells(prev => {
      return prev
        .map(spell => ({
          ...spell,
          x: spell.x + spell.direction * 5, // Движение заклинания
        }))
        .filter(spell => spell.x < 800 && spell.x > 0); // Удаляем заклинания за пределами экрана
    });
  };

  const checkCollisions = () => {
    spells.forEach(spell => {
      const distanceToHero1 = Math.sqrt((spell.x - hero1.x) ** 2 + (spell.y - hero1.y) ** 2);
      const distanceToHero2 = Math.sqrt((spell.x - hero2.x) ** 2 + (spell.y - hero2.y) ** 2);

      if (distanceToHero1 < 25) {
        setScore(prev => prev + 1);
        setSpells(prev => prev.filter(s => s !== spell)); // Удаляем заклинание
      }

      if (distanceToHero2 < 25) {
        setScore(prev => prev + 1);
        setSpells(prev => prev.filter(s => s !== spell)); // Удаляем заклинание
      }
    });
  };

  const handleMouseClick = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const mouseX = event.clientX - (rect?.left || 0);
    const mouseY = event.clientY - (rect?.top || 0);

    // Проверяем, попали ли в героя
    if (Math.sqrt((mouseX - hero1.x) ** 2 + (mouseY - hero1.y) ** 2) < 25) {
      shootSpell(hero1);
    }

    if (Math.sqrt((mouseX - hero2.x) ** 2 + (mouseY - hero2.y) ** 2) < 25) {
      shootSpell(hero2);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveHeroes();
      updateSpells();
checkCollisions();
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [hero1, hero2, spells]);

  useEffect(() => {
    // Постоянная стрельба
    const shootInterval = setInterval(() => {
      shootSpell(hero1);
      shootSpell(hero2);
    }, 1000); // Каждую секунду

    return () => clearInterval(shootInterval);
  }, [hero1, hero2]);

  return (
    <div>
      <Canvas draw={draw} onClick={handleMouseClick} />
      <Scoreboard score={score} />
      <SettingsMenu onColorChange={setHero1SpellColor} />
    </div>
  );
};

export default Game;