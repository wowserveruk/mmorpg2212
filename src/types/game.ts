export interface Skill {
  id: string;
  name: string;
  damage: number;
  mpCost: number;
  type: 'physical' | 'magic' | 'heal';
  description: string;
  cooldown: number;
  currentCooldown: number;
  icon: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  title: string;
  description: string;
  maxHp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  skills: Skill[];
  color: string;
  accentColor: string;
}

export interface PlayerBuffs {
  attack: number;
  defense: number;
  speed: number;
}

export interface PlayerState {
  name: string;
  classId: string;
  className: string;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;
  level: number;
  exp: number;
  gold: number;
  skills: Skill[];
  color: string;
  accentColor: string;
  buffs: PlayerBuffs;
  hasPhoenixFeather: boolean;
  hasCooldownReset: boolean;
}

export interface DragonAbility {
  name: string;
  damage: number;
  description: string;
  type: 'fire' | 'ice' | 'dark' | 'physical';
}

export interface Dragon {
  id: string;
  name: string;
  title: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  level: number;
  abilities: DragonAbility[];
  rewardExp: number;
  rewardGold: number;
  color: string;
  description: string;
}

export interface BattleLogEntry {
  id: number;
  message: string;
  type: 'player' | 'enemy' | 'system' | 'heal' | 'critical';
}

export type GameScreen = 'landing' | 'charSelect' | 'worldMap' | 'shop' | 'battle' | 'victory' | 'defeat' | 'leaderboard';

export interface LeaderboardEntry {
  id: string;
  player_name: string;
  character_class: string;
  dragons_defeated: number;
  score: number;
  created_at: string;
}

export type ShopItemRarity = 'common' | 'rare' | 'epic' | 'vip';
export type ShopItemType = 'consumable' | 'buff' | 'permanent' | 'special';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  effectLabel: string;
  price: number;
  rarity: ShopItemRarity;
  type: ShopItemType;
  icon: string;
  maxPurchases: number;
}
