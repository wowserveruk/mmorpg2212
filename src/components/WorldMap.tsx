import { Flame, Lock, CheckCircle, Crown, Zap } from 'lucide-react';
import { Dragon, PlayerState } from '../types/game';
import { DRAGONS, calculateBR, formatBR } from '../lib/gameData';

interface Props {
  player: PlayerState;
  defeatedDragons: string[];
  onFight: (dragon: Dragon) => void;
  onShop: () => void;
}

const DRAGON_POSITIONS = [
  { x: 12, y: 60 },
  { x: 30, y: 26 },
  { x: 50, y: 64 },
  { x: 70, y: 24 },
  { x: 88, y: 58 },
];

const DRAGON_LABELS = ['Scorched Highlands', 'Frozen Peaks', 'Tempest Peaks', 'Volcanic Depths', 'Shadow Abyss'];
const DRAGON_COLORS = ['#dc2626', '#0891b2', '#16a34a', '#ea580c', '#7c3aed'];

function DragonNodeSVG({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
      <defs>
        <radialGradient id={`nodeGlow-${color.replace('#','')}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </radialGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill={`url(#nodeGlow-${color.replace('#','')})`} stroke={color} strokeWidth="1.5" />

      <g fill={color} opacity="0.9">
        <path d="M10 28 C14 20, 26 26, 32 38 C38 26, 50 20, 54 28 C56 38, 50 46, 32 44 C14 46, 8 38, 10 28Z" opacity="0.25" />
        <path d="M10 28 L4 14 L14 20 L16 10 L20 18 Z" />
        <path d="M54 28 L60 14 L50 20 L48 10 L44 18 Z" />
      </g>

      <g fill={color} opacity="0.95">
        <path d="M32 44 Q24 38 20 30 Q18 22 22 18 Q26 14 32 15 Q38 14 42 18 Q46 22 44 30 Q40 38 32 44Z" />
        <path d="M26 18 Q22 10 17 7 Q19 13 22 15Z" />
        <path d="M38 18 Q42 10 47 7 Q45 13 42 15Z" />
        <circle cx="26" cy="25" r="3" fill="white" opacity="0.9" />
        <circle cx="38" cy="25" r="3" fill="white" opacity="0.9" />
        <circle cx="26" cy="25" r="1.5" fill="#ff6600" />
        <circle cx="38" cy="25" r="1.5" fill="#ff6600" />
        <path d="M28 34 Q32 37 36 34" stroke={color} strokeWidth="1.2" fill="none" opacity="0.6" />
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

  const br = calculateBR(player);

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at center, #0d0800 0%, #060300 50%, #030303 100%)' }}>

      <div className="glass-dark border-b border-amber-900/30 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h2 className="cinzel font-bold text-amber-400 text-base truncate">{player.name}</h2>
            <p className="text-amber-700/70 text-xs">{player.className} &bull; Lv.{player.level}</p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
              style={{ background: 'rgba(234,179,8,0.12)', border: '1px solid rgba(234,179,8,0.3)' }}>
              <Zap size={12} className="text-yellow-400" />
              <span className="cinzel font-black text-yellow-300 text-sm">{formatBR(br)}</span>
              <span className="text-yellow-600/60 text-xs">BR</span>
            </div>
            <div className="text-center hidden sm:block">
              <div className="text-green-400 font-bold text-base" style={{ fontFamily: 'Cinzel, serif' }}>{player.hp}</div>
              <div className="text-amber-700/60 text-xs">HP</div>
            </div>
            <div className="text-center hidden sm:block">
              <div className="text-blue-400 font-bold text-base" style={{ fontFamily: 'Cinzel, serif' }}>{player.mp}</div>
              <div className="text-amber-700/60 text-xs">MP</div>
            </div>
            <div className="text-center">
              <div className="text-yellow-400 font-bold text-base" style={{ fontFamily: 'Cinzel, serif' }}>{player.gold}</div>
              <div className="text-amber-700/60 text-xs">Gold</div>
            </div>
            <button onClick={onShop}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer pulse-gold-anim"
              style={{
                background: 'linear-gradient(135deg, #78350f, #d97706)',
                border: '1px solid #fbbf24',
                color: '#1a0800',
              }}>
              <Crown size={13} />
              <span className="cinzel font-bold text-xs tracking-wider">VIP Shop</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="cinzel font-bold text-3xl text-amber-400 mb-1">World Map</h1>
          <p className="text-amber-700/60 text-sm italic">Five ancient dragons await your challenge</p>
        </div>

        <div className="w-full max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(18,8,0,0.95), rgba(8,4,0,0.98))',
              border: '1px solid rgba(212,160,23,0.2)',
              minHeight: 320,
            }}>

            <div className="absolute inset-0 opacity-8 pointer-events-none">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="absolute rounded-full"
                  style={{
                    width: 20 + (i * 7) % 60,
                    height: 20 + (i * 5) % 50,
                    left: `${(i * 17 + 5) % 90}%`,
                    top: `${(i * 13 + 10) % 85}%`,
                    background: '#78350f',
                    borderRadius: '50%',
                    opacity: 0.15,
                  }} />
              ))}
            </div>

            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" opacity="0.35">
              <path d="M12 60 Q21 43 30 26" stroke="#d97706" strokeWidth="0.6" strokeDasharray="2,2" fill="none" />
              <path d="M30 26 Q40 45 50 64" stroke="#d97706" strokeWidth="0.6" strokeDasharray="2,2" fill="none" />
              <path d="M50 64 Q60 44 70 24" stroke="#d97706" strokeWidth="0.6" strokeDasharray="2,2" fill="none" />
              <path d="M70 24 Q79 41 88 58" stroke="#d97706" strokeWidth="0.6" strokeDasharray="2,2" fill="none" />
            </svg>

            {DRAGONS.map((dragon, i) => {
              const pos = DRAGON_POSITIONS[i];
              const state = getNodeState(dragon, i);
              const color = DRAGON_COLORS[i];

              return (
                <div key={dragon.id} className="absolute"
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: 'translate(-50%, -50%)' }}>
                  <div className="relative flex flex-col items-center">
                    {state === 'available' && (
                      <div className="absolute rounded-full map-pulse-anim pointer-events-none"
                        style={{ width: 68, height: 68, background: `${color}20`, borderRadius: '50%', top: '-8px', left: '-8px' }} />
                    )}

                    <button onClick={() => state === 'available' && onFight(dragon)}
                      disabled={state !== 'available'}
                      className="relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-200"
                      style={{
                        cursor: state === 'available' ? 'pointer' : 'not-allowed',
                        opacity: state === 'locked' ? 0.38 : 1,
                        filter: state === 'available' ? `drop-shadow(0 0 14px ${color}) drop-shadow(0 0 6px ${color})` : 'none',
                        background: state === 'defeated' ? 'rgba(0,0,0,0.75)' : `${color}18`,
                        border: `2px solid ${state === 'defeated' ? 'rgba(34,197,94,0.5)' : color}`,
                      }}>
                      {state === 'defeated' ? (
                        <CheckCircle size={26} className="text-green-500" />
                      ) : state === 'locked' ? (
                        <Lock size={20} className="text-amber-800" />
                      ) : (
                        <div className="w-full h-full p-0.5">
                          <DragonNodeSVG color={color} />
                        </div>
                      )}
                    </button>

                    <div className="mt-1.5 text-center">
                      <div className="cinzel font-bold text-xs whitespace-nowrap" style={{ color, textShadow: `0 0 8px ${color}` }}>
                        {dragon.name}
                      </div>
                      <div className="text-amber-700/50 text-xs" style={{ fontSize: 9 }}>{DRAGON_LABELS[i]}</div>
                      <div className="text-amber-800/50 text-xs" style={{ fontSize: 9 }}>Lv.{dragon.level}</div>
                    </div>

                    {state === 'available' && (
                      <button onClick={() => onFight(dragon)}
                        className="mt-1.5 btn-fire px-2.5 py-1 rounded text-xs cinzel text-red-100 cursor-pointer">
                        <span className="flex items-center gap-1">
                          <Flame size={9} />
                          Fight
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 lg:grid-cols-5 gap-3 w-full max-w-4xl">
          {DRAGONS.map((dragon, i) => {
            const state = getNodeState(dragon, i);
            const color = DRAGON_COLORS[i];
            return (
              <div key={dragon.id} className="glass-panel rounded-xl p-3"
                style={{ opacity: state === 'locked' ? 0.45 : 1, borderColor: state === 'available' ? `${color}50` : undefined }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                  <span className="cinzel text-xs font-bold truncate" style={{ color }}>{dragon.name}</span>
                  {state === 'defeated' && <CheckCircle size={10} className="text-green-500 ml-auto shrink-0" />}
                </div>
                <p className="text-amber-800/60 text-xs italic leading-tight mb-1.5" style={{ fontSize: 10 }}>{dragon.title}</p>
                <div className="flex flex-col gap-0.5 text-xs" style={{ fontSize: 10 }}>
                  <span className="text-green-700">HP {dragon.maxHp}</span>
                  <span className="text-red-700">ATK {dragon.attack}</span>
                  <span style={{ color }}>Lv.{dragon.level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
