import { CharacterClass, Dragon, PlayerState, ShopItem } from '../types/game';

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'dragon-knight',
    name: 'Dragon Knight',
    title: 'Sword of the Flame',
    description: 'A fearless warrior who wields the power of dragons. High attack and resilient defense.',
    maxHp: 550,
    maxMp: 120,
    attack: 75,
    defense: 40,
    speed: 60,
    color: '#dc2626',
    accentColor: '#fca5a5',
    skills: [
      { id: 'iron-slash', name: 'Iron Slash', damage: 30, mpCost: 0, type: 'physical', description: 'A swift blade strike.', cooldown: 0, currentCooldown: 0, icon: 'Sword' },
      { id: 'dragon-strike', name: 'Dragon Strike', damage: 65, mpCost: 20, type: 'physical', description: 'Channel dragon power into a devastating blow.', cooldown: 1, currentCooldown: 0, icon: 'Zap' },
      { id: 'flame-burst', name: 'Flame Burst', damage: 90, mpCost: 35, type: 'magic', description: 'Release dragon fire upon your foe.', cooldown: 2, currentCooldown: 0, icon: 'Flame' },
      { id: 'berserker-rage', name: 'Berserker Rage', damage: 140, mpCost: 55, type: 'physical', description: 'Enter a frenzy for a catastrophic strike.', cooldown: 3, currentCooldown: 0, icon: 'Skull' },
    ],
  },
  {
    id: 'fire-mage',
    name: 'Fire Mage',
    title: 'Archmage of Cinders',
    description: 'A master of forbidden fire magic. Devastating magical power but fragile constitution.',
    maxHp: 380,
    maxMp: 240,
    attack: 45,
    defense: 20,
    speed: 75,
    color: '#ea580c',
    accentColor: '#fdba74',
    skills: [
      { id: 'fire-bolt', name: 'Fire Bolt', damage: 40, mpCost: 5, type: 'magic', description: 'Hurl a bolt of fire.', cooldown: 0, currentCooldown: 0, icon: 'Zap' },
      { id: 'fireball', name: 'Fireball', damage: 80, mpCost: 25, type: 'magic', description: 'An explosive ball of flame.', cooldown: 1, currentCooldown: 0, icon: 'Circle' },
      { id: 'meteor', name: 'Meteor', damage: 120, mpCost: 45, type: 'magic', description: 'Call down a meteor from the sky.', cooldown: 2, currentCooldown: 0, icon: 'Flame' },
      { id: 'phoenix-flame', name: 'Phoenix Flame', damage: 170, mpCost: 70, type: 'magic', description: 'Unleash the eternal flame of the phoenix.', cooldown: 3, currentCooldown: 0, icon: 'Star' },
    ],
  },
  {
    id: 'shadow-archer',
    name: 'Shadow Archer',
    title: 'Phantom of Darkness',
    description: 'A swift hunter who strikes from the shadows. Exceptional speed and precision.',
    maxHp: 440,
    maxMp: 160,
    attack: 65,
    defense: 25,
    speed: 95,
    color: '#0891b2',
    accentColor: '#67e8f9',
    skills: [
      { id: 'quick-shot', name: 'Quick Shot', damage: 28, mpCost: 0, type: 'physical', description: 'A rapid precise arrow.', cooldown: 0, currentCooldown: 0, icon: 'Target' },
      { id: 'arrow-rain', name: 'Arrow Rain', damage: 55, mpCost: 20, type: 'physical', description: 'Release a volley of arrows.', cooldown: 1, currentCooldown: 0, icon: 'Zap' },
      { id: 'shadow-strike', name: 'Shadow Strike', damage: 95, mpCost: 35, type: 'physical', description: 'Strike from the blind side.', cooldown: 2, currentCooldown: 0, icon: 'Eye' },
      { id: 'death-mark', name: 'Death Mark', damage: 150, mpCost: 55, type: 'magic', description: 'Mark the target for death. Ignores defense.', cooldown: 3, currentCooldown: 0, icon: 'Skull' },
    ],
  },
  {
    id: 'holy-paladin',
    name: 'Holy Paladin',
    title: 'Champion of the Sacred Flame',
    description: 'A divine warrior blessed by the gods. Balanced stats with powerful healing abilities.',
    maxHp: 500,
    maxMp: 180,
    attack: 60,
    defense: 45,
    speed: 55,
    color: '#d97706',
    accentColor: '#fde68a',
    skills: [
      { id: 'holy-strike', name: 'Holy Strike', damage: 25, mpCost: 5, type: 'physical', description: 'A strike imbued with holy energy.', cooldown: 0, currentCooldown: 0, icon: 'Sword' },
      { id: 'sacred-heal', name: 'Sacred Heal', damage: -80, mpCost: 25, type: 'heal', description: 'Channel divine light to restore health.', cooldown: 1, currentCooldown: 0, icon: 'Heart' },
      { id: 'divine-smite', name: 'Divine Smite', damage: 85, mpCost: 35, type: 'magic', description: 'Smite foes with divine wrath.', cooldown: 2, currentCooldown: 0, icon: 'Star' },
      { id: 'judgment', name: 'Judgment', damage: 130, mpCost: 55, type: 'magic', description: 'Call upon the gods to deliver final judgment.', cooldown: 3, currentCooldown: 0, icon: 'Shield' },
    ],
  },
];

export const DRAGONS: Dragon[] = [
  {
    id: 'fire-drake',
    name: 'Ignathar',
    title: 'The Fire Drake',
    hp: 350,
    maxHp: 350,
    attack: 40,
    defense: 18,
    level: 5,
    color: '#dc2626',
    description: 'A young but ferocious fire dragon that guards the Scorched Highlands.',
    rewardExp: 200,
    rewardGold: 150,
    abilities: [
      { name: 'Claw Swipe', damage: 35, description: 'Rakes with razor-sharp claws.', type: 'physical' },
      { name: 'Flame Breath', damage: 55, description: 'Exhales a torrent of scorching flames.', type: 'fire' },
      { name: 'Tail Slam', damage: 45, description: 'Crashes its massive tail down.', type: 'physical' },
    ],
  },
  {
    id: 'frost-wyrm',
    name: 'Glaciveth',
    title: 'The Frost Wyrm',
    hp: 500,
    maxHp: 500,
    attack: 55,
    defense: 28,
    level: 12,
    color: '#0891b2',
    description: 'An ancient serpent of ice that has slumbered beneath the Frozen Peaks for centuries.',
    rewardExp: 400,
    rewardGold: 300,
    abilities: [
      { name: 'Ice Bite', damage: 50, description: 'Bites with fangs coated in frost.', type: 'ice' },
      { name: 'Blizzard Breath', damage: 70, description: 'Unleashes a devastating blizzard.', type: 'ice' },
      { name: 'Frost Crush', damage: 60, description: 'Crushes with ice-hardened scales.', type: 'physical' },
    ],
  },
  {
    id: 'storm-serpent',
    name: 'Drakonor',
    title: 'The Storm Serpent',
    hp: 620,
    maxHp: 620,
    attack: 62,
    defense: 30,
    level: 18,
    color: '#16a34a',
    description: 'A colossal serpent wreathed in living lightning. Its scales crackle with centuries of stored storm energy.',
    rewardExp: 550,
    rewardGold: 420,
    abilities: [
      { name: 'Thunder Fang', damage: 62, description: 'Bites with electrified fangs.', type: 'physical' },
      { name: 'Tempest Breath', damage: 82, description: 'Exhales a torrent of lightning and wind.', type: 'dark' },
      { name: 'Lightning Coil', damage: 72, description: 'Wraps the enemy in crackling lightning coils.', type: 'dark' },
    ],
  },
  {
    id: 'molten-colossus',
    name: 'Infernus',
    title: 'The Molten Colossus',
    hp: 720,
    maxHp: 720,
    attack: 70,
    defense: 36,
    level: 22,
    color: '#ea580c',
    description: 'A mountain of living magma and obsidian scales. Every breath scorches the ground to glass.',
    rewardExp: 680,
    rewardGold: 540,
    abilities: [
      { name: 'Magma Crush', damage: 68, description: 'Slams down a molten fist of rock.', type: 'fire' },
      { name: 'Volcanic Breath', damage: 92, description: 'Unleashes a river of superheated lava.', type: 'fire' },
      { name: 'Pyroclast', damage: 80, description: 'Launches a barrage of explosive magma balls.', type: 'fire' },
    ],
  },
  {
    id: 'ancient-dragon',
    name: 'Malachar',
    title: 'The Ancient One',
    hp: 900,
    maxHp: 900,
    attack: 82,
    defense: 45,
    level: 30,
    color: '#7c3aed',
    description: 'The oldest and most powerful dragon in existence. Its very breath corrupts reality.',
    rewardExp: 900,
    rewardGold: 700,
    abilities: [
      { name: 'Void Claw', damage: 78, description: 'Strikes with claws that tear at existence.', type: 'dark' },
      { name: 'Shadow Breath', damage: 105, description: 'Breathes dark energy that devours light.', type: 'dark' },
      { name: 'Ancient Wrath', damage: 130, description: 'Channels eons of rage into a single cataclysmic blow.', type: 'dark' },
    ],
  },
];

export const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'minor-hp-potion',
    name: 'Dragon Blood Draught',
    description: 'A vial of potent dragon blood that rapidly seals wounds.',
    effectLabel: 'Restore 150 HP',
    price: 60,
    rarity: 'common',
    type: 'consumable',
    icon: '🩸',
    maxPurchases: -1,
  },
  {
    id: 'major-hp-potion',
    name: 'Elixir of Vitality',
    description: 'A rare elixir brewed from ancient herbs and dragon essence.',
    effectLabel: 'Restore 350 HP',
    price: 140,
    rarity: 'rare',
    type: 'consumable',
    icon: '💊',
    maxPurchases: -1,
  },
  {
    id: 'mana-potion',
    name: 'Arcane Essence',
    description: 'Crystallized magical energy dissolved in enchanted water.',
    effectLabel: 'Restore 100 MP',
    price: 70,
    rarity: 'common',
    type: 'consumable',
    icon: '💧',
    maxPurchases: -1,
  },
  {
    id: 'full-restore',
    name: 'Grand Elixir',
    description: 'The pinnacle of alchemical achievement. Fully restores the body.',
    effectLabel: 'Full HP & MP Restore',
    price: 280,
    rarity: 'epic',
    type: 'consumable',
    icon: '✨',
    maxPurchases: 2,
  },
  {
    id: 'attack-rune',
    name: 'Warbrand Rune',
    description: 'A rune carved from dragon bone. Enhances your next battle\'s offensive power.',
    effectLabel: '+20 ATK for next battle',
    price: 120,
    rarity: 'rare',
    type: 'buff',
    icon: '⚔',
    maxPurchases: 3,
  },
  {
    id: 'defense-rune',
    name: 'Ironhide Rune',
    description: 'Ancient protective magic sealed within draconic scales.',
    effectLabel: '+15 DEF for next battle',
    price: 100,
    rarity: 'rare',
    type: 'buff',
    icon: '🛡',
    maxPurchases: 3,
  },
  {
    id: 'speed-rune',
    name: 'Swiftclaw Rune',
    description: 'Infused with the essence of the fastest dragon. Move like the wind.',
    effectLabel: '+20 SPD for next battle',
    price: 110,
    rarity: 'rare',
    type: 'buff',
    icon: '💨',
    maxPurchases: 3,
  },
  {
    id: 'phoenix-feather',
    name: 'Phoenix Feather',
    description: 'A feather from the immortal phoenix. It burns with undying life force.',
    effectLabel: 'Revive with 50% HP once',
    price: 380,
    rarity: 'epic',
    type: 'special',
    icon: '🪶',
    maxPurchases: 1,
  },
  {
    id: 'cooldown-reset',
    name: 'Void Hourglass',
    description: 'A cursed artifact that bends time itself. All cooldowns reset at battle start.',
    effectLabel: 'Reset all cooldowns at battle start',
    price: 420,
    rarity: 'epic',
    type: 'special',
    icon: '⏳',
    maxPurchases: 1,
  },
  {
    id: 'vip-dragon-heart',
    name: 'Dragon Heart Crystal',
    description: 'The crystallized heart of an elder dragon, pulsing with raw destructive power.',
    effectLabel: '+40 ATK permanently',
    price: 650,
    rarity: 'vip',
    type: 'permanent',
    icon: '💎',
    maxPurchases: 1,
  },
  {
    id: 'vip-dragon-scale',
    name: 'Ancientscale Armor',
    description: 'Forged from the impenetrable scales of the most ancient dragon.',
    effectLabel: '+25 DEF permanently',
    price: 520,
    rarity: 'vip',
    type: 'permanent',
    icon: '🔮',
    maxPurchases: 1,
  },
  {
    id: 'vip-dragon-soul',
    name: "Dragon Soul Vessel",
    description: "A vessel containing the essence of a slain dragon. Permanently expands your life force.",
    effectLabel: '+200 Max HP permanently',
    price: 580,
    rarity: 'vip',
    type: 'permanent',
    icon: '👑',
    maxPurchases: 1,
  },
];

export function calculateDamage(
  attackerAttack: number,
  skillDamage: number,
  defenderDefense: number,
  ignoreDefense = false
): number {
  const base = skillDamage + attackerAttack * 0.5;
  const reduced = ignoreDefense ? base : Math.max(5, base - defenderDefense * 0.4);
  const variance = 0.9 + Math.random() * 0.2;
  const isCrit = Math.random() < 0.15;
  const finalDamage = Math.floor(reduced * variance * (isCrit ? 1.8 : 1));
  return finalDamage;
}

export function calculateEnemyDamage(enemyAttack: number, abilityDamage: number, playerDefense: number): number {
  const base = abilityDamage + enemyAttack * 0.4;
  const reduced = Math.max(3, base - playerDefense * 0.35);
  const variance = 0.85 + Math.random() * 0.3;
  return Math.floor(reduced * variance);
}

export function calculateBR(player: PlayerState): number {
  const hpScore = Math.floor(player.maxHp * 0.8);
  const atkScore = player.attack * 10;
  const defScore = player.defense * 6;
  const spdScore = Math.floor(player.speed * 4);
  const expScore = Math.floor((player.exp ?? 0) * 0.5);
  const goldScore = Math.floor((player.gold ?? 0) * 0.3);
  const levelScore = player.level * 500;
  const featherScore = player.hasPhoenixFeather ? 800 : 0;
  const resetScore = player.hasCooldownReset ? 600 : 0;
  const buffScore = (player.buffs?.attack ?? 0) * 15 + (player.buffs?.defense ?? 0) * 10 + (player.buffs?.speed ?? 0) * 8;
  return hpScore + atkScore + defScore + spdScore + expScore + goldScore + levelScore + featherScore + resetScore + buffScore;
}

export function formatBR(br: number): string {
  if (br >= 10000) return `${(br / 1000).toFixed(1)}k`;
  return br.toLocaleString();
}
