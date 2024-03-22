// 'use client'
import { useState, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';

export default function Logbook() {
  // const [isBrowser, setIsBrowser] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const [stageHeight, setStageHeight] = useState(0);
  const [lines, setLines] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    // setIsBrowser(true);

    const handleResize = () => {
      setStageWidth(window.innerWidth * 0.9525);
      setStageHeight(window.innerHeight * 0.75);
    };

    if (typeof window !== 'undefined') {
      setStageWidth(window.innerWidth * 0.9525);
      setStageHeight(window.innerHeight * 0.75);
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.evt;
    setLines([...lines, { points: [offsetX, offsetY] }]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = e.evt;
    const updatedLines = lines;
    const lastLine = updatedLines[updatedLines.length - 1];
    lastLine.points = lastLine.points.concat([offsetX, offsetY]);
    setLines([...updatedLines]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // if (!isBrowser) {
  //   return null; // Render nothing on the server
  // }

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      onMouseDown={handleMouseDown}
      onMousemove={handleMouseMove}
      onMouseup={handleMouseUp}
    >
      <Layer>
        {lines.map((line, i) => (
          <Line
            key={i}
            points={line.points}
            stroke="#fff"
            strokeWidth={2}
            tension={0.25}
            lineCap="round"
            globalCompositeOperation="source-over"
          />
        ))}
      </Layer>
    </Stage>
  );
}