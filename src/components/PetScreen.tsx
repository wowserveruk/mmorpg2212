import { useState } from 'react';
import { ChevronLeft, Zap, Star, Shield, Heart, Wind } from 'lucide-react';
import { Pet, PlayerState } from '../types/game';
import { PETS } from '../lib/gameData';

interface Props {
  player: PlayerState;
  onUpdate: (updatedPlayer: PlayerState) => void;
  onBack: () => void;
}

const RARITY_CONFIG = {
  rare: { label: 'Rare', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.3)', glow: 'none' },
  epic: { label: 'Epic', color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.35)', glow: '0 0 15px rgba(249,115,22,0.2)' },
  legendary: { label: 'Legendary', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.5)', glow: '0 0 25px rgba(245,158,11,0.3), 0 0 50px rgba(245,158,11,0.1)' },
};

const ELEMENT_ICONS: Record<string, string> = {
  fire: '🔥',
  ice: '❄',
  storm: '⚡',
  shadow: '🌑',
  holy: '✦',
  dragon: '🐉',
};

function PetSVG({ pet }: { pet: Pet }) {
  const c = pet.color;
  if (pet.element === 'fire') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <ellipse cx="40" cy="58" rx="18" ry="8" fill={c} opacity="0.2" />
        <path d="M40 65 Q30 50 32 38 Q35 28 40 22 Q45 28 48 38 Q50 50 40 65Z" fill={c} opacity="0.9" />
        <path d="M34 60 Q25 48 28 36 Q30 28 34 24 Q32 34 36 42 Q38 50 34 60Z" fill="#fbbf24" opacity="0.7" />
        <path d="M40 22 Q36 16 38 10 Q40 14 42 10 Q44 16 40 22Z" fill="#fef08a" opacity="0.9" />
        <ellipse cx="36" cy="44" rx="3" ry="4" fill="white" opacity="0.85" />
        <ellipse cx="44" cy="44" rx="3" ry="4" fill="white" opacity="0.85" />
        <ellipse cx="36" cy="44" rx="1.5" ry="2" fill="#1a0000" />
        <ellipse cx="44" cy="44" rx="1.5" ry="2" fill="#1a0000" />
        <path d="M28 58 Q24 52 20 56" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M52 58 Q56 52 60 56" stroke={c} strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M30 52 Q22 45 18 50" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M50 52 Q58 45 62 50" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.7" />
      </svg>
    );
  }
  if (pet.element === 'ice') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <ellipse cx="40" cy="60" rx="20" ry="10" fill={c} opacity="0.15" />
        <path d="M40 20 L40 62" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 40 L60 40" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
        <path d="M26 26 L54 54" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M54 26 L26 54" stroke={c} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <circle cx="40" cy="40" r="10" fill={c} opacity="0.3" />
        <circle cx="40" cy="40" r="6" fill={c} opacity="0.6" />
        <circle cx="40" cy="40" r="3" fill="white" opacity="0.9" />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
          <circle key={i} cx={40 + 20 * Math.cos(angle * Math.PI / 180)} cy={40 + 20 * Math.sin(angle * Math.PI / 180)} r="2.5" fill={c} opacity="0.8" />
        ))}
        <path d="M33 22 L37 18 L40 22 L43 18 L47 22" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }
  if (pet.element === 'storm') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <ellipse cx="40" cy="62" rx="22" ry="8" fill={c} opacity="0.15" />
        <path d="M40 15 L50 15 L30 40 L42 40 L20 65 L38 45 L28 45 Z" fill={c} opacity="0.85" />
        <path d="M40 15 L50 15 L35 36 L44 36" fill="#fef08a" opacity="0.6" />
        {[1,2,3].map(i => (
          <line key={i} x1={15 + i*12} y1={20 + i*5} x2={15 + i*12 - 8} y2={20 + i*5 + 12} stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        ))}
      </svg>
    );
  }
  if (pet.element === 'shadow') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <ellipse cx="40" cy="62" rx="22" ry="9" fill={c} opacity="0.2" />
        <path d="M40 20 Q55 30 55 45 Q55 62 40 65 Q25 62 25 45 Q25 30 40 20Z" fill={c} opacity="0.8" />
        <path d="M25 42 Q15 35 12 42 Q10 50 18 52 Q25 54 25 48Z" fill={c} opacity="0.7" />
        <path d="M55 42 Q65 35 68 42 Q70 50 62 52 Q55 54 55 48Z" fill={c} opacity="0.7" />
        <ellipse cx="35" cy="40" rx="4" ry="5" fill="white" opacity="0.9" />
        <ellipse cx="45" cy="40" rx="4" ry="5" fill="white" opacity="0.9" />
        <ellipse cx="35" cy="41" rx="2" ry="2.5" fill="#200020" />
        <ellipse cx="45" cy="41" rx="2" ry="2.5" fill="#200020" />
        <circle cx="35" cy="40" r="1" fill={c} opacity="0.9" />
        <circle cx="45" cy="40" r="1" fill={c} opacity="0.9" />
        <path d="M33 52 Q40 56 47 52" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <path d="M36 20 Q38 14 40 18 Q42 14 44 20" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      </svg>
    );
  }
  if (pet.element === 'holy') {
    return (
      <svg viewBox="0 0 80 80" className="w-full h-full">
        <ellipse cx="40" cy="62" rx="20" ry="8" fill={c} opacity="0.2" />
        <path d="M40 18 Q58 30 55 48 Q52 60 40 64 Q28 60 25 48 Q22 30 40 18Z" fill="white" opacity="0.15" stroke={c} strokeWidth="1" />
        <path d="M40 22 Q55 32 52 47 Q49 58 40 61 Q31 58 28 47 Q25 32 40 22Z" fill={c} opacity="0.5" />
        <circle cx="40" cy="14" r="5" fill={c} opacity="0.9" />
        <path d="M36 10 Q40 4 44 10" fill="none" stroke={c} strokeWidth="1.5" />
        <ellipse cx="35" cy="40" rx="3.5" ry="4" fill="white" opacity="0.9" />
        <ellipse cx="45" cy="40" rx="3.5" ry="4" fill="white" opacity="0.9" />
        <ellipse cx="35" cy="41" rx="1.8" ry="2.2" fill="#100020" />
        <ellipse cx="45" cy="41" rx="1.8" ry="2.2" fill="#100020" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
          <line key={i} x1={40 + 22 * Math.cos(a * Math.PI / 180)} y1={42 + 22 * Math.sin(a * Math.PI / 180)} x2={40 + 28 * Math.cos(a * Math.PI / 180)} y2={42 + 28 * Math.sin(a * Math.PI / 180)} stroke={c} strokeWidth="1.5" opacity="0.4" />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      <ellipse cx="40" cy="65" rx="20" ry="8" fill={c} opacity="0.2" />
      <path d="M40 62 Q28 56 24 44 Q22 32 28 24 Q34 16 40 18 Q46 16 52 24 Q58 32 56 44 Q52 56 40 62Z" fill={c} opacity="0.85" />
      <path d="M28 24 Q22 14 18 10 Q20 18 24 22Z" fill={c} />
      <path d="M52 24 Q58 14 62 10 Q60 18 56 22Z" fill={c} />
      <path d="M24 44 Q12 38 8 44 Q6 52 16 54Z" fill={c} opacity="0.7" />
      <path d="M56 44 Q68 38 72 44 Q74 52 64 54Z" fill={c} opacity="0.7" />
      <ellipse cx="35" cy="36" rx="4" ry="5" fill="white" opacity="0.9" />
      <ellipse cx="45" cy="36" rx="4" ry="5" fill="white" opacity="0.9" />
      <ellipse cx="35" cy="37" rx="2" ry="2.5" fill="#150010" />
      <ellipse cx="45" cy="37" rx="2" ry="2.5" fill="#150010" />
      <circle cx="35" cy="36" r="1" fill={c} opacity="0.8" />
      <circle cx="45" cy="36" r="1" fill={c} opacity="0.8" />
      <path d="M36 48 Q40 52 44 48" stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M32 38 Q40 62 40 62" stroke={c} strokeWidth="1" opacity="0.3" fill="none" />
      <path d="M48 38 Q40 62 40 62" stroke={c} strokeWidth="1" opacity="0.3" fill="none" />
    </svg>
  );
}

function StatChip({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <span style={{ color }}>{icon}</span>
      <span className="text-amber-700/60 text-xs">{label}</span>
      <span className="cinzel font-bold text-xs" style={{ color }}>+{value}</span>
    </div>
  );
}

export default function PetScreen({ player, onUpdate, onBack }: Props) {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(player.activePetId);

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  }

  function handleUnlock(pet: Pet) {
    const owned = player.ownedPetIds.includes(pet.id);
    if (owned) {
      showToast('Already owned!', false);
      return;
    }
    if (pet.unlockCostType === 'gold') {
      if (player.gold < pet.unlockCost) { showToast('Not enough gold!', false); return; }
      onUpdate({ ...player, gold: player.gold - pet.unlockCost, ownedPetIds: [...player.ownedPetIds, pet.id] });
    } else {
      if (player.diamonds < pet.unlockCost) { showToast('Not enough diamonds!', false); return; }
      onUpdate({ ...player, diamonds: player.diamonds - pet.unlockCost, ownedPetIds: [...player.ownedPetIds, pet.id] });
    }
    showToast(`${pet.name} unlocked!`, true);
  }

  function handleEquip(pet: Pet) {
    const newActivePetId = selectedPetId === pet.id ? null : pet.id;
    setSelectedPetId(newActivePetId);
    onUpdate({ ...player, activePetId: newActivePetId });
    showToast(newActivePetId ? `${pet.name} equipped!` : 'Pet unequipped.', true);
  }

  const rarityOrder: Pet['rarity'][] = ['legendary', 'epic', 'rare'];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #0d0820 0%, #060310 50%, #030505 100%)' }}>

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl cinzel font-bold text-sm scale-in-anim"
          style={{
            background: toast.ok ? 'rgba(10,30,10,0.97)' : 'rgba(40,5,5,0.97)',
            border: `1px solid ${toast.ok ? '#22c55e' : '#ef4444'}`,
            color: toast.ok ? '#4ade80' : '#f87171',
            boxShadow: `0 0 20px ${toast.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
          {toast.msg}
        </div>
      )}

      <div className="glass-dark border-b border-amber-900/30 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-amber-600 hover:text-amber-400 transition-colors cursor-pointer">
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex-1 text-center">
          <h2 className="cinzel font-bold text-amber-400 text-lg tracking-widest">PET COMPANIONS</h2>
          <p className="text-amber-700/60 text-xs italic">Summon ancient spirits to fight at your side</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span className="text-amber-400">🪙</span>
            <span className="cinzel font-bold text-amber-400">{player.gold}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)' }}>
            <span className="text-blue-300">💎</span>
            <span className="cinzel font-bold text-blue-300">{player.diamonds}</span>
          </div>
        </div>
      </div>

      {player.activePetId && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          {(() => {
            const active = PETS.find(p => p.id === player.activePetId);
            if (!active) return null;
            const rc = RARITY_CONFIG[active.rarity];
            return (
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ background: `${rc.bg}`, border: `1px solid ${rc.border}`, boxShadow: rc.glow }}>
                <div className="text-lg cinzel font-bold" style={{ color: rc.color }}>Active Pet:</div>
                <div className="w-12 h-12 rounded-xl overflow-hidden" style={{ background: `${active.color}15`, border: `1px solid ${active.color}40` }}>
                  <PetSVG pet={active} />
                </div>
                <div>
                  <div className="cinzel font-bold" style={{ color: active.accentColor }}>{active.name}</div>
                  <div className="text-amber-700/60 text-xs italic">{active.title}</div>
                </div>
                <div className="flex gap-2 ml-auto flex-wrap">
                  <StatChip icon={<Zap size={11} />} label="ATK" value={active.bonusAtk} color="#ef4444" />
                  <StatChip icon={<Shield size={11} />} label="DEF" value={active.bonusDef} color="#60a5fa" />
                  <StatChip icon={<Heart size={11} />} label="HP" value={active.bonusHp} color="#22c55e" />
                  <StatChip icon={<Wind size={11} />} label="SPD" value={active.bonusSpeed} color="#a78bfa" />
                </div>
              </div>
            );
          })()}
        </div>
      )}

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6 space-y-8">
        {rarityOrder.map(rarity => {
          const pets = PETS.filter(p => p.rarity === rarity);
          const rc = RARITY_CONFIG[rarity];
          return (
            <div key={rarity}>
              <div className="flex items-center gap-3 mb-4">
                <Star size={14} style={{ color: rc.color }} />
                <h3 className="cinzel font-bold text-sm tracking-widest" style={{ color: rc.color }}>{rc.label} Companions</h3>
                <div className="flex-1 h-px" style={{ background: `${rc.color}30` }} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map(pet => {
                  const owned = player.ownedPetIds.includes(pet.id);
                  const isActive = player.activePetId === pet.id;
                  return (
                    <div key={pet.id} className="relative rounded-xl p-4 flex flex-col gap-3 transition-all duration-200"
                      style={{
                        background: isActive ? `${pet.color}18` : rc.bg,
                        border: `1px solid ${isActive ? pet.color : rc.border}`,
                        boxShadow: isActive ? `0 0 20px ${pet.color}40` : rc.glow,
                      }}>

                      {rarity === 'legendary' && owned && (
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs cinzel font-bold"
                          style={{ background: '#d97706', color: '#1a0800' }}>
                          Legendary
                        </div>
                      )}

                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: `${pet.color}15`, border: `1px solid ${pet.color}40` }}>
                          <PetSVG pet={pet} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-base">{ELEMENT_ICONS[pet.element]}</span>
                            <span className="cinzel font-bold text-sm truncate" style={{ color: pet.accentColor }}>{pet.name}</span>
                          </div>
                          <div className="text-amber-700/60 text-xs italic mb-1">{pet.title}</div>
                          <span className="text-xs font-semibold px-1.5 py-0.5 rounded" style={{ color: rc.color, background: `${rc.color}18` }}>
                            {rc.label}
                          </span>
                        </div>
                      </div>

                      <p className="text-amber-700/70 text-xs leading-relaxed">{pet.description}</p>

                      <div className="grid grid-cols-2 gap-1.5">
                        <StatChip icon={<Zap size={11} />} label="ATK" value={pet.bonusAtk} color="#ef4444" />
                        <StatChip icon={<Shield size={11} />} label="DEF" value={pet.bonusDef} color="#60a5fa" />
                        <StatChip icon={<Heart size={11} />} label="HP" value={pet.bonusHp} color="#22c55e" />
                        <StatChip icon={<Wind size={11} />} label="SPD" value={pet.bonusSpeed} color="#a78bfa" />
                      </div>

                      <div className="rounded-lg p-2.5" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div className="cinzel text-xs font-bold mb-1" style={{ color: pet.color }}>{pet.battleSkillName}</div>
                        <div className="text-amber-800/70 text-xs">{pet.battleSkillDescription}</div>
                        <div className="text-amber-500 text-xs mt-1">Damage: <span className="font-bold">{pet.battleSkillDamage}</span></div>
                      </div>

                      {owned ? (
                        <button onClick={() => handleEquip(pet)}
                          className="w-full py-2 rounded-lg cinzel font-bold text-sm transition-all duration-150 cursor-pointer"
                          style={{
                            background: isActive ? 'rgba(239,68,68,0.2)' : `${pet.color}25`,
                            border: `1px solid ${isActive ? '#ef4444' : pet.color}`,
                            color: isActive ? '#ef4444' : pet.accentColor,
                          }}>
                          {isActive ? 'Unequip' : 'Equip'}
                        </button>
                      ) : (
                        <button onClick={() => handleUnlock(pet)}
                          className="w-full py-2 rounded-lg cinzel font-bold text-sm transition-all duration-150 cursor-pointer btn-gold text-amber-900">
                          <span className="flex items-center justify-center gap-1.5">
                            <span>{pet.unlockCostType === 'gold' ? '🪙' : '💎'}</span>
                            <span>{pet.unlockCost} {pet.unlockCostType === 'gold' ? 'Gold' : 'Diamonds'}</span>
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
