import React, { useState, useEffect, useRef } from "react";
import Scoreboard from "./Scoreboard";
import HeroSettings from "./HeroSettings";
import Modal from "./Modal";

interface Canvas {
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
};

const Game: React.FC = () => {
  const [spells, setSpells] = useState<any[]>([]);
  const [scoreHero1, setScoreHero1] = useState(0);
  const [scoreHero2, setScoreHero2] = useState(0);
  const [hero1SpellColor, setHero1SpellColor] = useState("#0000ff");
  const [hero2SpellColor, setHero2SpellColor] = useState("#ff0000");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModelNumber, setIsModelNumber] = useState(true);

  const canvas: Canvas = {
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
    ctx.fillStyle = hero1.heroColor;
    ctx.beginPath();
    ctx.arc(hero1.x, hero1.y, hero1.heroRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = hero2.heroColor;
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
        5,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (ctx) {
      draw(ctx);
    }
  }, [draw]);

  const moveHeroes = () => {
    // Двигаем первого героя
    if (
      hero1.y + hero1.direction * 5 < hero1.heroRadius ||
      hero1.y + hero1.direction * 5 > canvas.height - hero1.heroRadius
    ) {
      hero1.direction = -hero1.direction;
    }
    hero1.y = hero1.y + hero1.direction * hero1.speedHero;

    // Двигаем второго героя
    if (
      hero2.y + hero2.direction * 5 < hero2.heroRadius ||
      hero2.y + hero2.direction * 5 > canvas.height - hero2.heroRadius
    ) {
      hero2.direction = -hero2.direction;
    }
    hero2.y = hero2.y + hero2.direction * hero2.speedHero;
  };

  // Настроки заклинания
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
        .filter((spell) => spell.x < 800 && spell.x > 0); // Удаляем заклинания за пределами экрана
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
        setScoreHero2((prev) => prev + 1);
        setSpells((prev) => prev.filter((s) => s !== spell)); // Удаляем заклинание
      }

      if (distanceToHero2 < hero2.heroRadius && spell.heroIndex === 1) {
        spell.used = true;
        setScoreHero1((prev) => prev + 1);
        setSpells((prev) => prev.filter((s) => s !== spell)); // Удаляем заклинание
      }
    });
  };

  const handleMouseClick = (event: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    const mouseX = event.clientX - (rect?.left || 0);
    const mouseY = event.clientY - (rect?.top || 0);
    console.log("Hello")

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
    const shootInterval1 = setInterval(() => {
      shootSpell(hero1);
    }, hero1.rateOfFire);

    const shootInterval2 = setInterval(() => {
      shootSpell(hero2);
    }, hero2.rateOfFire);

    // Очистка интервала при размонтировании компонента
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

  // Обработчик клика по герою
  const handleClickOnHero = (event: MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Проверяем, попадает ли клик в область героя
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
      ctx.clearRect(0, 0, 20, 0); // Очищаем канвас
      draw(ctx); // Рисуем героя
    }

    // Добавляем обработчик клика на канвас
    canvas?.addEventListener("click", handleClickOnHero);

    // Убираем обработчик при размонтировании компонента
    return () => {
      canvas?.removeEventListener("click", handleClickOnHero);
    };
  }, [hero1.spellsColor]); // Перерисовываем при изменении цвета

  return (
    <>
      <Scoreboard scoreHero1={scoreHero1} scoreHero2={scoreHero2} />
      <canvas
        ref={canvasRef}
        width={canvas.width}
        height={canvas.height}
        style={styles.canvas}
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
