import React, { useState, useEffect, useRef } from 'react';
import { closeApp } from '../../stores/processStore';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const directionRef = useRef(direction);

  useEffect(() => {
    directionRef.current = direction;
  }, [direction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || (e.ctrlKey && e.key === 'c')) {
        closeApp();
        return;
      }
      
      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
          if (currentDir.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (currentDir.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (currentDir.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (currentDir.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const head = prev[0];
        const currentDir = directionRef.current;
        const newHead = { x: head.x + currentDir.x, y: head.y + currentDir.y };

        // Wall collision
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
          setGameOver(true);
          return prev;
        }

        // Self collision
        if (prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        // Food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
          });
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [gameOver, food]);

  const renderGrid = () => {
    let grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      let row = '';
      for (let x = 0; x < GRID_SIZE; x++) {
        if (y === food.y && x === food.x) row += ' * ';
        else if (snake.some(seg => seg.x === x && seg.y === y)) row += ' 0 ';
        else row += ' . ';
      }
      grid.push(<div key={y}>{row}</div>);
    }
    return grid;
  };

  return (
    <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
      <div className="app-header" style={{ width: '100%', position: 'absolute', top: 0 }}>
        <span>SNAKE</span>
        <span>Score: {score}</span>
        <span>Q to Quit</span>
      </div>
      
      <div style={{ marginTop: '32px', fontFamily: 'monospace', lineHeight: 1 }}>
        {gameOver ? (
          <div style={{ color: '#FF3333', textAlign: 'center', margin: '2rem 0' }}>
            <h1>GAME OVER</h1>
            <p>Score: {score}</p>
            <p>Press Q to exit.</p>
          </div>
        ) : (
          renderGrid()
        )}
      </div>
    </div>
  );
}
