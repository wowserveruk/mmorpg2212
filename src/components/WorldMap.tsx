import { Flame, Lock, CheckCircle, Crown } from 'lucide-react';
import { Dragon, PlayerState } from '../types/game';
import { DRAGONS } from '../lib/gameData';

interface Props {
  player: PlayerState;
  defeatedDragons: string[];
  onFight: (dragon: Dragon) => void;
  onShop: () => void;
}

const DRAGON_POSITIONS = [
  { x: 20, y: 65 },
  { x: 52, y: 32 },
  { x: 78, y: 58 },
];

const DRAGON_LABELS = ['Scorched Highlands', 'Frozen Peaks', 'Shadow Abyss'];
const DRAGON_COLORS = ['#dc2626', '#0891b2', '#7c3aed'];

function DragonNodeSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
      <circle cx="30" cy="30" r="28" fill="rgba(0,0,0,0.6)" stroke={color} strokeWidth="1.5" />
      <circle cx="30" cy="30" r="20" fill={`${color}15`} />
      <g fill={color} opacity="0.9">
        <path d="M30 40 Q24 35 20 28 Q18 22 22 18 Q26 14 30 15 Q34 14 38 18 Q42 22 40 28 Q36 35 30 40Z" />
        <path d="M24 18 Q20 10 16 8 Q18 14 21 16Z" />
        <path d="M36 18 Q40 10 44 8 Q42 14 39 16Z" />
        <circle cx="24" cy="24" r="2.5" fill="white" />
        <circle cx="36" cy="24" r="2.5" fill="white" />
        <circle cx="24" cy="24" r="1.2" fill="#ff6600" />
        <circle cx="36" cy="24" r="1.2" fill="#ff6600" />
      </g>
    </svg>
  );
}

export default function WorldMap({ player, defeatedDragons, onFight, onShop }: Props) {
  function getNodeState(dragon: Dragon, index: number): 'locked' | 'available' | 'defeated' {
    if (defeatedDragons.includes(dragon.id)) return 'defeated';
    if (index === 0) return 'available';
    const prev = DRAGONS[index - 1];
    return defeatedDragons.includes(prev.id) ? 'available' : 'locked';
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #0d0800 0%, #060300 50%, #030303 100%)' }}>

      <div className="glass-dark border-b border-amber-900/30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h2 className="cinzel font-bold text-amber-400 text-lg">{player.name}</h2>
            <p className="text-amber-700/70 text-sm">{player.className} &bull; Level {player.level}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-green-400 font-bold text-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                {player.hp}
              </div>
              <div className="text-amber-700/60 text-xs">HP</div>
            </div>
            <div className="text-center">
              <div className="text-blue-400 font-bold text-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                {player.mp}
              </div>
              <div className="text-amber-700/60 text-xs">MP</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-lg" style={{ fontFamily: 'Cinzel, serif' }}>
                {player.gold}
              </div>
              <div className="text-amber-700/60 text-xs">Gold</div>
            </div>
            <button onClick={onShop}
              className="flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer pulse-gold-anim transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #78350f, #d97706)',
                border: '1px solid #fbbf24',
                color: '#1a0800',
              }}>
              <Crown size={14} />
              <span className="cinzel font-bold text-xs tracking-wider">VIP Shop</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="cinzel font-bold text-3xl text-amber-400 mb-2">World Map</h1>
          <p className="text-amber-700/60 text-base italic">Three ancient dragons await your challenge</p>
        </div>

        <div className="w-full max-w-3xl">
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(20,10,0,0.9), rgba(10,5,0,0.95))',
              border: '1px solid rgba(212,160,23,0.2)',
              minHeight: 380,
            }}>

            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <div key={i} className="absolute rounded-full"
                  style={{
                    width: 4 + Math.random() * 80,
                    height: 4 + Math.random() * 80,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: '#78350f',
                    border: '1px solid #d97706',
                    borderRadius: '50%',
                    opacity: 0.3 + Math.random() * 0.4,
                  }} />
              ))}
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" opacity="0.3">
              <path d="M20 65 Q36 48 52 32" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
              <path d="M52 32 Q65 45 78 58" stroke="#d97706" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
            </svg>

            {DRAGONS.map((dragon, i) => {
              const pos = DRAGON_POSITIONS[i];
              const state = getNodeState(dragon, i);
              const color = DRAGON_COLORS[i];

              return (
                <div key={dragon.id}
                  className="absolute"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>

                  <div className="relative flex flex-col items-center">
                    {state === 'available' && (
                      <div className="absolute inset-0 rounded-full map-pulse-anim"
                        style={{
                          width: 64, height: 64,
                          background: `${color}20`,
                          transform: 'translate(-12%, -12%)',
                          borderRadius: '50%',
                        }} />
                    )}

                    <button
                      onClick={() => state === 'available' && onFight(dragon)}
                      disabled={state !== 'available'}
                      className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        cursor: state === 'available' ? 'pointer' : 'not-allowed',
                        opacity: state === 'locked' ? 0.4 : 1,
                        filter: state === 'available' ? `drop-shadow(0 0 12px ${color})` : 'none',
                        background: state === 'defeated' ? 'rgba(0,0,0,0.7)' : `${color}20`,
                        border: `2px solid ${state === 'defeated' ? 'rgba(34,197,94,0.5)' : color}`,
                      }}>
                      {state === 'defeated' ? (
                        <CheckCircle size={28} className="text-green-500" />
                      ) : state === 'locked' ? (
                        <Lock size={22} className="text-amber-800" />
                      ) : (
                        <div className="w-full h-full p-1">
                          <DragonNodeSVG color={color} />
                        </div>
                      )}
                    </button>

                    <div className="mt-2 text-center">
                      <div className="cinzel font-bold text-xs whitespace-nowrap" style={{ color }}>
                        {dragon.name}
                      </div>
                      <div className="text-amber-700/60 text-xs">{DRAGON_LABELS[i]}</div>
                      <div className="text-amber-700/50 text-xs">Lv.{dragon.level}</div>
                    </div>

                    {state === 'available' && (
                      <button onClick={() => onFight(dragon)}
                        className="mt-2 btn-fire px-3 py-1 rounded text-xs cinzel text-red-100 cursor-pointer">
                        <span className="flex items-center gap-1">
                          <Flame size={10} />
                          Challenge
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 w-full max-w-3xl">
          {DRAGONS.map((dragon, i) => {
            const state = getNodeState(dragon, i);
            const color = DRAGON_COLORS[i];

            return (
              <div key={dragon.id} className="glass-panel rounded-xl p-4"
                style={{ opacity: state === 'locked' ? 0.5 : 1 }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                  <span className="cinzel text-xs font-bold" style={{ color }}>
                    {dragon.name}
                  </span>
                  {state === 'defeated' && <CheckCircle size={12} className="text-green-500 ml-auto" />}
                </div>
                <p className="text-amber-800/60 text-xs italic leading-relaxed">{dragon.title}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-green-700">HP {dragon.maxHp}</span>
                  <span className="text-red-700">ATK {dragon.attack}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
