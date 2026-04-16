import { useState } from 'react';
import { ChevronLeft, ShoppingBag, Crown } from 'lucide-react';
import { PlayerState, ShopItem, ShopItemRarity } from '../types/game';
import { SHOP_ITEMS } from '../lib/gameData';

interface Props {
  player: PlayerState;
  purchaseCounts: Record<string, number>;
  onPurchase: (item: ShopItem, updatedPlayer: PlayerState, updatedCounts: Record<string, number>) => void;
  onBack: () => void;
}

const RARITY_CONFIG: Record<ShopItemRarity, { label: string; color: string; bg: string; border: string; glow: string }> = {
  common: {
    label: 'Common',
    color: '#94a3b8',
    bg: 'rgba(148,163,184,0.08)',
    border: 'rgba(148,163,184,0.25)',
    glow: 'none',
  },
  rare: {
    label: 'Rare',
    color: '#60a5fa',
    bg: 'rgba(96,165,250,0.08)',
    border: 'rgba(96,165,250,0.3)',
    glow: 'none',
  },
  epic: {
    label: 'Epic',
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.35)',
    glow: '0 0 15px rgba(249,115,22,0.2)',
  },
  vip: {
    label: 'VIP',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.45)',
    glow: '0 0 20px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.1)',
  },
};

function applyItemEffect(item: ShopItem, player: PlayerState): PlayerState {
  const p = { ...player, buffs: { ...player.buffs } };

  switch (item.id) {
    case 'minor-hp-potion':
      p.hp = Math.min(p.maxHp, p.hp + 150);
      break;
    case 'major-hp-potion':
      p.hp = Math.min(p.maxHp, p.hp + 350);
      break;
    case 'mana-potion':
      p.mp = Math.min(p.maxMp, p.mp + 100);
      break;
    case 'full-restore':
      p.hp = p.maxHp;
      p.mp = p.maxMp;
      break;
    case 'attack-rune':
      p.buffs.attack += 20;
      break;
    case 'defense-rune':
      p.buffs.defense += 15;
      break;
    case 'speed-rune':
      p.buffs.speed += 20;
      break;
    case 'phoenix-feather':
      p.hasPhoenixFeather = true;
      break;
    case 'cooldown-reset':
      p.hasCooldownReset = true;
      break;
    case 'vip-dragon-heart':
      p.attack += 40;
      break;
    case 'vip-dragon-scale':
      p.defense += 25;
      break;
    case 'vip-dragon-soul':
      p.maxHp += 200;
      p.hp = Math.min(p.maxHp, p.hp + 200);
      break;
  }

  return p;
}

function ShopItemCard({
  item,
  playerGold,
  purchaseCount,
  onBuy,
}: {
  item: ShopItem;
  playerGold: number;
  purchaseCount: number;
  onBuy: () => void;
}) {
  const rarity = RARITY_CONFIG[item.rarity];
  const exhausted = item.maxPurchases !== -1 && purchaseCount >= item.maxPurchases;
  const canAfford = playerGold >= item.price;
  const disabled = exhausted || !canAfford;

  return (
    <div className="relative rounded-xl p-4 flex flex-col gap-2 transition-all duration-200"
      style={{
        background: rarity.bg,
        border: `1px solid ${rarity.border}`,
        boxShadow: exhausted ? 'none' : rarity.glow,
        opacity: exhausted ? 0.5 : 1,
      }}>

      {item.rarity === 'vip' && !exhausted && (
        <div className="absolute -top-2 -right-2">
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: '#d97706', color: '#1a0800', fontFamily: 'Cinzel, serif' }}>
            <Crown size={10} />
            VIP
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: 'rgba(0,0,0,0.4)', border: `1px solid ${rarity.border}` }}>
          {item.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="cinzel font-bold text-sm text-amber-200 truncate">{item.name}</span>
          </div>
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{ color: rarity.color, background: `${rarity.color}18` }}>
            {rarity.label}
          </span>
        </div>
      </div>

      <p className="text-amber-700/70 text-xs leading-relaxed">{item.description}</p>

      <div className="flex items-center justify-between mt-1 pt-2"
        style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <span className="text-xs font-bold px-2 py-1 rounded"
          style={{ color: rarity.color, background: `${rarity.color}15`, fontFamily: 'Cinzel, serif' }}>
          {item.effectLabel}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-amber-400 text-base">🪙</span>
          <span className="cinzel font-bold text-amber-400 text-base">{item.price}</span>
          {item.maxPurchases !== -1 && (
            <span className="text-amber-800/60 text-xs ml-1">
              ({item.maxPurchases - purchaseCount} left)
            </span>
          )}
        </div>

        {exhausted ? (
          <span className="cinzel text-amber-800/50 text-xs px-3 py-1.5 rounded"
            style={{ border: '1px solid rgba(100,80,0,0.2)' }}>
            Sold Out
          </span>
        ) : (
          <button onClick={onBuy} disabled={!canAfford}
            className={`cinzel font-bold text-xs px-4 py-1.5 rounded transition-all duration-150 cursor-pointer ${
              item.rarity === 'vip' ? 'btn-gold text-amber-900' : 'btn-fire text-red-100'
            }`}
            style={{ opacity: canAfford ? 1 : 0.4, cursor: canAfford ? 'pointer' : 'not-allowed' }}>
            Buy
          </button>
        )}
      </div>
    </div>
  );
}

const RARITY_ORDER: ShopItemRarity[] = ['vip', 'epic', 'rare', 'common'];
const CATEGORY_LABELS: Record<string, string> = {
  vip: 'VIP Exclusive',
  epic: 'Epic',
  rare: 'Rare',
  common: 'Standard',
};

export default function ShopScreen({ player, purchaseCounts, onPurchase, onBack }: Props) {
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [activeFilter, setActiveFilter] = useState<ShopItemRarity | 'all'>('all');

  function showToast(msg: string, ok: boolean) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 2200);
  }

  function handleBuy(item: ShopItem) {
    if (player.gold < item.price) {
      showToast('Not enough gold!', false);
      return;
    }
    const count = purchaseCounts[item.id] ?? 0;
    if (item.maxPurchases !== -1 && count >= item.maxPurchases) {
      showToast('Item sold out!', false);
      return;
    }

    const updatedPlayer = applyItemEffect(item, { ...player, gold: player.gold - item.price });
    const updatedCounts = { ...purchaseCounts, [item.id]: count + 1 };
    onPurchase(item, updatedPlayer, updatedCounts);
    showToast(`${item.name} purchased!`, true);
  }

  const filteredItems = activeFilter === 'all'
    ? SHOP_ITEMS
    : SHOP_ITEMS.filter(i => i.rarity === activeFilter);

  const grouped = RARITY_ORDER.reduce((acc, r) => {
    const items = filteredItems.filter(i => i.rarity === r);
    if (items.length > 0) acc[r] = items;
    return acc;
  }, {} as Record<ShopItemRarity, ShopItem[]>);

  const activeBuff = player.buffs.attack > 0 || player.buffs.defense > 0 || player.buffs.speed > 0;

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at top, #1a0e00 0%, #0a0500 50%, #050505 100%)' }}>

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl cinzel font-bold text-sm scale-in-anim"
          style={{
            background: toast.ok ? 'rgba(20,50,10,0.97)' : 'rgba(60,10,10,0.97)',
            border: `1px solid ${toast.ok ? '#22c55e' : '#ef4444'}`,
            color: toast.ok ? '#4ade80' : '#f87171',
            boxShadow: `0 0 20px ${toast.ok ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`,
          }}>
          {toast.msg}
        </div>
      )}

      <div className="glass-dark border-b border-amber-900/30 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <button onClick={onBack}
            className="flex items-center gap-1 text-amber-600 hover:text-amber-400 transition-colors cursor-pointer">
            <ChevronLeft size={18} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex-1 text-center">
            <div className="flex items-center justify-center gap-2">
              <Crown size={18} className="text-amber-400" />
              <h2 className="cinzel font-bold text-amber-400 text-lg tracking-widest">VIP DRAGON SHOP</h2>
              <Crown size={18} className="text-amber-400" />
            </div>
            <p className="text-amber-700/60 text-xs italic">Exclusive wares for the mightiest of champions</p>
          </div>
          <div className="flex items-center gap-2 bg-amber-900/20 px-4 py-2 rounded-lg"
            style={{ border: '1px solid rgba(212,160,23,0.3)' }}>
            <span className="text-amber-400 text-base">🪙</span>
            <span className="cinzel font-bold text-amber-400 text-lg">{player.gold}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="glass-panel rounded-xl p-4">
            <p className="cinzel text-amber-700/60 text-xs tracking-widest mb-2">HERO STATUS</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm">
                <span className="text-amber-600/70">HP</span>
                <span className="text-green-400">{player.hp} / {player.maxHp}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600/70">MP</span>
                <span className="text-blue-400">{player.mp} / {player.maxMp}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600/70">ATK</span>
                <span className="text-red-400">{player.attack}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-amber-600/70">DEF</span>
                <span className="text-blue-300">{player.defense}</span>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="cinzel text-amber-700/60 text-xs tracking-widest mb-2">BATTLE BUFFS</p>
            {activeBuff ? (
              <div className="space-y-1.5">
                {player.buffs.attack > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600/70">ATK Buff</span>
                    <span className="text-green-400 font-bold">+{player.buffs.attack}</span>
                  </div>
                )}
                {player.buffs.defense > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600/70">DEF Buff</span>
                    <span className="text-green-400 font-bold">+{player.buffs.defense}</span>
                  </div>
                )}
                {player.buffs.speed > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-amber-600/70">SPD Buff</span>
                    <span className="text-green-400 font-bold">+{player.buffs.speed}</span>
                  </div>
                )}
                <p className="text-amber-700/50 text-xs italic">Active next battle</p>
              </div>
            ) : (
              <p className="text-amber-800/50 text-sm italic">No active buffs</p>
            )}
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="cinzel text-amber-700/60 text-xs tracking-widest mb-2">SPECIAL ITEMS</p>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-600/70">Phoenix Feather</span>
                {player.hasPhoenixFeather
                  ? <span className="text-orange-400">🪶 Ready</span>
                  : <span className="text-amber-900/50">None</span>}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-amber-600/70">Void Hourglass</span>
                {player.hasCooldownReset
                  ? <span className="text-blue-400">⏳ Ready</span>
                  : <span className="text-amber-900/50">None</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5">
          <ShoppingBag size={16} className="text-amber-600" />
          <span className="cinzel text-amber-600 text-xs tracking-widest">FILTER BY RARITY</span>
          <div className="flex gap-2 ml-2">
            {(['all', ...RARITY_ORDER] as (ShopItemRarity | 'all')[]).map(r => (
              <button key={r} onClick={() => setActiveFilter(r)}
                className="px-3 py-1 rounded-full text-xs cinzel transition-all duration-150 cursor-pointer"
                style={{
                  background: activeFilter === r ? (r === 'all' ? '#d97706' : RARITY_CONFIG[r as ShopItemRarity]?.color) : 'rgba(20,8,0,0.6)',
                  color: activeFilter === r ? (r === 'vip' || r === 'all' ? '#1a0800' : '#fff') : '#92400e',
                  border: `1px solid ${activeFilter === r ? 'transparent' : 'rgba(120,53,15,0.3)'}`,
                  fontWeight: activeFilter === r ? 700 : 400,
                }}>
                {r === 'all' ? 'All' : CATEGORY_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {Object.entries(grouped).map(([rarity, items]) => (
          <div key={rarity} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {rarity === 'vip' && <Crown size={16} className="text-amber-400" />}
              <h3 className="cinzel font-bold text-sm tracking-widest"
                style={{ color: RARITY_CONFIG[rarity as ShopItemRarity].color }}>
                {CATEGORY_LABELS[rarity]} Items
              </h3>
              <div className="flex-1 h-px" style={{ background: `${RARITY_CONFIG[rarity as ShopItemRarity].color}30` }} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(item => (
                <ShopItemCard
                  key={item.id}
                  item={item}
                  playerGold={player.gold}
                  purchaseCount={purchaseCounts[item.id] ?? 0}
                  onBuy={() => handleBuy(item)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
