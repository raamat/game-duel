import React, { useRef, useEffect } from 'react';

interface CanvasProps {
  draw: (ctx: CanvasRenderingContext2D) => void;
  onClick: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

const Canvas: React.FC<CanvasProps> = ({ draw, onClick }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (ctx) {
      draw(ctx);
    }
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: '1px solid black' }}
      onClick={onClick}
    />
  );
};

export default Canvas;

