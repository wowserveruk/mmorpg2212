import { useEffect, useRef, useState } from 'react';
import { Shield, Zap, Eye, Heart } from 'lucide-react';
import { Dragon, PlayerState, BattleLogEntry, Skill } from '../types/game';
import { calculateDamage, calculateEnemyDamage, getPetById } from '../lib/gameData';

interface Props {
  player: PlayerState;
  dragon: Dragon;
  onVictory: (player: PlayerState, expGained: number, goldGained: number) => void;
  onDefeat: () => void;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  Sword: <span>⚔</span>,
  Zap: <Zap size={14} />,
  Flame: <span>🔥</span>,
  Skull: <span>💀</span>,
  Circle: <span>●</span>,
  Star: <span>★</span>,
  Target: <span>◎</span>,
  Eye: <Eye size={14} />,
  Heart: <Heart size={14} />,
  Shield: <Shield size={14} />,
};

function DragonSprite({ dragon, isAttacking, isTakingHit }: {
  dragon: Dragon;
  isAttacking: boolean;
  isTakingHit: boolean;
}) {
  const c = dragon.color;
  const darkC = '#0d0404';
  const midC = '#1a0808';

  const attackEmoji =
    dragon.id === 'frost-wyrm' ? '❄️' :
    dragon.id === 'storm-serpent' ? '⚡' :
    dragon.id === 'molten-colossus' ? '🌋' :
    dragon.id === 'ancient-dragon' ? '💀' : '🔥';

  return (
    <div className={`relative mx-auto float-slow-anim ${isAttacking ? 'dragon-attack-anim' : ''} ${isTakingHit ? 'shake-anim' : ''}`}
      style={{ width: 260, height: 220 }}>
      <svg viewBox="0 0 260 220" className="w-full h-full">
        <defs>
          <radialGradient id={`bg-${dragon.id}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={c} stopOpacity="0.35" />
            <stop offset="60%" stopColor={c} stopOpacity="0.12" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`wingL-${dragon.id}`} cx="80%" cy="30%" r="70%">
            <stop offset="0%" stopColor={c} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c} stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id={`wingR-${dragon.id}`} cx="20%" cy="30%" r="70%">
            <stop offset="0%" stopColor={c} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c} stopOpacity="0.15" />
          </radialGradient>
          <filter id={`dragonGlowBattle-${dragon.id}`}>
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id={`eyeGlow-${dragon.id}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <ellipse cx="130" cy="115" rx="118" ry="100" fill={`url(#bg-${dragon.id})`} />

        <g filter={`url(#dragonGlowBattle-${dragon.id})`}>
          <path d="M88 90 C65 68, 28 45, 5 22 C2 45, 8 72, 22 96 C36 118, 58 128, 82 125 Z"
            fill={`url(#wingL-${dragon.id})`} stroke={c} strokeWidth="1.5" opacity="0.92" />
          <line x1="88" y1="90" x2="5" y2="22" stroke={c} strokeWidth="1.2" opacity="0.7" />
          <line x1="88" y1="90" x2="14" y2="62" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="88" y1="90" x2="28" y2="100" stroke={c} strokeWidth="0.8" opacity="0.4" />
          <circle cx="5" cy="22" r="2.5" fill={c} opacity="0.8" />
          <circle cx="14" cy="62" r="1.8" fill={c} opacity="0.6" />
          <circle cx="28" cy="100" r="1.5" fill={c} opacity="0.5" />

          <path d="M172 90 C195 68, 232 45, 255 22 C258 45, 252 72, 238 96 C224 118, 202 128, 178 125 Z"
            fill={`url(#wingR-${dragon.id})`} stroke={c} strokeWidth="1.5" opacity="0.92" />
          <line x1="172" y1="90" x2="255" y2="22" stroke={c} strokeWidth="1.2" opacity="0.7" />
          <line x1="172" y1="90" x2="246" y2="62" stroke={c} strokeWidth="1" opacity="0.5" />
          <line x1="172" y1="90" x2="232" y2="100" stroke={c} strokeWidth="0.8" opacity="0.4" />
          <circle cx="255" cy="22" r="2.5" fill={c} opacity="0.8" />
          <circle cx="246" cy="62" r="1.8" fill={c} opacity="0.6" />
          <circle cx="232" cy="100" r="1.5" fill={c} opacity="0.5" />
        </g>

        <g filter={`url(#dragonGlowBattle-${dragon.id})`} stroke={c} strokeWidth="2">
          <path d="M130 175 Q108 155 90 126 Q74 100 82 76 Q90 56 112 50 Q130 46 148 52 Q168 47 176 68 Q188 88 176 118 Q162 150 130 175Z"
            fill={midC} />
          <path d="M112 50 Q92 24 72 14 Q58 20 65 42 Q70 58 86 62Z" fill={darkC} stroke={c} />
          <path d="M148 52 Q168 28 186 18 Q200 24 195 46 Q190 62 172 62Z" fill={darkC} stroke={c} />
          <path d="M82 76 Q52 64 36 76 Q26 92 42 102 Q60 108 80 100 Q88 90 85 80Z" fill={darkC} />
          <path d="M90 126 Q60 140 46 164 Q38 185 56 190 Q75 194 90 178 Q102 162 96 144Z" fill={darkC} />
          <path d="M176 118 Q208 114 222 130 Q230 146 218 154 Q202 160 186 150 Q176 138 178 126Z" fill={darkC} />
          <path d="M130 175 Q118 196 112 212 Q106 222 120 224 Q135 226 138 210 Q142 194 138 178Z" fill={darkC} />
          <path d="M95 80 Q104 70 110 74 Q116 70 125 80" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6" />
          <path d="M135 80 Q144 70 150 74 Q156 70 165 80" stroke={c} strokeWidth="1.5" fill="none" opacity="0.6" />
        </g>

        <g filter={`url(#eyeGlow-${dragon.id})`}>
          <circle cx="108" cy="84" r="8" fill="#ff2200" />
          <circle cx="152" cy="84" r="8" fill="#ff2200" />
          <circle cx="108" cy="84" r="5" fill="#ff8800" />
          <circle cx="152" cy="84" r="5" fill="#ff8800" />
          <circle cx="108" cy="84" r="2.5" fill="#ffffff" />
          <circle cx="152" cy="84" r="2.5" fill="#ffffff" />
        </g>

        <g stroke={c} strokeWidth="1" fill="none" opacity="0.5">
          <line x1="116" y1="120" x2="106" y2="130" />
          <line x1="126" y1="122" x2="120" y2="134" />
          <line x1="136" y1="122" x2="140" y2="134" />
          <line x1="146" y1="120" x2="154" y2="130" />
        </g>

        <path d="M116 108 Q128 116 130 112 Q132 116 144 108" stroke={c} strokeWidth="2" fill="none" />
      </svg>

      {isAttacking && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-5xl scale-in-anim">{attackEmoji}</div>
        </div>
      )}
    </div>
  );
}

function PlayerSprite({ player, isAttacking, isTakingHit }: {
  player: PlayerState;
  isAttacking: boolean;
  isTakingHit: boolean;
}) {
  return (
    <div className={`relative w-36 h-36 mx-auto ${isAttacking ? 'player-attack-anim' : ''} ${isTakingHit ? 'shake-anim' : ''}`}>
      <svg viewBox="0 0 120 140" className="w-full h-full" fill="none">
        <defs>
          <filter id="heroGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <g filter="url(#heroGlow)">
          <circle cx="60" cy="22" r="14" fill="#2a1008" stroke={player.color} strokeWidth="1.5" />
          <ellipse cx="60" cy="22" rx="8" ry="10" fill="#3d1810" />
          <circle cx="55" cy="20" r="2.5" fill={player.accentColor} />
          <circle cx="65" cy="20" r="2.5" fill={player.accentColor} />
          <path d="M48 12 Q52 6 60 8 Q68 6 72 12" stroke={player.color} strokeWidth="1.5" fill="none" />
          <path d="M52 40 Q60 38 68 40 L72 75 Q60 78 48 75Z" fill="#2a1008" stroke={player.color} strokeWidth="1" />
          <rect x="47" y="43" width="5" height="18" rx="2" fill="#1a0808" stroke={player.color} strokeWidth="1" />
          <rect x="68" y="43" width="5" height="18" rx="2" fill="#1a0808" stroke={player.color} strokeWidth="1" />
          <path d="M48 75 L44 110 L52 112 L60 85 L68 112 L76 110 L72 75Z" fill="#2a1008" stroke={player.color} strokeWidth="1" />
          {player.classId === 'dragon-knight' && (
            <>
              <rect x="36" y="35" width="8" height="45" rx="2" fill="#0d0505" stroke={player.color} strokeWidth="1.5" />
              <path d="M32 32 Q36 28 40 32" stroke={player.color} strokeWidth="1.5" fill="none" />
              <rect x="40" y="40" width="6" height="30" rx="1" fill="#1a0808" stroke={player.color} strokeWidth="1" />
            </>
          )}
          {player.classId === 'fire-mage' && (
            <>
              <line x1="76" y1="70" x2="90" y2="40" stroke={player.accentColor} strokeWidth="2" />
              <circle cx="90" cy="36" r="5" fill={player.color} style={{ boxShadow: `0 0 10px ${player.color}` }} />
            </>
          )}
          {player.classId === 'shadow-archer' && (
            <>
              <path d="M38 50 Q36 60 38 70" stroke={player.accentColor} strokeWidth="1.5" fill="none" />
              <line x1="38" y1="50" x2="38" y2="70" stroke={player.color} strokeWidth="2" />
              <line x1="42" y1="55" x2="32" y2="65" stroke={player.accentColor} strokeWidth="1" />
            </>
          )}
          {player.classId === 'holy-paladin' && (
            <>
              <path d="M76 42 Q84 36 80 28 Q92 32 88 44 Q96 40 94 52 Q86 50 84 58 Q78 52 70 56 Q72 46 76 42Z" fill="#0d0808" stroke={player.accentColor} strokeWidth="1.5" />
            </>
          )}
        </g>
        <circle cx="60" cy="128" rx="25" ry="5" fill="rgba(0,0,0,0.4)" />
      </svg>
    </div>
  );
}

function StatBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.max(0, (value / max) * 100);
  const warningColor = pct < 25 ? '#ef4444' : pct < 50 ? '#f59e0b' : color;

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-amber-600/70">{label}</span>
        <span style={{ color: warningColor }}>{value} / {max}</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
        <div className="h-full rounded-full hp-bar-fill transition-all duration-500"
          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${warningColor}aa, ${warningColor})` }} />
      </div>
    </div>
  );
}

export default function BattleArena({ player: initialPlayer, dragon: initialDragon, onVictory, onDefeat }: Props) {
  const activePet = getPetById(initialPlayer.activePetId ?? null);
  const effectiveAttack = initialPlayer.attack + (initialPlayer.buffs?.attack ?? 0) + (activePet?.bonusAtk ?? 0);
  const effectiveDefense = initialPlayer.defense + (initialPlayer.buffs?.defense ?? 0) + (activePet?.bonusDef ?? 0);
  const effectiveMaxHp = initialPlayer.maxHp + (activePet?.bonusHp ?? 0);

  const [player, setPlayer] = useState<PlayerState>({
    ...initialPlayer,
    attack: effectiveAttack,
    defense: effectiveDefense,
    maxHp: effectiveMaxHp,
    hp: Math.min(initialPlayer.hp + (activePet?.bonusHp ?? 0), effectiveMaxHp),
  });
  const [dragon, setDragon] = useState<Dragon>({
    ...initialDragon,
    abilities: initialDragon.abilities.map(a => ({ ...a })),
  });
  const [skills, setSkills] = useState<Skill[]>(
    initialPlayer.skills.map(s => ({ ...s, currentCooldown: initialPlayer.hasCooldownReset ? 0 : s.currentCooldown }))
  );
  const [hasFeather, setHasFeather] = useState(initialPlayer.hasPhoenixFeather);
  const initLog: BattleLogEntry[] = [
    { id: 0, message: `${initialDragon.name} the ${initialDragon.title} appears!`, type: 'system' },
    { id: 1, message: 'Prepare for battle, hero!', type: 'system' },
  ];
  if (initialPlayer.buffs?.attack > 0 || initialPlayer.buffs?.defense > 0) {
    initLog.push({ id: 2, message: `Battle buffs activated! ATK +${initialPlayer.buffs.attack} DEF +${initialPlayer.buffs.defense}`, type: 'heal' });
  }
  if (initialPlayer.hasCooldownReset) {
    initLog.push({ id: 3, message: 'Void Hourglass activated! All cooldowns reset!', type: 'heal' });
  }
  if (initialPlayer.hasPhoenixFeather) {
    initLog.push({ id: 4, message: 'Phoenix Feather ready! You will be revived if you fall.', type: 'heal' });
  }
  if (activePet) {
    initLog.push({ id: 5, message: `${activePet.name} joins the battle! (+${activePet.bonusAtk} ATK, +${activePet.bonusDef} DEF, +${activePet.bonusHp} HP)`, type: 'heal' });
  }
  const [log, setLog] = useState<BattleLogEntry[]>(initLog);
  const [logId, setLogId] = useState(initLog.length);
  const [phase, setPhase] = useState<'player' | 'enemy' | 'done'>('player');
  const [playerAnim, setPlayerAnim] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [dragonAnim, setDragonAnim] = useState<'idle' | 'attack' | 'hit'>('idle');
  const [floatDmg, setFloatDmg] = useState<{ id: number; value: number; x: number; crit: boolean; isHeal: boolean } | null>(null);
  const [floatId, setFloatId] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  function addLog(message: string, type: BattleLogEntry['type']) {
    setLog(prev => [...prev, { id: logId, message, type }]);
    setLogId(prev => prev + 1);
  }

  function showFloatingDamage(value: number, isCrit: boolean, isHeal = false) {
    const id = floatId + 1;
    setFloatId(id);
    setFloatDmg({ id, value, x: 40 + Math.random() * 20, crit: isCrit, isHeal });
    setTimeout(() => setFloatDmg(null), 900);
  }

  async function useSkill(skill: Skill, skillIndex: number) {
    if (phase !== 'player') return;
    if (skill.mpCost > player.mp) {
      addLog('Not enough MP!', 'system');
      return;
    }
    if (skill.currentCooldown > 0) {
      addLog(`${skill.name} is on cooldown!`, 'system');
      return;
    }

    setPhase('enemy');

    const updatedSkills = skills.map((s, i) => ({
      ...s,
      currentCooldown: i === skillIndex
        ? s.cooldown
        : s.currentCooldown > 0 ? s.currentCooldown - 1 : 0,
    }));
    setSkills(updatedSkills);

    let newPlayerHp = player.hp;
    let newPlayerMp = Math.max(0, player.mp - skill.mpCost);

    if (skill.type === 'heal') {
      const healAmt = Math.abs(skill.damage);
      newPlayerHp = Math.min(player.maxHp, player.hp + healAmt);
      setPlayerAnim('attack');
      setTimeout(() => setPlayerAnim('idle'), 500);
      addLog(`${player.name} uses ${skill.name}! Restores ${healAmt} HP!`, 'heal');
      showFloatingDamage(healAmt, false, true);
    } else {
      const isCrit = Math.random() < 0.15;
      const dmg = calculateDamage(player.attack, skill.damage, dragon.defense, skill.id === 'death-mark');
      const finalDmg = isCrit ? Math.floor(dmg * 1.5) : dmg;

      setPlayerAnim('attack');
      setTimeout(() => { setPlayerAnim('idle'); setDragonAnim('hit'); }, 300);
      setTimeout(() => setDragonAnim('idle'), 800);

      const critText = isCrit ? ' CRITICAL HIT!' : '';
      addLog(`${player.name} uses ${skill.name}! Deals ${finalDmg} damage!${critText}`, isCrit ? 'critical' : 'player');
      showFloatingDamage(finalDmg, isCrit);

      const newDragonHp = Math.max(0, dragon.hp - finalDmg);
      setDragon(prev => ({ ...prev, hp: newDragonHp }));

      if (newDragonHp <= 0) {
        setPhase('done');
        setTimeout(() => {
          addLog(`${dragon.name} has been slain!`, 'system');
          setTimeout(() => {
            const finalPlayer = {
              ...player,
              hp: newPlayerHp,
              mp: newPlayerMp,
              skills: updatedSkills,
              exp: player.exp + dragon.rewardExp,
              gold: player.gold + dragon.rewardGold,
              diamonds: player.diamonds + (dragon.rewardDiamonds ?? 0),
              attack: initialPlayer.attack,
              defense: initialPlayer.defense,
              maxHp: initialPlayer.maxHp,
              buffs: { attack: 0, defense: 0, speed: 0 },
              hasPhoenixFeather: false,
              hasCooldownReset: false,
            };
            onVictory(finalPlayer, dragon.rewardExp, dragon.rewardGold);
          }, 1500);
        }, 600);
        setPlayer(prev => ({ ...prev, hp: newPlayerHp, mp: newPlayerMp, skills: updatedSkills }));
        return;
      }
    }

    setPlayer(prev => ({ ...prev, hp: newPlayerHp, mp: newPlayerMp, skills: updatedSkills }));

    setTimeout(() => {
      const ability = dragon.abilities[Math.floor(Math.random() * dragon.abilities.length)];
      const dmgDealt = calculateEnemyDamage(dragon.attack, ability.damage, player.defense);

      setDragonAnim('attack');
      setTimeout(() => { setDragonAnim('idle'); setPlayerAnim('hit'); }, 400);
      setTimeout(() => setPlayerAnim('idle'), 900);

      addLog(`${dragon.name} uses ${ability.name}! Deals ${dmgDealt} damage!`, 'enemy');

      const afterHp = Math.max(0, newPlayerHp - dmgDealt);
      setPlayer(prev => ({ ...prev, hp: afterHp }));

      if (afterHp <= 0) {
        if (hasFeather) {
          setHasFeather(false);
          const reviveHp = Math.floor(player.maxHp * 0.5);
          setPlayer(prev => ({ ...prev, hp: reviveHp, hasPhoenixFeather: false }));
          addLog('The Phoenix Feather burns bright! You are revived!', 'heal');
          setPlayerAnim('idle');
          const refreshedSkills2 = updatedSkills.map(s => ({
            ...s, currentCooldown: s.currentCooldown > 0 ? s.currentCooldown - 1 : 0,
          }));
          setSkills(refreshedSkills2);
          setPlayer(prev => ({ ...prev, hp: reviveHp, mp: Math.min(prev.maxMp, prev.mp + 8), skills: refreshedSkills2 }));
          setPhase('player');
          return;
        }
        setPhase('done');
        addLog('You have fallen in battle...', 'system');
        setTimeout(onDefeat, 1500);
        return;
      }

      const refreshedSkills = updatedSkills.map(s => ({
        ...s, currentCooldown: s.currentCooldown > 0 ? s.currentCooldown - 1 : 0,
      }));
      setSkills(refreshedSkills);

      let mpRegen = 8;
      setPlayer(prev => ({ ...prev, mp: Math.min(prev.maxMp, prev.mp + mpRegen), skills: refreshedSkills }));
      setPhase('player');
    }, 1200);
  }

  const hpPct = (dragon.hp / dragon.maxHp) * 100;
  const dragonHpColor = hpPct < 25 ? '#ef4444' : hpPct < 50 ? '#f59e0b' : dragon.color;

  return (
    <div className="min-h-screen flex flex-col"
      style={{
        background: `radial-gradient(ellipse at center, rgba(${
          dragon.id === 'fire-drake' ? '80,10,0' :
          dragon.id === 'frost-wyrm' ? '0,30,60' : '20,0,40'
        },0.6) 0%, #050505 70%)`,
      }}>

      <div className="glass-dark border-b border-amber-900/30 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="cinzel text-amber-700/60 text-xs tracking-widest">BATTLE</div>
          <div className="cinzel text-amber-400 font-bold text-sm">{player.name} vs {dragon.name}</div>
          <div className="cinzel text-amber-700/60 text-xs">{phase === 'player' ? 'Your Turn' : 'Enemy Turn'}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 gap-4">

        <div className="glass-panel rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 rounded-full" style={{ background: dragon.color }} />
            <span className="cinzel font-bold text-sm" style={{ color: dragon.color }}>{dragon.name}</span>
            <span className="text-amber-700/50 text-xs italic">{dragon.title}</span>
            <span className="ml-auto text-amber-700/50 text-xs">Lv.{dragon.level}</span>
          </div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-amber-600/70">HP</span>
            <span style={{ color: dragonHpColor }}>{dragon.hp} / {dragon.maxHp}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="h-full rounded-full hp-bar-fill"
              style={{ width: `${hpPct}%`, background: `linear-gradient(90deg, ${dragonHpColor}80, ${dragonHpColor})` }} />
          </div>
        </div>

        <div className="flex-1 flex gap-4 min-h-0">
          <div className="flex-1 flex flex-col justify-center items-center relative">
            <div className="relative">
              <DragonSprite dragon={dragon} isAttacking={dragonAnim === 'attack'} isTakingHit={dragonAnim === 'hit'} />
              {floatDmg && (
                <div className="absolute pointer-events-none cinzel font-black text-xl"
                  style={{
                    left: `${floatDmg.x}%`,
                    top: '10%',
                    color: floatDmg.isHeal ? '#22c55e' : floatDmg.crit ? '#fbbf24' : '#ef4444',
                    textShadow: floatDmg.crit ? '0 0 15px #fbbf24' : 'none',
                    animation: 'damage-float 0.9s ease-out forwards',
                    animationFillMode: 'forwards',
                  }}>
                  {floatDmg.isHeal ? '+' : '-'}{floatDmg.value}
                  {floatDmg.crit && <span className="text-sm ml-1">CRIT!</span>}
                </div>
              )}
            </div>
          </div>

          <div className="w-64 flex flex-col gap-3">
            <div className="glass-panel rounded-xl p-4">
              <PlayerSprite player={player} isAttacking={playerAnim === 'attack'} isTakingHit={playerAnim === 'hit'} />
              <div className="mt-3 space-y-2">
                <StatBar value={player.hp} max={player.maxHp} color="#22c55e" label="HP" />
                <StatBar value={player.mp} max={player.maxMp} color="#3b82f6" label="MP" />
              </div>
              {(initialPlayer.buffs?.attack > 0 || initialPlayer.buffs?.defense > 0 || hasFeather || activePet) && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {initialPlayer.buffs?.attack > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded text-green-300 font-bold"
                      style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                      ⚔ +{initialPlayer.buffs.attack}
                    </span>
                  )}
                  {initialPlayer.buffs?.defense > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded text-blue-300 font-bold"
                      style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)' }}>
                      🛡 +{initialPlayer.buffs.defense}
                    </span>
                  )}
                  {hasFeather && (
                    <span className="text-xs px-1.5 py-0.5 rounded text-orange-300 font-bold"
                      style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
                      🪶 Feather
                    </span>
                  )}
                  {activePet && (
                    <span className="text-xs px-1.5 py-0.5 rounded font-bold cinzel"
                      style={{ background: `${activePet.color}20`, border: `1px solid ${activePet.color}60`, color: activePet.accentColor }}>
                      🐾 {activePet.name}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="glass-panel rounded-xl p-3 flex-1 overflow-y-auto scrollbar-dark"
              ref={logRef} style={{ maxHeight: 160 }}>
              <p className="cinzel text-amber-700/50 text-xs mb-2 tracking-widest">BATTLE LOG</p>
              <div className="space-y-1">
                {log.slice(-12).map(entry => (
                  <p key={entry.id} className="text-xs leading-relaxed"
                    style={{
                      color: entry.type === 'player' ? '#fbbf24'
                        : entry.type === 'enemy' ? '#f87171'
                        : entry.type === 'heal' ? '#4ade80'
                        : entry.type === 'critical' ? '#fde68a'
                        : '#92400e',
                    }}>
                    {entry.message}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-xl p-4">
          <p className="cinzel text-amber-700/50 text-xs mb-3 tracking-widest">ABILITIES</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {skills.map((skill, i) => {
              const onCd = skill.currentCooldown > 0;
              const noMp = skill.mpCost > player.mp;
              const disabled = phase !== 'player' || onCd || (noMp && skill.type !== 'heal');

              return (
                <button key={skill.id} onClick={() => useSkill(skill, i)}
                  disabled={disabled}
                  className="relative rounded-lg p-3 text-left transition-all duration-200"
                  style={{
                    background: disabled ? 'rgba(0,0,0,0.3)' : `${player.color}15`,
                    border: disabled ? '1px solid rgba(100,100,100,0.2)' : `1px solid ${player.color}40`,
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    opacity: disabled ? 0.5 : 1,
                  }}
                  onMouseEnter={e => !disabled && ((e.currentTarget as HTMLElement).style.background = `${player.color}28`)}
                  onMouseLeave={e => !disabled && ((e.currentTarget as HTMLElement).style.background = `${player.color}15`)}>

                  <div className="flex items-center gap-1.5 mb-1" style={{ color: player.accentColor }}>
                    {SKILL_ICONS[skill.icon]}
                    <span className="cinzel text-xs font-bold">{skill.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {skill.damage > 0 && (
                      <span className="text-xs" style={{ color: player.color }}>
                        {skill.damage} DMG
                      </span>
                    )}
                    {skill.damage < 0 && (
                      <span className="text-xs text-green-400">{Math.abs(skill.damage)} HEAL</span>
                    )}
                    {skill.mpCost > 0 && (
                      <span className="text-xs text-blue-400">{skill.mpCost} MP</span>
                    )}
                  </div>

                  {onCd && (
                    <div className="absolute inset-0 flex items-center justify-center rounded-lg"
                      style={{ background: 'rgba(0,0,0,0.7)' }}>
                      <span className="cinzel text-amber-500 font-bold text-sm">CD {skill.currentCooldown}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
