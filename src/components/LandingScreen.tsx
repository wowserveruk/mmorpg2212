import { useEffect, useState } from 'react';
import { Flame, Shield, Sword } from 'lucide-react';

interface Props {
  onPlay: () => void;
  onLeaderboard: () => void;
}

interface Ember {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
}

function DragonSVG() {
  return (
    <svg viewBox="0 0 300 250" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id="dragonGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#dc2626" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <ellipse cx="150" cy="125" rx="120" ry="100" fill="url(#dragonGlow)" />
      <g filter="url(#glow)" stroke="#dc2626" strokeWidth="2" fill="#1a0505">
        <path d="M150 180 Q120 160 100 130 Q85 105 95 80 Q105 60 130 55 Q150 50 165 60 Q185 55 195 75 Q205 95 195 120 Q180 150 150 180Z" fill="#2a0808" stroke="#dc2626" />
        <path d="M130 55 Q110 30 90 20 Q75 25 80 45 Q85 60 100 65Z" fill="#1a0505" stroke="#ef4444" />
        <path d="M165 60 Q185 35 205 28 Q220 33 215 53 Q210 68 195 70Z" fill="#1a0505" stroke="#ef4444" />
        <path d="M95 80 Q60 70 40 80 Q30 95 45 105 Q60 112 80 105 Q90 100 95 90Z" fill="#1a0505" stroke="#dc2626" />
        <path d="M100 130 Q70 140 55 160 Q50 178 65 183 Q80 186 95 173 Q105 160 102 145Z" fill="#1a0505" stroke="#dc2626" />
        <path d="M195 120 Q225 115 240 128 Q248 143 235 152 Q220 158 205 148 Q196 138 198 128Z" fill="#1a0505" stroke="#dc2626" />
        <path d="M150 180 Q140 200 135 215 Q130 225 140 228 Q152 230 155 215 Q158 200 155 185Z" fill="#1a0505" stroke="#dc2626" />
        <circle cx="122" cy="82" r="6" fill="#ff2200" />
        <circle cx="178" cy="82" r="6" fill="#ff2200" />
        <circle cx="122" cy="82" r="3" fill="#ffaa00" />
        <circle cx="178" cy="82" r="3" fill="#ffaa00" />
        <path d="M130 108 Q140 115 150 112 Q160 115 170 108" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        <line x1="135" y1="118" x2="125" y2="125" stroke="#dc2626" strokeWidth="1" />
        <line x1="145" y1="120" x2="140" y2="128" stroke="#dc2626" strokeWidth="1" />
        <line x1="155" y1="120" x2="160" y2="128" stroke="#dc2626" strokeWidth="1" />
        <line x1="165" y1="118" x2="175" y2="125" stroke="#dc2626" strokeWidth="1" />
        <path d="M60 90 Q45 75 35 60 Q42 58 52 68 Q58 58 50 45 Q60 48 65 62 Q75 55 70 42 Q82 48 80 65 Q88 72 88 82Z" fill="#1a0505" stroke="#dc2626" strokeWidth="1.5" />
        <path d="M215 138 Q235 125 248 112 Q242 110 232 120 Q228 110 236 97 Q226 100 221 114 Q213 108 218 95 Q206 101 208 118 Q200 126 200 136Z" fill="#1a0505" stroke="#dc2626" strokeWidth="1.5" />
      </g>
      <g opacity="0.6">
        <circle cx="150" cy="75" r="2" fill="#ff8800" />
        <circle cx="130" cy="45" r="1.5" fill="#ff6600" />
        <circle cx="175" cy="48" r="1.5" fill="#ff6600" />
      </g>
    </svg>
  );
}

export default function LandingScreen({ onPlay, onLeaderboard }: Props) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  const [stars] = useState(() =>
    Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      delay: Math.random() * 3,
    }))
  );

  useEffect(() => {
    const newEmbers: Ember[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      size: 3 + Math.random() * 5,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 3,
    }));
    setEmbers(newEmbers);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center bottom, #1a0500 0%, #0d0200 40%, #050505 100%)' }}>

      {stars.map(s => (
        <div key={s.id} className="absolute star rounded-full bg-amber-100"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.size, height: s.size,
            animationDelay: `${s.delay}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
          }} />
      ))}

      <div className="absolute bottom-0 left-0 right-0 h-64 pointer-events-none">
        {embers.map(e => (
          <div key={e.id} className="absolute rounded-full"
            style={{
              left: `${e.x}%`,
              bottom: '0',
              width: e.size,
              height: e.size,
              background: `radial-gradient(circle, #ff8800, #ff4400)`,
              animation: `ember-rise ${e.duration}s ease-out ${e.delay}s infinite`,
              boxShadow: `0 0 ${e.size * 2}px #ff6600`,
            }} />
        ))}
      </div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-full max-w-lg opacity-20 float-slow-anim" style={{ filter: 'blur(1px)' }}>
          <DragonSVG />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-4xl">
        <div className="mb-2 flex items-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-600" />
          <span className="cinzel text-amber-500 text-sm tracking-[0.3em] uppercase">The Age of Dragons</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-600" />
        </div>

        <h1 className="cinzel font-black text-7xl md:text-9xl mb-1 leading-none fire-flicker"
          style={{ color: '#ff4400' }}>
          DRAGON
        </h1>
        <h1 className="cinzel font-black text-7xl md:text-9xl leading-none mb-8"
          style={{
            color: '#f59e0b',
            textShadow: '0 0 40px rgba(245, 158, 11, 0.8), 0 0 80px rgba(217, 119, 6, 0.5)',
          }}>
          AWAKEN
        </h1>

        <p className="text-amber-200/70 text-xl mb-12 max-w-md leading-relaxed" style={{ fontStyle: 'italic' }}>
          Ancient evils stir beneath the world. Rise, champion, and face the dragons before darkness consumes all.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-12">
          <button onClick={onPlay}
            className="btn-gold cinzel text-amber-900 font-bold text-lg px-12 py-4 rounded cursor-pointer pulse-gold-anim"
            style={{ letterSpacing: '0.15em' }}>
            <span className="flex items-center gap-2">
              <Flame size={20} />
              AWAKEN NOW
              <Flame size={20} />
            </span>
          </button>
          <button onClick={onLeaderboard}
            className="cinzel text-amber-400 font-semibold text-base px-8 py-4 rounded cursor-pointer"
            style={{
              border: '1px solid rgba(217, 119, 6, 0.4)',
              background: 'rgba(120, 53, 15, 0.2)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              (e.target as HTMLElement).style.background = 'rgba(120, 53, 15, 0.4)';
              (e.target as HTMLElement).style.borderColor = 'rgba(217, 119, 6, 0.7)';
            }}
            onMouseLeave={e => {
              (e.target as HTMLElement).style.background = 'rgba(120, 53, 15, 0.2)';
              (e.target as HTMLElement).style.borderColor = 'rgba(217, 119, 6, 0.4)';
            }}>
            Hall of Legends
          </button>
        </div>

        <div className="flex items-center gap-8 text-amber-700/60">
          <div className="flex items-center gap-2 text-sm">
            <Sword size={16} />
            <span>3 Dragon Bosses</span>
          </div>
          <div className="w-px h-4 bg-amber-800" />
          <div className="flex items-center gap-2 text-sm">
            <Shield size={16} />
            <span>4 Hero Classes</span>
          </div>
          <div className="w-px h-4 bg-amber-800" />
          <div className="flex items-center gap-2 text-sm">
            <Flame size={16} />
            <span>Turn-Based Combat</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32"
        style={{ background: 'linear-gradient(to top, rgba(220,38,38,0.08), transparent)' }} />
    </div>
  );
}
