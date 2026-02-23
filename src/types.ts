export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface CardData {
  id: string;
  suit: Suit;
  rank: Rank;
  value: number;
}

export type GameStatus = 'home' | 'waiting' | 'playing' | 'suit_selection' | 'game_over';
export type Turn = 'player' | 'ai';

export interface GameState {
  deck: CardData[];
  playerHand: CardData[];
  aiHand: CardData[];
  discardPile: CardData[];
  currentTurn: Turn;
  currentSuit: Suit | null;
  status: GameStatus;
  winner: Turn | null;
  lastAction: string;
}
