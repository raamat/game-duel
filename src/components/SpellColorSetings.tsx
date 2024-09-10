import React from "react";

interface SpellColorSettingsProps {
  onColorChange: (color: string) => void;
  heroIndex: number;
  currentColor: string;
}

const SpellColorSettings: React.FC<SpellColorSettingsProps> = ({
  heroIndex,
  onColorChange,
  currentColor,
}) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onColorChange(e.target.value);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Герой {heroIndex}</h2>
      <label style={styles.label}>
        Цвет заклинаний:
        <input
          type="color"
          onChange={handleColorChange}
          style={styles.colorInput}
          value={currentColor}
        />
      </label>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "40px 0",
    backgroundColor: "#e6d8ff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "1.5em",
    color: "#4b0082",
  },
  label: {
    display: "flex",
    alignItems: "center",
    fontSize: "1.2em",
    color: "#4b0082",
  },
  colorInput: {
    marginLeft: "12px",
    border: "none",
    width: "40px",
    height: "40px",
    cursor: "pointer",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
  },
};

export default SpellColorSettings;

