'use client';

import { useState, useRef, useEffect } from 'react';

interface Heart {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
}

interface Confetti {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  particles: Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    life: number;
  }>;
}

export default function Home() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [yesClicked, setYesClicked] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [celebrationStage, setCelebrationStage] = useState(0);
  const [burstHearts, setBurstHearts] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number; size: number }>>([]);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  // Floating hearts animation
  useEffect(() => {
    if (yesClicked) return;
    
    const heartEmojis = ['💖', '💕', '💗', '💓', '💝', '💘', '💞'];
    const newHearts: Heart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 20 + 15,
      speed: Math.random() * 0.5 + 0.3,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setHearts(newHearts);

    const interval = setInterval(() => {
      setHearts(prev => prev.map(heart => ({
        ...heart,
        y: heart.y - heart.speed,
        x: heart.x + Math.sin(heart.y * 0.01) * 0.5,
        opacity: heart.opacity + (Math.random() - 0.5) * 0.1,
      })).filter(heart => heart.y > -10).concat(
        Array.from({ length: 2 }, (_, i) => ({
          id: Date.now() + i,
          x: Math.random() * 100,
          y: 110,
          size: Math.random() * 20 + 15,
          speed: Math.random() * 0.5 + 0.3,
          opacity: Math.random() * 0.5 + 0.3,
        }))
      ));
    }, 50);

    return () => clearInterval(interval);
  }, [yesClicked]);

  // Mouse tracking for "No" button
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (noButtonRef.current && !yesClicked) {
        const button = noButtonRef.current;
        const rect = button.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;
        
        const distance = Math.sqrt(
          Math.pow(e.clientX - buttonCenterX, 2) + Math.pow(e.clientY - buttonCenterY, 2)
        );
        
        if (distance < 120 && distance > 0) {
          const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX);
          const moveDistance = 150 - distance;
          const newX = Math.cos(angle + Math.PI) * moveDistance;
          const newY = Math.sin(angle + Math.PI) * moveDistance;
          
          setNoButtonPosition(prev => {
            const maxMove = 300;
            const nextX = Math.max(-maxMove, Math.min(maxMove, prev.x + newX * 0.2));
            const nextY = Math.max(-maxMove, Math.min(maxMove, prev.y + newY * 0.2));
            return { x: nextX, y: nextY };
          });
        }

        // Add sparkles on mouse move
        if (Math.random() > 0.95) {
          setSparkles(prev => [...prev.slice(-10), {
            id: Date.now(),
            x: e.clientX,
            y: e.clientY,
            delay: 0,
          }]);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [yesClicked]);

  const handleNoClick = () => {
    const maxX = 200;
    const maxY = 200;
    const randomX = Math.floor(Math.random() * maxX * 2) - maxX;
    const randomY = Math.floor(Math.random() * maxY * 2) - maxY;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    if (yesButtonRef.current) {
      const button = yesButtonRef.current;
      const rect = button.getBoundingClientRect();
      const buttonX = rect.left + rect.width / 2;
      const buttonY = rect.top + rect.height / 2;
      
      // Create massive confetti explosion from button position
      const colors = ['#ff6b9d', '#c44569', '#f8b500', '#ff9ff3', '#54a0ff', '#5f27cd', '#ff1744', '#e91e63', '#9c27b0'];
      const newConfetti: Confetti[] = Array.from({ length: 200 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 200;
        const speed = Math.random() * 8 + 4;
        return {
          id: i,
          x: buttonX,
          y: buttonY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        };
      });
      setConfetti(newConfetti);

      // Create heart burst from button
      const newBurstHearts = Array.from({ length: 30 }, (_, i) => {
        const angle = (Math.PI * 2 * i) / 30;
        const speed = Math.random() * 5 + 3;
        return {
          id: i,
          x: buttonX,
          y: buttonY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: Math.random() * 20 + 15,
        };
      });
      setBurstHearts(newBurstHearts);

      // Create fireworks
      const newFireworks: Firework[] = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 20 + (i * 20),
        y: 20,
        particles: Array.from({ length: 30 }, (_, j) => {
          const angle = (Math.PI * 2 * j) / 30;
          const speed = Math.random() * 3 + 2;
          return {
            x: 0,
            y: 0,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color: colors[Math.floor(Math.random() * colors.length)],
            life: 1,
          };
        }),
      }));
      setFireworks(newFireworks);

      setYesClicked(true);
      setCelebrationStage(0);

      // Stage progression
      setTimeout(() => setCelebrationStage(1), 500);
      setTimeout(() => setCelebrationStage(2), 1500);
      setTimeout(() => setCelebrationStage(3), 2500);

      // Animate confetti with rotation
      let frame = 0;
      const animateConfetti = () => {
        frame++;
        setConfetti(prev => prev.map(c => ({
          ...c,
          x: c.x + c.vx * 0.3,
          y: c.y + c.vy * 0.3,
          vy: c.vy + 0.15, // gravity
          rotation: c.rotation + c.rotationSpeed,
        })).filter(c => {
          return c.y < window.innerHeight + 100 && c.y > -100 && 
                 c.x < window.innerWidth + 100 && c.x > -100 && 
                 frame < 200;
        }));
      };

      // Animate heart burst
      const animateHearts = () => {
        setBurstHearts(prev => prev.map(h => ({
          ...h,
          x: h.x + h.vx * 0.5,
          y: h.y + h.vy * 0.5,
          vy: h.vy + 0.1,
        })).filter(h => {
          return h.y < window.innerHeight + 100 && h.y > -100 && 
                 h.x < window.innerWidth + 100 && h.x > -100 && 
                 frame < 150;
        }));
      };

      // Animate fireworks
      const animateFireworks = () => {
        setFireworks(prev => prev.map(fw => ({
          ...fw,
          particles: fw.particles.map(p => ({
            ...p,
            x: p.x + p.vx * 0.5,
            y: p.y + p.vy * 0.5,
            vy: p.vy + 0.05,
            life: p.life - 0.02,
          })).filter(p => p.life > 0),
        })).filter(fw => fw.particles.length > 0));
      };

      const interval = setInterval(() => {
        animateConfetti();
        animateHearts();
        animateFireworks();
        frame++;
        if (frame > 200) {
          clearInterval(interval);
        }
      }, 16);
    }
  };

  if (yesClicked) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-red-100 p-4 relative overflow-hidden">
        {/* Confetti particles */}
        {confetti.map(c => (
          <div
            key={c.id}
            className="absolute rounded-sm"
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              backgroundColor: c.color,
              pointerEvents: 'none',
              transform: `rotate(${c.rotation}deg)`,
              boxShadow: `0 0 ${c.size}px ${c.color}`,
            }}
          />
        ))}

        {/* Heart burst */}
        {burstHearts.map(h => (
          <div
            key={h.id}
            className="absolute pointer-events-none text-3xl"
            style={{
              left: `${h.x}px`,
              top: `${h.y}px`,
              fontSize: `${h.size}px`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {['💖', '💕', '💗', '💓', '💝', '💘', '💞'][h.id % 7]}
          </div>
        ))}

        {/* Fireworks */}
        {fireworks.map(fw => (
          <div key={fw.id} className="absolute" style={{ left: `${fw.x}%`, top: `${fw.y}%` }}>
            {fw.particles.map((p, idx) => (
              <div
                key={idx}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: '6px',
                  height: '6px',
                  backgroundColor: p.color,
                  opacity: p.life,
                  pointerEvents: 'none',
                  boxShadow: `0 0 10px ${p.color}`,
                }}
              />
            ))}
          </div>
        ))}
        
        {/* Continuous floating hearts */}
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={`float-${i}`}
            className="absolute text-4xl animate-bounce pointer-events-none"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          >
            {['💖', '💕', '💗', '💓', '💝', '💘', '💞', '🌹', '💐'][Math.floor(Math.random() * 9)]}
          </div>
        ))}

        <div className={`bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full mx-4 text-center relative z-10 transition-all duration-1000 ${
          celebrationStage >= 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          {/* Stage 0: Initial explosion */}
          {celebrationStage === 0 && (
            <div className="animate-bounce">
              <div className="text-9xl mb-6">💥</div>
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                YES!!! 🎉
              </h1>
            </div>
          )}

          {/* Stage 1: Celebration */}
          {celebrationStage === 1 && (
            <div className="animate-pulse">
              <div className="text-8xl mb-6 animate-bounce">💕</div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                You said YES! 💖
              </h1>
              <p className="text-2xl text-gray-700 font-semibold">
                This is amazing! 🎊
              </p>
            </div>
          )}

          {/* Stage 2: Love message */}
          {celebrationStage === 2 && (
            <div className="animate-pulse">
              <div className="text-8xl mb-6 animate-bounce">💖</div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-4">
                Yay! You said YES! 💖
              </h1>
              <p className="text-2xl text-gray-700 mb-6 font-semibold">
                You just made me the happiest person in the world! 🎉
              </p>
              <div className="text-6xl mb-4 animate-bounce">💐🌹💖🌹💐</div>
            </div>
          )}

          {/* Stage 3: Final message */}
          {celebrationStage >= 3 && (
            <div>
              <div className="text-8xl mb-6 animate-bounce">💕</div>
              <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mb-4 animate-pulse">
                Yay! You said YES! 💖
              </h1>
              <p className="text-2xl text-gray-700 mb-4 font-semibold">
                You just made me the happiest person in the world! 🎉
              </p>
              <div className="text-6xl mb-6 animate-bounce">💐🌹💖🌹💐</div>
              <p className="text-xl text-gray-600 italic mb-4">
                Happy Valentine's Day, kochanie! 💕✨
              </p>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 animate-pulse">
                I love you! 💖💖💖
              </p>
              <div className="mt-6 text-5xl animate-bounce">
                💕💖💕💖💕
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-pink-50 via-rose-50 to-pink-100 p-4 relative overflow-hidden"
    >
      {/* Floating hearts background */}
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="absolute pointer-events-none text-2xl"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            opacity: heart.opacity,
            transform: `rotate(${heart.x * 2}deg)`,
          }}
        >
          {['💖', '💕', '💗', '💓', '💝', '💘', '💞'][heart.id % 7]}
        </div>
      ))}

      {/* Sparkles */}
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none text-2xl animate-ping"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          ✨
        </div>
      ))}

      <div className="rounded-3xl shadow-xl p-10 max-w-4xl w-full text-center relative z-10 backdrop-blur-sm bg-white/95">
        {/* Character */}
        <div className="relative mb-6 flex flex-col items-center">
          {/* Heart with animation */}
          <div className="text-5xl mb-3 animate-pulse">💖</div>
          
          {/* Cute character with bounce */}
          <div className="relative animate-bounce" style={{ animationDuration: '2s' }}>
            <div className="w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full relative mx-auto shadow-lg">
              {/* Ears */}
              <div className="absolute -top-2 left-2 w-6 h-6 bg-amber-400 rounded-full transform rotate-45"></div>
              <div className="absolute -top-2 right-2 w-6 h-6 bg-amber-400 rounded-full transform -rotate-45"></div>
              {/* Eyes */}
              <div className="absolute top-8 left-6 w-2.5 h-2.5 bg-black rounded-full animate-blink"></div>
              <div className="absolute top-8 right-6 w-2.5 h-2.5 bg-black rounded-full animate-blink"></div>
              {/* Nose */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-pink-500 rounded-full"></div>
              {/* Blush */}
              <div className="absolute top-10 left-2 w-4 h-3 bg-pink-200 rounded-full opacity-60"></div>
              <div className="absolute top-10 right-2 w-4 h-3 bg-pink-200 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 mb-8 animate-pulse">
          kochanie will you be my valentine? 💕
        </h1>

        {/* Buttons */}
        <div className="flex gap-4 justify-center items-center mb-4 relative">
          <button
            ref={yesButtonRef}
            onClick={handleYesClick}
            className="px-10 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-bold text-xl hover:from-pink-600 hover:to-purple-600 transition-all shadow-2xl hover:shadow-pink-500/50 transform hover:scale-110 active:scale-95 animate-pulse"
          >
            Yes! 💖
          </button>
          <button
            ref={noButtonRef}
            onClick={handleNoClick}
            className="px-10 py-4 bg-gray-300 text-gray-700 rounded-full font-bold text-xl hover:bg-gray-400 transition-all duration-200 shadow-lg relative"
            style={{
              transform: `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)`,
            }}
          >
            No
          </button>
        </div>

        {/* Playful messages */}
        <div className="space-y-2">
          <p className="text-base text-gray-600 font-semibold">
            "No" seems a bit shy 😈
          </p>
          <p className="text-sm text-pink-400 italic animate-pulse">
            (Try to catch it if you can! 😏)
          </p>
        </div>
      </div>
    </div>
  );
}
