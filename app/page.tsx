'use client';

import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);
  const noButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (noButtonRef.current) {
        const button = noButtonRef.current;
        const rect = button.getBoundingClientRect();
        // getBoundingClientRect already includes the transform, so we get the actual position
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
        );
        
        // If cursor is within 120px of button center, move it away
        if (distance < 120 && distance > 0) {
          // Calculate angle from button to cursor
          const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX);
          // Move in opposite direction (add 180 degrees / π radians)
          const moveDistance = 150 - distance; // Move more when cursor is closer
          const newX = Math.cos(angle + Math.PI) * moveDistance;
          const newY = Math.sin(angle + Math.PI) * moveDistance;
          
          setNoButtonPosition(prev => {
            // Smoothly move away from cursor
            const maxMove = 300;
            const nextX = Math.max(-maxMove, Math.min(maxMove, prev.x + newX * 0.2));
            const nextY = Math.max(-maxMove, Math.min(maxMove, prev.y + newY * 0.2));
            return { x: nextX, y: nextY };
          });
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNoClick = () => {
    const maxX = 200;
    const maxY = 200;
    const randomX = Math.floor(Math.random() * maxX * 2) - maxX;
    const randomY = Math.floor(Math.random() * maxY * 2) - maxY;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    setYesClicked(true);
  };

  if (yesClicked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full mx-4 text-center">
          <div className="text-6xl mb-4">💕</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Yay! 💖</h1>
          <p className="text-xl text-gray-600">You made my day! Happy Valentine's Day! 🎉</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-pink-50 p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-4xl w-full text-center relative">
        {/* Character */}
        <div className="relative mb-6 flex flex-col items-center">
          {/* Heart */}
          <div className="text-4xl mb-2">💖</div>
          
          {/* Cute character */}
          <div className="relative">
            <div className="w-20 h-20 bg-amber-200 rounded-full relative mx-auto">
              {/* Ears */}
              <div className="absolute -top-2 left-2 w-5 h-5 bg-amber-300 rounded-full transform rotate-45"></div>
              <div className="absolute -top-2 right-2 w-5 h-5 bg-amber-300 rounded-full transform -rotate-45"></div>
              {/* Eyes */}
              <div className="absolute top-7 left-5 w-2 h-2 bg-black rounded-full"></div>
              <div className="absolute top-7 right-5 w-2 h-2 bg-black rounded-full"></div>
              {/* Nose */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-2.5 h-2.5 bg-pink-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <h1 className="text-2xl font-semibold text-gray-800 mb-8">
          kochanie will you be my valentine?
        </h1>

        {/* Buttons */}
        <div className="flex gap-4 justify-center items-center mb-4">
          <button
            onClick={handleYesClick}
            className="px-8 py-3 bg-pink-500 text-white rounded-full font-semibold text-lg hover:bg-pink-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Yes
          </button>
          <button
            ref={noButtonRef}
            onClick={handleNoClick}
            className="px-8 py-3 bg-gray-300 text-gray-700 rounded-full font-semibold text-lg hover:bg-gray-400 transition-all duration-200 shadow-md relative"
            style={{
              transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
            }}
          >
            No
          </button>
        </div>

        {/* Playful message */}
        <p className="text-sm text-gray-500 mt-4">
          "No" seems a bit shy 😈
        </p>
      </div>
    </div>
  );
}
