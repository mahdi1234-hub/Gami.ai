// Config-driven game registry - one engine, many branded campaigns
// This is exactly how Winday.co works: same game code, different configs

export interface GameCampaign {
  id: string
  name: string
  description: string
  gameType: string
  primaryColor: string
  brandName: string
  duration: number
  winThreshold: number
  rewardCode: string
  rewardText: string
  collectEmail: boolean
  difficulty: string
}

export const ALL_CAMPAIGNS: GameCampaign[] = [
  // === SPIN WHEEL VARIANTS ===
  { id: 'g01', name: 'Summer Spin & Win', description: 'Spin the wheel for summer deals!', gameType: 'spin-wheel', primaryColor: '#F47B20', brandName: 'SunShop', duration: 30, winThreshold: 0, rewardCode: 'SUN20', rewardText: '20% off summer collection', collectEmail: true, difficulty: 'easy' },
  { id: 'g02', name: 'Holiday Wheel of Fortune', description: 'Spin for holiday surprises!', gameType: 'spin-wheel', primaryColor: '#DC2626', brandName: 'GiftHub', duration: 30, winThreshold: 0, rewardCode: 'HOLIDAY15', rewardText: '15% off gifts', collectEmail: true, difficulty: 'easy' },
  { id: 'g03', name: 'Flash Sale Spinner', description: 'Quick spin for flash deals!', gameType: 'spin-wheel', primaryColor: '#7C3AED', brandName: 'QuickDeal', duration: 15, winThreshold: 0, rewardCode: 'FLASH30', rewardText: '30% off for 24 hours', collectEmail: false, difficulty: 'easy' },
  { id: 'g04', name: 'Birthday Wheel', description: 'Celebrate with a birthday spin!', gameType: 'spin-wheel', primaryColor: '#EC4899', brandName: 'PartyTime', duration: 30, winThreshold: 0, rewardCode: 'BDAY25', rewardText: 'Free birthday treat', collectEmail: true, difficulty: 'easy' },
  { id: 'g05', name: 'Loyalty Spin Reward', description: 'Loyal customers spin for bonus rewards!', gameType: 'spin-wheel', primaryColor: '#0EA5E9', brandName: 'LoyaltyPlus', duration: 30, winThreshold: 0, rewardCode: 'LOYAL50', rewardText: '50 bonus points', collectEmail: false, difficulty: 'easy' },

  // === SCRATCH CARD VARIANTS ===
  { id: 'g06', name: 'Golden Scratch', description: 'Scratch to reveal your golden prize!', gameType: 'scratch-card', primaryColor: '#D97706', brandName: 'GoldStore', duration: 30, winThreshold: 0, rewardCode: 'GOLD25', rewardText: '25% off gold items', collectEmail: true, difficulty: 'easy' },
  { id: 'g07', name: 'Mystery Box Scratch', description: 'What is inside? Scratch to find out!', gameType: 'scratch-card', primaryColor: '#7C3AED', brandName: 'MysteryBox', duration: 30, winThreshold: 0, rewardCode: 'MYSTERY', rewardText: 'Free mystery gift', collectEmail: true, difficulty: 'easy' },
  { id: 'g08', name: 'Scratch & Save', description: 'Scratch your way to savings!', gameType: 'scratch-card', primaryColor: '#059669', brandName: 'SaveMart', duration: 30, winThreshold: 0, rewardCode: 'SAVE10', rewardText: '10% off everything', collectEmail: false, difficulty: 'easy' },
  { id: 'g09', name: 'VIP Scratch Experience', description: 'Exclusive scratch card for VIP members!', gameType: 'scratch-card', primaryColor: '#1E293B', brandName: 'VIP Club', duration: 30, winThreshold: 0, rewardCode: 'VIP40', rewardText: '40% VIP exclusive discount', collectEmail: true, difficulty: 'easy' },
  { id: 'g10', name: 'Lucky Ticket Scratch', description: 'Feeling lucky? Scratch and win!', gameType: 'scratch-card', primaryColor: '#DC2626', brandName: 'LuckyDraw', duration: 30, winThreshold: 0, rewardCode: 'LUCKY20', rewardText: 'Free shipping + 20% off', collectEmail: true, difficulty: 'easy' },

  // === MATCH-3 VARIANTS ===
  { id: 'g11', name: 'Candy Crush Challenge', description: 'Match candies to score big!', gameType: 'match-3', primaryColor: '#EC4899', brandName: 'SweetShop', duration: 90, winThreshold: 300, rewardCode: 'CANDY15', rewardText: '15% off candy store', collectEmail: true, difficulty: 'medium' },
  { id: 'g12', name: 'Jewel Match Mania', description: 'Match sparkling jewels!', gameType: 'match-3', primaryColor: '#2563EB', brandName: 'JewelBox', duration: 60, winThreshold: 200, rewardCode: 'JEWEL20', rewardText: '20% off jewelry', collectEmail: true, difficulty: 'medium' },
  { id: 'g13', name: 'Fruit Match Frenzy', description: 'Match tropical fruits!', gameType: 'match-3', primaryColor: '#16A34A', brandName: 'FruitMarket', duration: 60, winThreshold: 250, rewardCode: 'FRUIT10', rewardText: 'Free smoothie', collectEmail: false, difficulty: 'easy' },
  { id: 'g14', name: 'Speed Match Blitz', description: 'Match as fast as you can!', gameType: 'match-3', primaryColor: '#DC2626', brandName: 'SpeedZone', duration: 30, winThreshold: 150, rewardCode: 'SPEED25', rewardText: '25% off speed delivery', collectEmail: true, difficulty: 'hard' },
  { id: 'g15', name: 'Cookie Match Party', description: 'Match cookies at the party!', gameType: 'match-3', primaryColor: '#92400E', brandName: 'CookieJar', duration: 75, winThreshold: 200, rewardCode: 'COOKIE', rewardText: 'Free cookie box', collectEmail: true, difficulty: 'easy' },

  // === BUBBLE SHOOTER VARIANTS ===
  { id: 'g16', name: 'Bubble Pop Party', description: 'Pop colorful bubbles!', gameType: 'bubble-shooter', primaryColor: '#4ECDC4', brandName: 'PopParty', duration: 60, winThreshold: 200, rewardCode: 'POP15', rewardText: '15% off party supplies', collectEmail: true, difficulty: 'easy' },
  { id: 'g17', name: 'Ocean Bubble Blast', description: 'Underwater bubble adventure!', gameType: 'bubble-shooter', primaryColor: '#0EA5E9', brandName: 'OceanWorld', duration: 90, winThreshold: 300, rewardCode: 'OCEAN20', rewardText: '20% off aquarium tickets', collectEmail: true, difficulty: 'medium' },
  { id: 'g18', name: 'Neon Bubble Shooter', description: 'Pop neon bubbles in the dark!', gameType: 'bubble-shooter', primaryColor: '#7C3AED', brandName: 'NeonClub', duration: 45, winThreshold: 150, rewardCode: 'NEON30', rewardText: '30% off neon accessories', collectEmail: false, difficulty: 'easy' },
  { id: 'g19', name: 'Bubble Master Challenge', description: 'Can you clear all bubbles?', gameType: 'bubble-shooter', primaryColor: '#DC2626', brandName: 'MasterClass', duration: 120, winThreshold: 500, rewardCode: 'MASTER', rewardText: 'Free premium trial', collectEmail: true, difficulty: 'hard' },
  { id: 'g20', name: 'Rainbow Bubble Pop', description: 'Pop rainbow-colored bubbles!', gameType: 'bubble-shooter', primaryColor: '#F47B20', brandName: 'RainbowShop', duration: 60, winThreshold: 200, rewardCode: 'RAINBOW', rewardText: '20% off colorful items', collectEmail: true, difficulty: 'easy' },

  // === SHOOTING RANGE VARIANTS ===
  { id: 'g21', name: 'Target Practice Pro', description: 'Hit all the targets!', gameType: 'shooting-range', primaryColor: '#DC2626', brandName: 'ProShop', duration: 45, winThreshold: 200, rewardCode: 'TARGET20', rewardText: '20% off sports gear', collectEmail: true, difficulty: 'medium' },
  { id: 'g22', name: 'Space Invader Blast', description: 'Blast alien invaders!', gameType: 'shooting-range', primaryColor: '#1E293B', brandName: 'SpaceZone', duration: 60, winThreshold: 300, rewardCode: 'SPACE25', rewardText: '25% off sci-fi merch', collectEmail: true, difficulty: 'hard' },
  { id: 'g23', name: 'Duck Hunt Classic', description: 'Classic duck hunting fun!', gameType: 'shooting-range', primaryColor: '#16A34A', brandName: 'OutdoorCo', duration: 30, winThreshold: 100, rewardCode: 'HUNT15', rewardText: '15% off outdoor gear', collectEmail: false, difficulty: 'easy' },
  { id: 'g24', name: 'Carnival Shooter', description: 'Win prizes at the carnival!', gameType: 'shooting-range', primaryColor: '#EC4899', brandName: 'FunFair', duration: 45, winThreshold: 150, rewardCode: 'CARNIVAL', rewardText: 'Free carnival pass', collectEmail: true, difficulty: 'easy' },
  { id: 'g25', name: 'Laser Tag Challenge', description: 'Hit targets with laser precision!', gameType: 'shooting-range', primaryColor: '#7C3AED', brandName: 'LaserZone', duration: 30, winThreshold: 150, rewardCode: 'LASER20', rewardText: '20% off laser tag sessions', collectEmail: true, difficulty: 'medium' },

  // === SNAKE VARIANTS ===
  { id: 'g26', name: 'Classic Snake', description: 'The original snake game!', gameType: 'snake', primaryColor: '#16A34A', brandName: 'RetroGames', duration: 60, winThreshold: 100, rewardCode: 'SNAKE10', rewardText: '10% off retro items', collectEmail: true, difficulty: 'medium' },
  { id: 'g27', name: 'Speed Snake', description: 'Snake at double speed!', gameType: 'snake', primaryColor: '#DC2626', brandName: 'FastFood', duration: 30, winThreshold: 50, rewardCode: 'FAST15', rewardText: '15% off meals', collectEmail: false, difficulty: 'hard' },
  { id: 'g28', name: 'Neon Snake', description: 'Glow-in-the-dark snake action!', gameType: 'snake', primaryColor: '#7C3AED', brandName: 'NeonBar', duration: 60, winThreshold: 80, rewardCode: 'GLOW20', rewardText: 'Free glow drink', collectEmail: true, difficulty: 'medium' },
  { id: 'g29', name: 'Snake Marathon', description: 'How long can you survive?', gameType: 'snake', primaryColor: '#0EA5E9', brandName: 'EnduranceCo', duration: 120, winThreshold: 200, rewardCode: 'ENDURE', rewardText: '25% off fitness gear', collectEmail: true, difficulty: 'hard' },
  { id: 'g30', name: 'Garden Snake', description: 'Slither through the garden!', gameType: 'snake', primaryColor: '#059669', brandName: 'GreenThumb', duration: 60, winThreshold: 80, rewardCode: 'GARDEN15', rewardText: '15% off garden supplies', collectEmail: false, difficulty: 'easy' },

  // === WHACK-A-MOLE VARIANTS ===
  { id: 'g31', name: 'Whack-a-Mole Classic', description: 'The classic mole-whacking game!', gameType: 'whack-a-mole', primaryColor: '#92400E', brandName: 'ArcadeWorld', duration: 30, winThreshold: 150, rewardCode: 'WHACK15', rewardText: '15% off arcade tokens', collectEmail: true, difficulty: 'easy' },
  { id: 'g32', name: 'Speed Whacker', description: 'Whack moles at lightning speed!', gameType: 'whack-a-mole', primaryColor: '#DC2626', brandName: 'SpeedFun', duration: 20, winThreshold: 100, rewardCode: 'SPEED10', rewardText: 'Free speed pass', collectEmail: false, difficulty: 'hard' },
  { id: 'g33', name: 'Alien Whack Attack', description: 'Whack alien invaders!', gameType: 'whack-a-mole', primaryColor: '#7C3AED', brandName: 'AlienZone', duration: 30, winThreshold: 120, rewardCode: 'ALIEN20', rewardText: '20% off space toys', collectEmail: true, difficulty: 'medium' },
  { id: 'g34', name: 'Garden Pest Whacker', description: 'Protect your garden from pests!', gameType: 'whack-a-mole', primaryColor: '#16A34A', brandName: 'GardenGuard', duration: 30, winThreshold: 100, rewardCode: 'PEST15', rewardText: '15% off garden tools', collectEmail: true, difficulty: 'easy' },
  { id: 'g35', name: 'Pirate Mole Hunt', description: 'Find the pirate moles!', gameType: 'whack-a-mole', primaryColor: '#D97706', brandName: 'PirateShop', duration: 30, winThreshold: 130, rewardCode: 'PIRATE', rewardText: 'Free pirate hat', collectEmail: false, difficulty: 'medium' },

  // === SLOT MACHINE VARIANTS ===
  { id: 'g36', name: 'Vegas Slots', description: 'Feel the Vegas experience!', gameType: 'slot-machine', primaryColor: '#B91C1C', brandName: 'VegasFun', duration: 30, winThreshold: 50, rewardCode: 'VEGAS30', rewardText: '30% off entertainment', collectEmail: true, difficulty: 'easy' },
  { id: 'g37', name: 'Fruit Machine', description: 'Classic fruit machine action!', gameType: 'slot-machine', primaryColor: '#16A34A', brandName: 'FruitSlots', duration: 30, winThreshold: 50, rewardCode: 'FRUITS20', rewardText: '20% off smoothies', collectEmail: false, difficulty: 'easy' },
  { id: 'g38', name: 'Diamond Slots', description: 'Spin for diamonds!', gameType: 'slot-machine', primaryColor: '#0EA5E9', brandName: 'DiamondClub', duration: 30, winThreshold: 100, rewardCode: 'DIAMOND', rewardText: 'Free diamond trial', collectEmail: true, difficulty: 'easy' },
  { id: 'g39', name: 'Lucky 7 Jackpot', description: 'Hit the lucky 7s!', gameType: 'slot-machine', primaryColor: '#D97706', brandName: 'Lucky7', duration: 30, winThreshold: 50, rewardCode: 'LUCKY7', rewardText: '7% off everything', collectEmail: true, difficulty: 'easy' },
  { id: 'g40', name: 'Mega Spin Slots', description: 'Mega prizes await!', gameType: 'slot-machine', primaryColor: '#EC4899', brandName: 'MegaPrize', duration: 30, winThreshold: 100, rewardCode: 'MEGA25', rewardText: '25% mega discount', collectEmail: true, difficulty: 'easy' },

  // === BRICK BREAKER VARIANTS ===
  { id: 'g41', name: 'Breakout Classic', description: 'Classic brick breaking action!', gameType: 'brick-breaker', primaryColor: '#7C3AED', brandName: 'ClassicGames', duration: 90, winThreshold: 200, rewardCode: 'BREAK15', rewardText: '15% off games', collectEmail: true, difficulty: 'medium' },
  { id: 'g42', name: 'Neon Bricks', description: 'Break neon-colored bricks!', gameType: 'brick-breaker', primaryColor: '#EC4899', brandName: 'NeonArcade', duration: 60, winThreshold: 150, rewardCode: 'NEONB20', rewardText: '20% off arcade passes', collectEmail: false, difficulty: 'easy' },
  { id: 'g43', name: 'Space Bricks', description: 'Destroy asteroid bricks in space!', gameType: 'brick-breaker', primaryColor: '#1E293B', brandName: 'SpaceBricks', duration: 90, winThreshold: 300, rewardCode: 'SPACE15', rewardText: '15% off space merch', collectEmail: true, difficulty: 'hard' },
  { id: 'g44', name: 'Ice Breaker', description: 'Break the ice blocks!', gameType: 'brick-breaker', primaryColor: '#0EA5E9', brandName: 'IceCool', duration: 60, winThreshold: 150, rewardCode: 'ICE20', rewardText: '20% off frozen treats', collectEmail: true, difficulty: 'easy' },
  { id: 'g45', name: 'Fire Brick Blitz', description: 'Blitz through fire bricks!', gameType: 'brick-breaker', primaryColor: '#DC2626', brandName: 'FireSale', duration: 45, winThreshold: 120, rewardCode: 'FIRE30', rewardText: '30% fire sale discount', collectEmail: false, difficulty: 'medium' },

  // === FRUIT CATCHER VARIANTS ===
  { id: 'g46', name: 'Apple Harvest', description: 'Catch falling apples!', gameType: 'fruit-catcher', primaryColor: '#DC2626', brandName: 'AppleFarm', duration: 45, winThreshold: 200, rewardCode: 'APPLE15', rewardText: '15% off fresh apples', collectEmail: true, difficulty: 'easy' },
  { id: 'g47', name: 'Candy Rain', description: 'Catch falling candies!', gameType: 'fruit-catcher', primaryColor: '#EC4899', brandName: 'CandyLand', duration: 30, winThreshold: 150, rewardCode: 'CANDY20', rewardText: '20% off candy', collectEmail: false, difficulty: 'easy' },
  { id: 'g48', name: 'Coin Collector', description: 'Catch gold coins from the sky!', gameType: 'fruit-catcher', primaryColor: '#D97706', brandName: 'GoldRush', duration: 45, winThreshold: 250, rewardCode: 'GOLD30', rewardText: '30% off premium items', collectEmail: true, difficulty: 'medium' },
  { id: 'g49', name: 'Gift Catcher', description: 'Catch holiday gifts!', gameType: 'fruit-catcher', primaryColor: '#16A34A', brandName: 'GiftShop', duration: 30, winThreshold: 100, rewardCode: 'GIFT10', rewardText: 'Free gift wrapping', collectEmail: true, difficulty: 'easy' },
  { id: 'g50', name: 'Star Collector', description: 'Collect falling stars!', gameType: 'fruit-catcher', primaryColor: '#7C3AED', brandName: 'StarGaze', duration: 60, winThreshold: 300, rewardCode: 'STARS25', rewardText: '25% off stargazing kits', collectEmail: true, difficulty: 'hard' },

  // === MEMORY MATCH VARIANTS ===
  { id: 'g51', name: 'Animal Memory', description: 'Match animal pairs!', gameType: 'draw-line', primaryColor: '#16A34A', brandName: 'PetShop', duration: 60, winThreshold: 200, rewardCode: 'PET15', rewardText: '15% off pet supplies', collectEmail: true, difficulty: 'easy' },
  { id: 'g52', name: 'Emoji Memory', description: 'Match emoji pairs!', gameType: 'draw-line', primaryColor: '#D97706', brandName: 'EmojiWorld', duration: 45, winThreshold: 150, rewardCode: 'EMOJI20', rewardText: '20% off stickers', collectEmail: false, difficulty: 'easy' },
  { id: 'g53', name: 'Brain Training Match', description: 'Train your brain!', gameType: 'draw-line', primaryColor: '#2563EB', brandName: 'BrainBoost', duration: 90, winThreshold: 300, rewardCode: 'BRAIN25', rewardText: '25% off courses', collectEmail: true, difficulty: 'hard' },
  { id: 'g54', name: 'Holiday Memory', description: 'Match holiday symbols!', gameType: 'draw-line', primaryColor: '#DC2626', brandName: 'HolidayFun', duration: 60, winThreshold: 200, rewardCode: 'HOLI15', rewardText: '15% off holiday decor', collectEmail: true, difficulty: 'easy' },
  { id: 'g55', name: 'Food Memory Match', description: 'Match delicious food pairs!', gameType: 'draw-line', primaryColor: '#F47B20', brandName: 'FoodieApp', duration: 45, winThreshold: 150, rewardCode: 'FOOD10', rewardText: 'Free delivery', collectEmail: true, difficulty: 'easy' },

  // === MORE MIXED VARIANTS ===
  { id: 'g56', name: 'Winter Spin', description: 'Spin the winter wheel!', gameType: 'spin-wheel', primaryColor: '#0EA5E9', brandName: 'WinterWear', duration: 30, winThreshold: 0, rewardCode: 'WINTER25', rewardText: '25% off winter clothes', collectEmail: true, difficulty: 'easy' },
  { id: 'g57', name: 'Back to School Match', description: 'Match school supplies!', gameType: 'match-3', primaryColor: '#2563EB', brandName: 'SchoolMart', duration: 60, winThreshold: 200, rewardCode: 'SCHOOL20', rewardText: '20% off school supplies', collectEmail: true, difficulty: 'easy' },
  { id: 'g58', name: 'Valentine Scratch', description: 'Scratch your valentines card!', gameType: 'scratch-card', primaryColor: '#EC4899', brandName: 'LoveShop', duration: 30, winThreshold: 0, rewardCode: 'LOVE15', rewardText: '15% off valentines gifts', collectEmail: true, difficulty: 'easy' },
  { id: 'g59', name: 'Zombie Whacker', description: 'Whack the zombies!', gameType: 'whack-a-mole', primaryColor: '#16A34A', brandName: 'HorrorShop', duration: 30, winThreshold: 120, rewardCode: 'ZOMBIE', rewardText: 'Free horror movie ticket', collectEmail: false, difficulty: 'medium' },
  { id: 'g60', name: 'Treasure Snake', description: 'Snake your way to treasure!', gameType: 'snake', primaryColor: '#D97706', brandName: 'TreasureHunt', duration: 60, winThreshold: 100, rewardCode: 'TREASURE', rewardText: 'Free treasure box', collectEmail: true, difficulty: 'medium' },
  { id: 'g61', name: 'Cosmic Slots', description: 'Spin cosmic reels!', gameType: 'slot-machine', primaryColor: '#1E293B', brandName: 'CosmicClub', duration: 30, winThreshold: 50, rewardCode: 'COSMIC20', rewardText: '20% off cosmic collection', collectEmail: true, difficulty: 'easy' },
]
