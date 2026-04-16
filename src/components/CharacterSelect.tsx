import { useState } from 'react';
import { Shield, Zap, Eye, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { CHARACTER_CLASSES } from '../lib/gameData';
import { CharacterClass } from '../types/game';

interface Props {
  onSelect: (cls: CharacterClass, name: string) => void;
  onBack: () => void;
}

const SKILL_ICONS: Record<string, React.ReactNode> = {
  Sword: <span className="text-base">⚔</span>,
  Zap: <Zap size={14} />,
  Flame: <span className="text-base">🔥</span>,
  Skull: <span className="text-base">💀</span>,
  Circle: <span className="text-base">●</span>,
  Star: <span className="text-base">★</span>,
  Target: <span className="text-base">◎</span>,
  Eye: <Eye size={14} />,
  Heart: <Heart size={14} />,
  Shield: <Shield size={14} />,
};

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-amber-500/70 text-sm w-16 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-500"
          style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="text-amber-200/60 text-xs w-8 text-right">{value}</span>
    </div>
  );
}

function ClassCard({ cls, selected, onClick }: { cls: CharacterClass; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="relative rounded-xl p-5 text-left w-full transition-all duration-300 cursor-pointer"
      style={{
        background: selected
          ? `linear-gradient(135deg, rgba(30,12,0,0.95), rgba(20,8,0,0.95))`
          : 'rgba(15,5,0,0.6)',
        border: selected ? `2px solid ${cls.color}` : '2px solid rgba(212,160,23,0.1)',
        boxShadow: selected ? `0 0 30px ${cls.color}40, 0 0 60px ${cls.color}20` : 'none',
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}>

      {selected && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full" style={{ background: cls.color, boxShadow: `0 0 8px ${cls.color}` }} />
        </div>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl shrink-0"
          style={{ background: `${cls.color}25`, border: `1px solid ${cls.color}50` }}>
          {cls.id === 'dragon-knight' && '⚔'}
          {cls.id === 'fire-mage' && '🔥'}
          {cls.id === 'shadow-archer' && '🏹'}
          {cls.id === 'holy-paladin' && '✦'}
        </div>
        <div>
          <div className="cinzel font-bold text-sm" style={{ color: cls.accentColor }}>{cls.name}</div>
          <div className="text-amber-600/60 text-xs italic">{cls.title}</div>
        </div>
      </div>

      <p className="text-amber-200/60 text-xs leading-relaxed mb-3">{cls.description}</p>

      <div className="space-y-1.5">
        <StatBar label="HP" value={cls.maxHp} max={800} color="#22c55e" />
        <StatBar label="ATK" value={cls.attack} max={100} color={cls.color} />
        <StatBar label="DEF" value={cls.defense} max={60} color="#3b82f6" />
        <StatBar label="SPD" value={cls.speed} max={100} color="#a78bfa" />
      </div>
    </button>
  );
}

export default function CharacterSelect({ onSelect, onBack }: Props) {
  const [selectedClass, setSelectedClass] = useState<CharacterClass>(CHARACTER_CLASSES[0]);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');

  function handleStart() {
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError('Enter your hero name to begin.');
      return;
    }
    if (trimmed.length < 2) {
      setNameError('Name must be at least 2 characters.');
      return;
    }
    onSelect(selectedClass, trimmed);
  }

  function cycleClass(dir: 1 | -1) {
    const idx = CHARACTER_CLASSES.indexOf(selectedClass);
    const next = (idx + dir + CHARACTER_CLASSES.length) % CHARACTER_CLASSES.length;
    setSelectedClass(CHARACTER_CLASSES[next]);
  }

  return (
    <div className="min-h-screen flex flex-col"
      style={{ background: 'radial-gradient(ellipse at top, #150800 0%, #080300 50%, #050505 100%)' }}>

      <div className="glass-dark border-b border-amber-900/30 px-6 py-4 flex items-center gap-4">
        <button onClick={onBack}
          className="flex items-center gap-1 text-amber-600 hover:text-amber-400 transition-colors cursor-pointer">
          <ChevronLeft size={18} />
          <span className="text-sm">Back</span>
        </button>
        <div className="flex-1 text-center">
          <h2 className="cinzel font-bold text-amber-400 text-lg tracking-widest">CHOOSE YOUR HERO</h2>
        </div>
        <div className="w-16" />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto w-full">
        <div className="lg:w-2/5 space-y-3">
          <div className="flex items-center justify-between mb-4 lg:hidden">
            <button onClick={() => cycleClass(-1)} className="p-2 text-amber-500 hover:text-amber-300 cursor-pointer">
              <ChevronLeft size={24} />
            </button>
            <span className="cinzel text-amber-400 text-sm tracking-wider">SELECT CLASS</span>
            <button onClick={() => cycleClass(1)} className="p-2 text-amber-500 hover:text-amber-300 cursor-pointer">
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="hidden lg:block">
            <p className="cinzel text-amber-600/60 text-xs tracking-widest mb-3">SELECT CLASS</p>
          </div>

          <div className="hidden lg:grid grid-cols-1 gap-3">
            {CHARACTER_CLASSES.map(cls => (
              <ClassCard key={cls.id} cls={cls} selected={selectedClass.id === cls.id}
                onClick={() => setSelectedClass(cls)} />
            ))}
          </div>

          <div className="lg:hidden">
            <ClassCard cls={selectedClass} selected={true} onClick={() => {}} />
          </div>
        </div>

        <div className="lg:w-3/5 flex flex-col gap-5">
          <div className="glass-panel rounded-xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl"
                style={{ background: `${selectedClass.color}20`, border: `2px solid ${selectedClass.color}60` }}>
                {selectedClass.id === 'dragon-knight' && '⚔'}
                {selectedClass.id === 'fire-mage' && '🔥'}
                {selectedClass.id === 'shadow-archer' && '🏹'}
                {selectedClass.id === 'holy-paladin' && '✦'}
              </div>
              <div>
                <h3 className="cinzel font-bold text-2xl" style={{ color: selectedClass.accentColor }}>
                  {selectedClass.name}
                </h3>
                <p className="text-amber-600/70 text-sm italic">{selectedClass.title}</p>
              </div>
            </div>

            <p className="text-amber-200/70 text-base leading-relaxed mb-6">{selectedClass.description}</p>

            <div className="mb-4">
              <p className="cinzel text-amber-600/70 text-xs tracking-widest mb-3">ABILITIES</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedClass.skills.map(skill => (
                  <div key={skill.id} className="rounded-lg p-3"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,160,23,0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-amber-500">{SKILL_ICONS[skill.icon]}</span>
                      <span className="text-amber-300 text-sm font-semibold">{skill.name}</span>
                    </div>
                    <p className="text-amber-700/70 text-xs">{skill.description}</p>
                    <div className="flex gap-3 mt-1.5">
                      {skill.damage > 0 && (
                        <span className="text-xs" style={{ color: selectedClass.color }}>
                          {skill.type === 'physical' ? 'PHY' : 'MAG'} {skill.damage}
                        </span>
                      )}
                      {skill.damage < 0 && (
                        <span className="text-xs text-green-400">HEAL {Math.abs(skill.damage)}</span>
                      )}
                      {skill.mpCost > 0 && (
                        <span className="text-xs text-blue-400">MP {skill.mpCost}</span>
                      )}
                      {skill.cooldown > 0 && (
                        <span className="text-xs text-amber-700/60">CD {skill.cooldown}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6">
            <label className="cinzel text-amber-600/70 text-xs tracking-widest block mb-3">HERO NAME</label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setNameError(''); }}
              placeholder="Enter your name..."
              maxLength={20}
              className="w-full px-4 py-3 rounded-lg text-amber-200 placeholder-amber-800/60 text-base focus:outline-none focus:ring-1 mb-1"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(212,160,23,0.3)',
                fontFamily: 'Cinzel, serif',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(212,160,23,0.7)'}
              onBlur={e => e.target.style.borderColor = 'rgba(212,160,23,0.3)'}
              onKeyDown={e => e.key === 'Enter' && handleStart()}
            />
            {nameError && <p className="text-red-400 text-sm mb-3">{nameError}</p>}

            <button onClick={handleStart}
              className="btn-gold w-full py-4 rounded-lg cinzel font-bold text-amber-900 text-lg tracking-widest cursor-pointer mt-3">
              BEGIN YOUR JOURNEY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
