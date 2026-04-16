import { useEffect, useState } from 'react';
import { Star, Coins, Zap } from 'lucide-react';
import { Dragon, PlayerState } from '../types/game';

interface Props {
  player: PlayerState;
  dragon: Dragon;
  expGained: number;
  goldGained: number;
  isLastDragon: boolean;
  onContinue: () => void;
  onLeaderboard: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
}

export default function VictoryScreen({ player, dragon, expGained, goldGained, isLastDragon, onContinue, onLeaderboard }: Props) {
  const [particles] = useState<Particle[]>(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 20 + Math.random() * 60,
      color: ['#d97706', '#f59e0b', '#dc2626', '#ef4444', '#fbbf24'][Math.floor(Math.random() * 5)],
      size: 4 + Math.random() * 8,
      delay: Math.random() * 2,
    }))
  );

  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowing(true), 100);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a0800 0%, #080300 50%, #030303 100%)' }}>

      {particles.map(p => (
        <div key={p.id} className="absolute rounded-full pointer-events-none star"
          style={{
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${1 + Math.random()}s`,
          }} />
      ))}

      <div className={`relative z-10 text-center max-w-xl mx-auto px-6 transition-all duration-700 ${showing ? 'scale-in-anim' : 'opacity-0'}`}>

        <div className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl pulse-gold-anim"
            style={{ background: 'rgba(217,119,6,0.2)', border: '2px solid #d97706' }}>
            {isLastDragon ? '👑' : '⚔'}
          </div>
        </div>

        <h1 className="cinzel font-black text-5xl mb-2 victory-glow-anim"
          style={{ color: '#f59e0b' }}>
          {isLastDragon ? 'LEGENDARY!' : 'VICTORY!'}
        </h1>

        <p className="text-amber-300/80 text-xl mb-1 italic">
          {isLastDragon
            ? 'You have vanquished all dragons!'
            : `${dragon.name} has been defeated!`}
        </p>

        {isLastDragon && (
          <p className="text-amber-500/70 text-base mb-4">
            The world is safe once more, champion!
          </p>
        )}

        <div className="glass-panel rounded-2xl p-6 my-6 space-y-4">
          <h3 className="cinzel text-amber-500 font-bold text-sm tracking-widest mb-4">BATTLE REWARDS</h3>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <Zap size={18} className="text-green-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="text-amber-200/70 text-sm">Experience Gained</span>
                <span className="cinzel text-green-400 font-bold text-lg">+{expGained}</span>
              </div>
              <div className="h-1.5 rounded-full mt-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
                <div className="h-full rounded-full" style={{ width: `${Math.min(100, (player.exp % 1000) / 10)}%`, background: '#22c55e' }} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)' }}>
              <Coins size={18} className="text-amber-400" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline">
                <span className="text-amber-200/70 text-sm">Gold Earned</span>
                <span className="cinzel text-amber-400 font-bold text-lg">+{goldGained}</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-amber-900/30">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="cinzel text-green-400 font-bold">{player.hp}</div>
                <div className="text-amber-700/60 text-xs">HP Remaining</div>
              </div>
              <div>
                <div className="cinzel text-blue-400 font-bold">{player.mp}</div>
                <div className="text-amber-700/60 text-xs">MP Remaining</div>
              </div>
              <div>
                <div className="cinzel text-amber-400 font-bold">{player.gold}</div>
                <div className="text-amber-700/60 text-xs">Total Gold</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {!isLastDragon ? (
            <button onClick={onContinue}
              className="btn-gold flex-1 py-4 rounded-xl cinzel font-bold text-amber-900 text-base cursor-pointer">
              <span className="flex items-center justify-center gap-2">
                <Star size={18} />
                Continue Quest
              </span>
            </button>
          ) : null}

          <button onClick={onLeaderboard}
            className={`flex-1 py-4 rounded-xl cinzel font-bold text-base cursor-pointer ${isLastDragon ? 'btn-gold' : ''}`}
            style={!isLastDragon ? {
              background: 'rgba(120,53,15,0.3)',
              border: '1px solid rgba(217,119,6,0.4)',
              color: '#d97706',
            } : {}}>
            {isLastDragon ? 'Enter the Hall of Legends' : 'View Leaderboard'}
          </button>
        </div>
      </div>
    </div>
  );
}
