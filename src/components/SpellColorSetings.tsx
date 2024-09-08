import React from "react";

interface SpellColorSettingsProps {
  onColorChange: (color: string) => void;
  heroIndex: number;
}

const SpellColorSettings: React.FC<SpellColorSettingsProps> = ({
  heroIndex,
  onColorChange,
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  return (
    <div>
      <h2>Герой {heroIndex}</h2>
      <label>
        Цвет заклинаний:
        <input type="color" onChange={handleColorChange} />
      </label>
    </div>
  );
};

export default SpellColorSettings;
