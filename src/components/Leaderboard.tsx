import { useEffect, useState } from 'react';
import { Trophy, ChevronLeft, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { LeaderboardEntry } from '../types/game';

interface Props {
  onBack: () => void;
  newEntry?: { player_name: string; character_class: string; dragons_defeated: number; score: number } | null;
}

const RANK_COLORS = ['#f59e0b', '#94a3b8', '#cd7f32'];
const CLASS_ICONS: Record<string, string> = {
  'Dragon Knight': '⚔',
  'Fire Mage': '🔥',
  'Shadow Archer': '🏹',
  'Holy Paladin': '✦',
};

export default function Leaderboard({ onBack, newEntry }: Props) {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (newEntry && !submitted) {
      submitScore();
    } else {
      fetchLeaderboard();
    }
  }, []);

  async function submitScore() {
    if (!newEntry) return;
    setSubmitted(true);
    await supabase.from('dragon_leaderboard').insert(newEntry);
    await fetchLeaderboard();
  }

  async function fetchLeaderboard() {
    setLoading(true);
    const { data } = await supabase
      .from('dragon_leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(20);
    setEntries(data ?? []);
    setLoading(false);
  }

  const newEntryRank = newEntry
    ? entries.findIndex(e =>
        e.player_name === newEntry.player_name &&
        e.score === newEntry.score
      ) + 1
    : 0;

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
          <h2 className="cinzel font-bold text-amber-400 text-lg tracking-widest">HALL OF LEGENDS</h2>
        </div>
        <button onClick={fetchLeaderboard}
          className="text-amber-600 hover:text-amber-400 transition-colors cursor-pointer p-1">
          <RefreshCw size={16} />
        </button>
      </div>

      <div className="flex-1 max-w-2xl mx-auto w-full p-6">
        <div className="text-center mb-6">
          <Trophy size={40} className="text-amber-500 mx-auto mb-2 float-anim" />
          <p className="text-amber-700/60 text-sm italic">Champions who have faced the ancient dragons</p>
        </div>

        {newEntry && newEntryRank > 0 && (
          <div className="glass-panel rounded-xl p-4 mb-6 scale-in-anim"
            style={{ border: '1px solid rgba(245, 158, 11, 0.5)', background: 'rgba(120,53,15,0.3)' }}>
            <p className="cinzel text-amber-400 text-sm font-bold text-center mb-1">
              Your Score Recorded!
            </p>
            <p className="text-amber-600/70 text-center text-sm">
              {newEntry.player_name} entered the Hall of Legends at rank #{newEntryRank}
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-amber-600/60 cinzel text-sm tracking-widest animate-pulse">LOADING...</div>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-amber-700/50 text-lg italic">No legends yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry, i) => {
              const isNew = newEntry &&
                entry.player_name === newEntry.player_name &&
                entry.score === newEntry.score;
              const rank = i + 1;

              return (
                <div key={entry.id}
                  className="glass-panel rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-200"
                  style={{
                    border: isNew ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(212,160,23,0.1)',
                    background: isNew ? 'rgba(120,53,15,0.25)' : undefined,
                  }}>

                  <div className="w-8 text-center shrink-0">
                    {rank <= 3 ? (
                      <span className="text-xl" style={{ color: RANK_COLORS[rank - 1] }}>
                        {rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'}
                      </span>
                    ) : (
                      <span className="cinzel text-amber-700/50 text-sm font-bold">#{rank}</span>
                    )}
                  </div>

                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: 'rgba(120,53,15,0.3)', border: '1px solid rgba(212,160,23,0.2)' }}>
                    {CLASS_ICONS[entry.character_class] ?? '⚔'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="cinzel font-bold text-amber-300 text-sm truncate">{entry.player_name}</span>
                      {isNew && <span className="text-amber-500 text-xs">(You)</span>}
                    </div>
                    <div className="text-amber-700/60 text-xs">{entry.character_class}</div>
                  </div>

                  <div className="text-center shrink-0 px-2">
                    <div className="cinzel font-bold text-red-400 text-sm">{entry.dragons_defeated}</div>
                    <div className="text-amber-800/60 text-xs">Dragons</div>
                  </div>

                  <div className="text-center shrink-0">
                    <div className="cinzel font-bold text-amber-400 text-base">{entry.score.toLocaleString()}</div>
                    <div className="text-amber-800/60 text-xs">Score</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
