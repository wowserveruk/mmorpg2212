import { useEffect, useState } from 'react';
import { RefreshCw, Trophy } from 'lucide-react';

interface Props {
  playerName: string;
  className: string;
  dragonsDefeated: number;
  onRetry: () => void;
  onLeaderboard: () => void;
}

export default function DefeatScreen({ playerName, className, dragonsDefeated, onRetry, onLeaderboard }: Props) {
  const [showing, setShowing] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowing(true), 200);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at center, #1a0000 0%, #080000 50%, #030303 100%)' }}>

      <div className={`text-center max-w-lg mx-auto px-6 transition-all duration-700 ${showing ? 'slide-up-anim' : 'opacity-0'}`}>

        <div className="mb-6 flex justify-center">
          <div className="text-6xl float-anim">💀</div>
        </div>

        <h1 className="cinzel font-black text-5xl mb-3 pulse-red-anim text-red-500">
          DEFEATED
        </h1>

        <p className="text-red-300/70 text-xl italic mb-2">
          {playerName} has fallen...
        </p>

        <p className="text-amber-700/60 text-base mb-8">
          The darkness claims another brave soul. But legends are not forged without failure.
        </p>

        <div className="glass-panel rounded-2xl p-6 mb-8">
          <h3 className="cinzel text-red-500/70 font-bold text-sm tracking-widest mb-4">FINAL RECORD</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="cinzel text-2xl font-bold text-amber-400">{dragonsDefeated}</div>
              <div className="text-amber-700/60 text-sm">Dragons Slain</div>
            </div>
            <div className="text-center">
              <div className="cinzel text-2xl font-bold text-amber-400">{className}</div>
              <div className="text-amber-700/60 text-sm">Hero Class</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onRetry}
            className="btn-fire flex-1 py-4 rounded-xl cinzel font-bold text-red-100 text-base cursor-pointer">
            <span className="flex items-center justify-center gap-2">
              <RefreshCw size={18} />
              Rise Again
            </span>
          </button>

          <button onClick={onLeaderboard}
            className="flex-1 py-4 rounded-xl cinzel font-bold text-base cursor-pointer"
            style={{
              background: 'rgba(120,53,15,0.3)',
              border: '1px solid rgba(217,119,6,0.4)',
              color: '#d97706',
            }}>
            <span className="flex items-center justify-center gap-2">
              <Trophy size={18} />
              Hall of Legends
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
