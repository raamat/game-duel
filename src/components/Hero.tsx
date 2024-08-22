import React from 'react';

interface HeroProps {
  x: number;
  y: number;
  color: string;
}

const Hero: React.FC<HeroProps> = ({ x, y, color }) => {
  return (
    <circle cx={x} cy={y} r={20} fill={color} />
  );
};

export default Hero;