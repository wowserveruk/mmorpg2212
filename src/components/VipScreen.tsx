import { useState } from 'react';
import { ChevronLeft, Crown, Zap, Star } from 'lucide-react';
import { PlayerState, VipTier } from '../types/game';
import { VIP_TIERS } from '../lib/gameData';

interface Props {
  player: PlayerState;
  onUpdate: (updatedPlayer: PlayerState) => void;
  onBack: () => void;
}

function VipTierBadge({ tier, isCurrent, isUnlocked }: { tier: VipTier; isCurrent: boolean; isUnlocked: boolean }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs cinzel font-bold transition-all"
      style={{
        background: isCurrent ? `${tier.color}30` : isUnlocked ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0.2)',
        border: `1px solid ${isCurrent ? tier.color : isUnlocked ? `${tier.color}50` : 'rgba(100,80,0,0.2)'}`,
        color: isUnlocked ? tier.color : 'rgba(100,80,0,0.4)',
        opacity: isUnlocked ? 1 : 0.5,
      }}>
      <Crown size={10} />
      VIP {tier.level}
    </div>
  );
}

function DiamondTopUp({ player, onUpdate }: { player: PlayerState; onUpdate: (p: PlayerState) => void }) {
  const PACKS = [
    { diamonds: 100, gold: 0, label: 'Starter Pack', cost: '100 Gold', goldCost: 100 },
    { diamonds: 300, gold: 0, label: 'Adventurer Pack', cost: '250 Gold', goldCost: 250 },
    { diamonds: 800, gold: 0, label: 'Champion Pack', cost: '600 Gold', goldCost: 600 },
    { diamonds: 2000, gold: 0, label: 'Dragon Lord Pack', cost: '1400 Gold', goldCost: 1400 },
  ];

  const [toast, setToast] = useState<string | null>(null);

  function buy(pack: typeof PACKS[0]) {
    if (player.gold < pack.goldCost) {
      setToast('Not enough gold!');
      setTimeout(() => setToast(null), 1800);
      return;
    }
    onUpdate({ ...player, gold: player.gold - pack.goldCost, diamonds: player.diamonds + pack.diamonds });
    setToast(`+${pack.diamonds} Diamonds!`);
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <div className="glass-panel rounded-xl p-5 mb-6">
      {toast && (
        <div className="text-center text-blue-300 cinzel font-bold text-sm mb-3 scale-in-anim">{toast}</div>
      )}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-blue-300 text-lg">💎</span>
        <h3 className="cinzel font-bold text-blue-300 text-sm tracking-widest">DIAMOND TOP-UP</h3>
        <div className="flex-1 h-px bg-blue-900/40" />
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg" style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)' }}>
          <span className="text-blue-300">💎</span>
          <span className="cinzel font-bold text-blue-300">{player.diamonds}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PACKS.map(pack => (
          <button key={pack.diamonds} onClick={() => buy(pack)}
            className="rounded-xl p-3 text-center transition-all duration-150 cursor-pointer"
            style={{
              background: 'rgba(96,165,250,0.08)',
              border: '1px solid rgba(96,165,250,0.25)',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(96,165,250,0.6)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(96,165,250,0.25)')}>
            <div className="text-2xl mb-1">💎</div>
            <div className="cinzel font-black text-blue-300 text-lg">+{pack.diamonds}</div>
            <div className="text-amber-700/60 text-xs mb-2">{pack.label}</div>
            <div className="flex items-center justify-center gap-1">
              <span className="text-amber-400 text-xs">🪙</span>
              <span className="cinzel text-amber-400 text-xs font-bold">{pack.goldCost}</span>
            </div>
          </button>
        ))}
      </div>
      <p className="text-amber-800/50 text-xs italic text-center mt-3">Diamonds are used to unlock VIP tiers and legendary pets</p>
    </div>
  );
}

export default function VipScreen({ player, onUpdate, onBack }: Props) {
  const currentVip = player.vipLevel;
  const currentVipExp = player.vipExp;

  function handleUpgrade(tier: VipTier) {
    if (tier.level <= currentVip) return;
    const prevTier = VIP_TIERS[tier.level - 2];
    const required = tier.diamondsRequired - (prevTier?.diamondsRequired ?? 0);
    if (player.diamonds < required) return;
    onUpdate({
      ...player,
      diamonds: player.diamonds - required,
      vipLevel: tier.level,
      vipExp: player.vipExp + required,
    });
  }

  const currentTier = VIP_TIERS[Math.max(0, currentVip - 1)];
  const nextTier = currentVip < VIP_TIERS.length ? VIP_TIERS[currentVip] : null;

  const progressToNext = nextTier
    ? Math.min(100, ((player.diamonds + currentVipExp) / nextTier.diamondsRequired) * 100)
    : 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'radial-gradient(ellipse at top, #150a00 0%, #080400 50%, #030303 100%)' }}>

      <div className="glass-dark border-b border-amber-900/30 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack} className="flex items-center gap-1 text-amber-600 hover:text-amber-400 transition-colors cursor-pointer">
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex-1 text-center">
          <div className="flex items-center justify-center gap-2">
            <Crown size={18} className="text-amber-400" />
            <h2 className="cinzel font-bold text-amber-400 text-lg tracking-widest">VIP SYSTEM</h2>
            <Crown size={18} className="text-amber-400" />
          </div>
          <p className="text-amber-700/60 text-xs italic">Ascend the ranks of dragon slayers</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <span className="text-amber-400">🪙</span>
          <span className="cinzel font-bold text-amber-400">{player.gold}</span>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">

        <div className="glass-panel rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ background: `${currentTier.color}20`, border: `2px solid ${currentTier.color}` }}>
              <Crown size={28} style={{ color: currentTier.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="cinzel font-black text-2xl" style={{ color: currentTier.color }}>
                  VIP {currentVip}
                </span>
                <span className="cinzel text-sm" style={{ color: currentTier.color }}>— {currentTier.title}</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1.5 flex-wrap">
                  {VIP_TIERS.map(t => (
                    <VipTierBadge key={t.level} tier={t} isCurrent={t.level === currentVip} isUnlocked={t.level <= currentVip} />
                  ))}
                </div>
              </div>
              {nextTier && (
                <>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-amber-700/60">Progress to VIP {nextTier.level}</span>
                    <span className="cinzel" style={{ color: nextTier.color }}>{Math.floor(progressToNext)}%</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }}>
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progressToNext}%`, background: `linear-gradient(90deg, ${currentTier.color}, ${nextTier.color})` }} />
                  </div>
                </>
              )}
              {!nextTier && (
                <div className="text-amber-400 cinzel text-sm font-bold">MAX VIP ACHIEVED — Dragon Emperor</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-amber-900/30">
            <div className="text-center">
              <div className="cinzel font-bold text-red-400">{currentTier.bonusAtk > 0 ? `+${currentTier.bonusAtk}` : '—'}</div>
              <div className="text-amber-800/60 text-xs">ATK Bonus</div>
            </div>
            <div className="text-center">
              <div className="cinzel font-bold text-blue-400">{currentTier.bonusDef > 0 ? `+${currentTier.bonusDef}` : '—'}</div>
              <div className="text-amber-800/60 text-xs">DEF Bonus</div>
            </div>
            <div className="text-center">
              <div className="cinzel font-bold text-green-400">{currentTier.bonusHpPercent > 0 ? `+${currentTier.bonusHpPercent}%` : '—'}</div>
              <div className="text-amber-800/60 text-xs">HP Bonus</div>
            </div>
            <div className="text-center">
              <div className="cinzel font-bold text-yellow-400">x{currentTier.goldMultiplier.toFixed(1)}</div>
              <div className="text-amber-800/60 text-xs">Gold Mult.</div>
            </div>
          </div>
        </div>

        <DiamondTopUp player={player} onUpdate={onUpdate} />

        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <Star size={14} className="text-amber-500" />
            <h3 className="cinzel font-bold text-amber-500 text-sm tracking-widest">VIP TIERS</h3>
            <div className="flex-1 h-px bg-amber-900/30" />
          </div>

          {VIP_TIERS.map((tier, idx) => {
            const isUnlocked = tier.level <= currentVip;
            const isCurrent = tier.level === currentVip;
            const prevTier = idx > 0 ? VIP_TIERS[idx - 1] : null;
            const requiredDiamonds = tier.level === 1 ? 0 : tier.diamondsRequired - (prevTier?.diamondsRequired ?? 0);
            const canUpgrade = tier.level === currentVip + 1 && player.diamonds >= requiredDiamonds;
            const isNext = tier.level === currentVip + 1;

            return (
              <div key={tier.level}
                className="rounded-xl p-4 transition-all duration-200"
                style={{
                  background: isCurrent ? `${tier.color}15` : isUnlocked ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.15)',
                  border: `1px solid ${isCurrent ? tier.color : isUnlocked ? `${tier.color}40` : 'rgba(100,80,0,0.15)'}`,
                  boxShadow: isCurrent ? `0 0 20px ${tier.color}20` : 'none',
                  opacity: !isUnlocked && !isNext ? 0.55 : 1,
                }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${tier.color}20`, border: `2px solid ${isUnlocked ? tier.color : `${tier.color}40`}` }}>
                    <Crown size={20} style={{ color: isUnlocked ? tier.color : `${tier.color}60` }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="cinzel font-black" style={{ color: tier.color }}>VIP {tier.level}</span>
                      <span className="cinzel text-sm text-amber-400/80">{tier.title}</span>
                      {isCurrent && (
                        <span className="text-xs cinzel px-2 py-0.5 rounded-full font-bold"
                          style={{ background: `${tier.color}30`, color: tier.color, border: `1px solid ${tier.color}` }}>
                          Current
                        </span>
                      )}
                      {isUnlocked && !isCurrent && (
                        <span className="text-xs text-green-500">Unlocked</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 mb-3">
                      {tier.benefits.map((b, i) => (
                        <div key={i} className="flex items-center gap-1 text-xs" style={{ color: isUnlocked ? tier.color : 'rgba(160,130,50,0.5)' }}>
                          <span>•</span> {b}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-xs flex-wrap">
                      <span className="text-amber-700/60">ATK <span className="cinzel text-red-400">+{tier.bonusAtk}</span></span>
                      <span className="text-amber-700/60">DEF <span className="cinzel text-blue-400">+{tier.bonusDef}</span></span>
                      <span className="text-amber-700/60">HP <span className="cinzel text-green-400">+{tier.bonusHpPercent}%</span></span>
                      <span className="text-amber-700/60">Gold <span className="cinzel text-yellow-400">x{tier.goldMultiplier.toFixed(1)}</span></span>
                      <span className="text-amber-700/60">EXP <span className="cinzel text-purple-400">x{tier.expMultiplier.toFixed(1)}</span></span>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    {tier.level === 1 ? (
                      <div className="cinzel text-green-400 text-sm font-bold">Free</div>
                    ) : isUnlocked ? (
                      <div className="cinzel text-green-400 text-sm">✓ Done</div>
                    ) : isNext ? (
                      <div>
                        <div className="flex items-center gap-1 justify-end mb-2">
                          <span className="text-blue-300">💎</span>
                          <span className="cinzel font-bold text-blue-300 text-sm">{requiredDiamonds}</span>
                        </div>
                        <button onClick={() => handleUpgrade(tier)}
                          disabled={!canUpgrade}
                          className="cinzel font-bold text-sm px-4 py-2 rounded-lg cursor-pointer transition-all btn-gold text-amber-900"
                          style={{ opacity: canUpgrade ? 1 : 0.4, cursor: canUpgrade ? 'pointer' : 'not-allowed' }}>
                          Upgrade
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <span className="text-blue-300/40">💎</span>
                        <span className="cinzel text-blue-300/40 text-sm">{tier.diamondsRequired}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
