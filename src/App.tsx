import { useState } from 'react';
import { CharacterClass, Dragon, GameScreen, PlayerState, ShopItem } from './types/game';
import { DRAGONS } from './lib/gameData';
import LandingScreen from './components/LandingScreen';
import CharacterSelect from './components/CharacterSelect';
import WorldMap from './components/WorldMap';
import BattleArena from './components/BattleArena';
import VictoryScreen from './components/VictoryScreen';
import DefeatScreen from './components/DefeatScreen';
import Leaderboard from './components/Leaderboard';
import ShopScreen from './components/ShopScreen';

function createPlayer(cls: CharacterClass, name: string): PlayerState {
  return {
    name,
    classId: cls.id,
    className: cls.name,
    hp: cls.maxHp,
    maxHp: cls.maxHp,
    mp: cls.maxMp,
    maxMp: cls.maxMp,
    attack: cls.attack,
    defense: cls.defense,
    speed: cls.speed,
    level: 1,
    exp: 0,
    gold: 0,
    skills: cls.skills.map(s => ({ ...s })),
    color: cls.color,
    accentColor: cls.accentColor,
    buffs: { attack: 0, defense: 0, speed: 0 },
    hasPhoenixFeather: false,
    hasCooldownReset: false,
  };
}

export default function App() {
  const [screen, setScreen] = useState<GameScreen>('landing');
  const [player, setPlayer] = useState<PlayerState | null>(null);
  const [currentDragon, setCurrentDragon] = useState<Dragon | null>(null);
  const [defeatedDragons, setDefeatedDragons] = useState<string[]>([]);
  const [lastExpGained, setLastExpGained] = useState(0);
  const [lastGoldGained, setLastGoldGained] = useState(0);
  const [purchaseCounts, setPurchaseCounts] = useState<Record<string, number>>({});
  const [leaderboardEntry, setLeaderboardEntry] = useState<{
    player_name: string;
    character_class: string;
    dragons_defeated: number;
    score: number;
  } | null>(null);

  function handleCharacterSelect(cls: CharacterClass, name: string) {
    setPlayer(createPlayer(cls, name));
    setDefeatedDragons([]);
    setPurchaseCounts({});
    setScreen('worldMap');
  }

  function handleFightDragon(dragon: Dragon) {
    setCurrentDragon(dragon);
    setScreen('battle');
  }

  function handleVictory(updatedPlayer: PlayerState, exp: number, gold: number) {
    if (!currentDragon) return;
    const newDefeated = [...defeatedDragons, currentDragon.id];
    setDefeatedDragons(newDefeated);
    setPlayer(updatedPlayer);
    setLastExpGained(exp);
    setLastGoldGained(gold);
    setScreen('victory');
  }

  function handleVictoryContinue() {
    setScreen('worldMap');
  }

  function handleDefeat() {
    setScreen('defeat');
  }

  function handleShopPurchase(_item: ShopItem, updatedPlayer: PlayerState, updatedCounts: Record<string, number>) {
    setPlayer(updatedPlayer);
    setPurchaseCounts(updatedCounts);
  }

  function handleGoToLeaderboard() {
    if (!player) { setScreen('leaderboard'); return; }
    const score = defeatedDragons.length * 1000 + player.gold + player.exp;
    setLeaderboardEntry({
      player_name: player.name,
      character_class: player.className,
      dragons_defeated: defeatedDragons.length,
      score,
    });
    setScreen('leaderboard');
  }

  function handleRetry() {
    setPlayer(null);
    setCurrentDragon(null);
    setDefeatedDragons([]);
    setLeaderboardEntry(null);
    setPurchaseCounts({});
    setScreen('charSelect');
  }

  function handleBackToLanding() {
    setPlayer(null);
    setCurrentDragon(null);
    setDefeatedDragons([]);
    setLeaderboardEntry(null);
    setPurchaseCounts({});
    setScreen('landing');
  }

  const isLastDragon = currentDragon?.id === DRAGONS[DRAGONS.length - 1].id;

  return (
    <div className="min-h-screen">
      {screen === 'landing' && (
        <LandingScreen
          onPlay={() => setScreen('charSelect')}
          onLeaderboard={() => { setLeaderboardEntry(null); setScreen('leaderboard'); }}
        />
      )}

      {screen === 'charSelect' && (
        <CharacterSelect
          onSelect={handleCharacterSelect}
          onBack={() => setScreen('landing')}
        />
      )}

      {screen === 'worldMap' && player && (
        <WorldMap
          player={player}
          defeatedDragons={defeatedDragons}
          onFight={handleFightDragon}
          onShop={() => setScreen('shop')}
        />
      )}

      {screen === 'shop' && player && (
        <ShopScreen
          player={player}
          purchaseCounts={purchaseCounts}
          onPurchase={handleShopPurchase}
          onBack={() => setScreen('worldMap')}
        />
      )}

      {screen === 'battle' && player && currentDragon && (
        <BattleArena
          key={currentDragon.id}
          player={player}
          dragon={currentDragon}
          onVictory={handleVictory}
          onDefeat={handleDefeat}
        />
      )}

      {screen === 'victory' && player && currentDragon && (
        <VictoryScreen
          player={player}
          dragon={currentDragon}
          expGained={lastExpGained}
          goldGained={lastGoldGained}
          isLastDragon={isLastDragon}
          onContinue={handleVictoryContinue}
          onLeaderboard={handleGoToLeaderboard}
        />
      )}

      {screen === 'defeat' && player && (
        <DefeatScreen
          playerName={player.name}
          className={player.className}
          dragonsDefeated={defeatedDragons.length}
          onRetry={handleRetry}
          onLeaderboard={handleGoToLeaderboard}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          key={leaderboardEntry ? 'with-entry' : 'view-only'}
          onBack={handleBackToLanding}
          newEntry={leaderboardEntry}
        />
      )}
    </div>
  );
}
