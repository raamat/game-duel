import React, { useState, useEffect, useRef } from "react";
import Scoreboard from "./Scoreboard";
import HeroSettings from "./HeroSettings";
import Modal from "./Modal";

interface CanvasSize {
  width: number;
  height: number;
}

interface HeroSettingsForHandle {
  name: string;
  shooting: number;
  speed: number;
}

interface HeroProps {
  heroIndex: number;
  x: number;
  y: number;
  heroColor: string;
  spellsColor: string;
  rateOfFire: number;
  direction: number;
  speedHero: number;
  heroRadius: number;
  spellsRadius: number;
}

const hero1: HeroProps = {
  heroIndex: 1,
  x: 100,
  y: 300,
  heroColor: "blue",
  spellsColor: "blue",
  rateOfFire: 0,
  direction: 1, // 1 - вверх, -1 - вниз
  speedHero: 0,
  heroRadius: 30,
  spellsRadius: 5,
};

const hero2: HeroProps = {
  heroIndex: 2,
  x: 700,
  y: 300,
  heroColor: "red",
  spellsColor: "red",
  rateOfFire: 0,
  direction: -1, // 1 - вверх, -1 - вниз
  speedHero: 0,
  heroRadius: 30,
  spellsRadius: 5,
};

const Game: React.FC = () => {
  const [spells, setSpells] = useState<any[]>([]);
  const [scoreHero1, setScoreHero1] = useState(0);
  const [scoreHero2, setScoreHero2] = useState(0);
  const [hero1SpellColor, setHero1SpellColor] = useState("#0000ff");
  const [hero2SpellColor, setHero2SpellColor] = useState("#ff0000");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModelNumber, setIsModelNumber] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hero1Color, setHero1Color] = useState(hero1.heroColor);
  const [hero2Color, setHero2Color] = useState(hero2.heroColor);

  const canvasSize: CanvasSize = {
    width: 800,
    height: 600,
  };

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Рисуем героев
    ctx.fillStyle = hero1Color;
    ctx.beginPath();
    ctx.arc(hero1.x, hero1.y, hero1.heroRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hero2Color;
    ctx.beginPath();
    ctx.arc(hero2.x, hero2.y, hero2.heroRadius, 0, Math.PI * 2);
    ctx.fill();

    // Рисуем заклинания
    spells.forEach((spell) => {
      ctx.fillStyle = spell.color;
      ctx.beginPath();
      ctx.arc(
        spell.x -
          (spell.heroIndex === 1 ? -hero1.heroRadius : hero2.heroRadius),
        spell.y,
        (spell.heroIndex === 1 ? hero1.spellsRadius : hero2.spellsRadius),
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  };

  const moveHeroes = () => {
    if (
      hero1.y + hero1.direction * hero1.spellsRadius < hero1.heroRadius ||
      hero1.y + hero1.direction * hero1.spellsRadius > canvasSize.height - hero1.heroRadius
    ) {
      hero1.direction = -hero1.direction;
    }
    hero1.y = hero1.y + hero1.direction * hero1.speedHero;

    if (
      hero2.y + hero2.direction * hero2.spellsRadius < hero2.heroRadius ||
      hero2.y + hero2.direction * hero2.spellsRadius > canvasSize.height - hero2.heroRadius
    ) {
      hero2.direction = -hero2.direction;
    }
    hero2.y = hero2.y + hero2.direction * hero2.speedHero;
  };

  const shootSpell = (hero: HeroProps) => {
    const newSpell = {
      heroIndex: hero.heroIndex,
      x: hero.x,
      y: hero.y,
      color: hero.spellsColor,
      direction: hero === hero1 ? 1 : -1,
    };
    setSpells((prev) => [...prev, newSpell]);
  };

  const updateSpells = () => {
    setSpells((prev) => {
      return prev
        .map((spell) => ({
          ...spell,
          x: spell.x + spell.direction * 5, // Движение заклинания
          color: spell.heroIndex === 1 ? hero1SpellColor : hero2SpellColor,
        }))
        .filter((spell) => !spell.used)
        .filter((spell) => spell.x < canvasSize.width && spell.x > 0); // Удаляем заклинания за пределами экрана
    });
  };

  const checkCollisions = () => {
    spells.forEach((spell) => {
      if (spell.used) return; // Проверяем, было ли заклинание уже использовано
      const distanceToHero1 = Math.sqrt(
        (spell.x - hero1.x) ** 2 + (spell.y - hero1.y) ** 2
      );
      const distanceToHero2 = Math.sqrt(
        (spell.x - hero2.x) ** 2 + (spell.y - hero2.y) ** 2
      );

      if (distanceToHero1 < hero1.heroRadius && spell.heroIndex === 2) {
        spell.used = true;
        setHero1Color("#00ff00");
        setScoreHero2((prev) => prev + 1);
        setSpells((prev) => prev.filter((s) => s !== spell)); // Удаляем заклинание
      }

      if (distanceToHero2 < hero2.heroRadius && spell.heroIndex === 1) {
        spell.used = true;
        setHero2Color("#00ff00");
        setScoreHero1((prev) => prev + 1);
        setSpells((prev) => prev.filter((s) => s !== spell)); // Удаляем заклинание
      }
    });
  };

  useEffect(() => {
    if (hero1Color !== hero1.heroColor) {
      const timer = setTimeout(() => {
        setHero1Color(hero1.heroColor);
      }, 500);
      return () => clearTimeout(timer); 
    }
  }, [hero1Color]);

  useEffect(() => {
    if (hero2Color !== hero2.heroColor) {
      const timer = setTimeout(() => {
        setHero2Color(hero2.heroColor);
      }, 500);
      return () => clearTimeout(timer); 
    }
  }, [hero2Color]);

  const handleMouseMove = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const mouseX = event.clientX - (rect?.left ?? 0);
    const mouseY = event.clientY - (rect?.top ?? 0);
    setMousePosition({ x: mouseX, y: mouseY });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const distanceToHero1 = Math.sqrt(
        (mousePosition.x - hero1.x) ** 2 + (mousePosition.y - hero1.y) ** 2
      );
      const distanceToHero2 = Math.sqrt(
        (mousePosition.x - hero2.x) ** 2 + (mousePosition.y - hero2.y) ** 2
      );

      if (distanceToHero1 < hero1.heroRadius) {
        hero1.direction = -hero1.direction;
      }

      if (distanceToHero2 < hero2.heroRadius) {
        hero2.direction = -hero2.direction;
      }
    }, 100);

    return () => clearInterval(interval);
  }, [mousePosition]);

  useEffect(() => {
    const interval = setInterval(() => {
      moveHeroes();
      updateSpells();
      checkCollisions();
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [hero1, hero2, spells]);

  useEffect(() => {
    const shootInterval1 = setInterval(() => {
      shootSpell(hero1);
    }, hero1.rateOfFire);

    const shootInterval2 = setInterval(() => {
      shootSpell(hero2);
    }, hero2.rateOfFire);

    return () => {
      clearInterval(shootInterval1);
      clearInterval(shootInterval2);
    };
  }, [hero1.rateOfFire, hero2.rateOfFire]);

  // Частота стрельбы и скорость передвижения
  const handleUpdateHeroes = (updatedHeroes: HeroSettingsForHandle[]) => {
    hero1.rateOfFire = 2000 - updatedHeroes[0].shooting * 180;
    hero2.rateOfFire = 2000 - updatedHeroes[1].shooting * 180;
    hero1.speedHero = updatedHeroes[0].speed;
    hero2.speedHero = updatedHeroes[1].speed;
  };

  const handleClickOnHero = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (
        x >= hero1.x &&
        x <= hero1.x + hero1.heroRadius &&
        y >= hero1.y &&
        y <= hero1.y + hero1.heroRadius
      ) {
        setIsModelNumber(true);
        toggleModal();
      } else if (
        x >= hero2.x &&
        x <= hero2.x + hero2.heroRadius &&
        y >= hero2.y &&
        y <= hero2.y + hero2.heroRadius
      ) {
        setIsModelNumber(false);
        toggleModal();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      draw(ctx);
    }

    canvas?.addEventListener("click", handleClickOnHero);

    return () => {
      canvas?.removeEventListener("click", handleClickOnHero);
    };

  }, [hero1.spellsColor, hero2.spellsColor, spells]); // Перерисовываем при изменении цвета

  return (
    <>
      <Scoreboard scoreHero1={scoreHero1} scoreHero2={scoreHero2} />
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={styles.canvas}
        onMouseMove={handleMouseMove}
      />
      <Modal
        isModalOpen={isModalOpen}
        onModalToggle={toggleModal}
        setHeroSpellColor={
          isModelNumber ? setHero1SpellColor : setHero2SpellColor
        }
        heroIndex={isModelNumber ? 1 : 2}
        currentColor={isModelNumber ? hero1SpellColor : hero2SpellColor}
      />
      <HeroSettings onUpdate={handleUpdateHeroes} />
    </>
  );
};

const styles = {
  canvas: {
    display: "block",
    margin: "20px auto",
    border: "3px solid #6a0dad",
    backgroundColor: "#ffffff",
  },
};

export default Game;
