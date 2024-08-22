import React from 'react';

interface SpellProps {
  x: number;
  y: number;
  color: string;
}

const Spell: React.FC<SpellProps> = ({ x, y, color }) => {
  return (
    <circle cx={x} cy={y} r={5} fill={color} />
  );
};

export default Spell;