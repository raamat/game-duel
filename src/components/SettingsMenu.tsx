import React from "react";

interface SettingsMenuProps {
  onColorChange: (color: string) => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onColorChange }) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  return (
    <div>
      <h2>Настройки</h2>
      <label>
        Цвет заклинаний:
        <input type="color" onChange={handleColorChange} />
      </label>
    </div>
  );
};

export default SettingsMenu;
