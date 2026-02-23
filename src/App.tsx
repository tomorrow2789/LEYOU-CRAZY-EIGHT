/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Card } from './components/Card';
import { SuitPicker } from './components/SuitPicker';
import { HomeScreen } from './components/HomeScreen';
import { CardData, Suit, GameState, Turn, GameStatus } from './types';
import { createDeck, shuffleDeck, getSuitSymbol, getSuitColor } from './constants';
import { Trophy, RotateCcw, Info, User, Cpu, Layers } from 'lucide-react';

export default function App() {
  const [game, setGame] = useState<GameState>({
    deck: [],
    playerHand: [],
    aiHand: [],
    discardPile: [],
    currentTurn: 'player',
    currentSuit: null,
    status: 'home',
    winner: null,
    lastAction: '欢迎来到疯狂 8 点！'
  });

  const [showRules, setShowRules] = useState(false);

  // Initialize Game
  const initGame = useCallback(() => {
    const fullDeck = shuffleDeck(createDeck());
    const playerHand = fullDeck.splice(0, 8);
    const aiHand = fullDeck.splice(0, 8);
    
    // Initial discard must not be an 8
    let discardIndex = 0;
    while (fullDeck[discardIndex].rank === '8') {
      discardIndex++;
    }
    const discardPile = [fullDeck.splice(discardIndex, 1)[0]];
    
    setGame({
      deck: fullDeck,
      playerHand,
      aiHand,
      discardPile,
      currentTurn: 'player',
      currentSuit: discardPile[0].suit,
      status: 'playing',
      winner: null,
      lastAction: '游戏开始！你的回合。'
    });
  }, []);

  useEffect(() => {
    if (game.status === 'waiting') {
      initGame();
    }
  }, [game.status, initGame]);

  const topDiscard = game.discardPile.length > 0 ? game.discardPile[game.discardPile.length - 1] : null;

  const isCardPlayable = useCallback((card: CardData) => {
    if (!topDiscard) return false;
    if (card.rank === '8') return true;
    if (game.currentSuit && card.suit === game.currentSuit) return true;
    if (card.rank === topDiscard.rank) return true;
    return false;
  }, [game.currentSuit, topDiscard]);

  const checkWinner = (hand: CardData[], turn: Turn) => {
    if (hand.length === 0) {
      setGame(prev => ({
        ...prev,
        status: 'game_over',
        winner: turn,
        lastAction: turn === 'player' ? '恭喜你赢了！' : 'AI 赢了，再接再厉！'
      }));
      if (turn === 'player') {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
      return true;
    }
    return false;
  };

  const playCard = (card: CardData, turn: Turn) => {
    const isPlayer = turn === 'player';
    const handKey = isPlayer ? 'playerHand' : 'aiHand';
    const nextTurn: Turn = isPlayer ? 'ai' : 'player';

    const newHand = game[handKey].filter(c => c.id !== card.id);
    
    if (card.rank === '8') {
      setGame(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: [...prev.discardPile, card],
        status: isPlayer ? 'suit_selection' : 'playing',
        lastAction: `${isPlayer ? '你' : 'AI'} 打出了 8！`
      }));
      
      // If AI plays 8, it chooses its most frequent suit
      if (!isPlayer) {
        setTimeout(() => {
          const suits = newHand.map(c => c.suit);
          const mostFrequentSuit = suits.length > 0 
            ? suits.sort((a,b) => suits.filter(v => v===a).length - suits.filter(v => v===b).length).pop()!
            : 'hearts';
          handleSuitSelection(mostFrequentSuit as Suit, 'ai');
        }, 1000);
      }
    } else {
      setGame(prev => ({
        ...prev,
        [handKey]: newHand,
        discardPile: [...prev.discardPile, card],
        currentSuit: card.suit,
        currentTurn: nextTurn,
        lastAction: `${isPlayer ? '你' : 'AI'} 打出了 ${getSuitSymbol(card.suit)}${card.rank}`
      }));
      checkWinner(newHand, turn);
    }
  };

  const handleSuitSelection = (suit: Suit, turn: Turn) => {
    const isPlayer = turn === 'player';
    const nextTurn: Turn = isPlayer ? 'ai' : 'player';
    
    setGame(prev => {
      const winnerFound = checkWinner(isPlayer ? prev.playerHand : prev.aiHand, turn);
      if (winnerFound) return prev;

      return {
        ...prev,
        currentSuit: suit,
        currentTurn: nextTurn,
        status: 'playing',
        lastAction: `${isPlayer ? '你' : 'AI'} 将花色改为 ${getSuitSymbol(suit)}`
      };
    });
  };

  const drawCard = (turn: Turn) => {
    if (game.deck.length === 0) {
      setGame(prev => ({
        ...prev,
        currentTurn: turn === 'player' ? 'ai' : 'player',
        lastAction: '摸牌堆已空，跳过回合。'
      }));
      return;
    }

    const newDeck = [...game.deck];
    const drawnCard = newDeck.pop()!;
    const handKey = turn === 'player' ? 'playerHand' : 'aiHand';
    const newHand = [...game[handKey], drawnCard];

    setGame(prev => ({
      ...prev,
      deck: newDeck,
      [handKey]: newHand,
      lastAction: `${turn === 'player' ? '你' : 'AI'} 摸了一张牌`
    }));

    // If player draws, they might be able to play it immediately or turn ends
    // For simplicity, drawing ends the turn if not playable
    if (turn === 'player') {
      if (!isCardPlayable(drawnCard)) {
        setTimeout(() => {
          setGame(prev => ({ ...prev, currentTurn: 'ai' }));
        }, 1000);
      }
    } else {
      // AI logic after drawing
      if (isCardPlayable(drawnCard)) {
        setTimeout(() => playCard(drawnCard, 'ai'), 1000);
      } else {
        setTimeout(() => {
          setGame(prev => ({ ...prev, currentTurn: 'ai' })); // This is wrong, should be player
          setGame(prev => ({ ...prev, currentTurn: 'player' }));
        }, 1000);
      }
    }
  };

  // AI Turn Logic
  useEffect(() => {
    if (game.status === 'playing' && game.currentTurn === 'ai' && !game.winner) {
      const timer = setTimeout(() => {
        const playableCards = game.aiHand.filter(isCardPlayable);
        if (playableCards.length > 0) {
          // AI strategy: play non-8 cards first, or play 8 if it's the only option
          const nonEight = playableCards.find(c => c.rank !== '8');
          playCard(nonEight || playableCards[0], 'ai');
        } else {
          drawCard('ai');
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [game.currentTurn, game.status, game.aiHand, isCardPlayable]);

  return (
    <div className="min-h-screen bg-emerald-900 text-white font-sans selection:bg-emerald-500/30 overflow-hidden flex flex-col">
      <AnimatePresence mode="wait">
        {game.status === 'home' ? (
          <HomeScreen 
            key="home"
            onStart={() => setGame(prev => ({ ...prev, status: 'waiting' }))} 
            onShowRules={() => setShowRules(true)}
          />
        ) : (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col flex-grow h-full min-h-0"
          >
            {/* Header */}
            <header className="shrink-0 p-3 sm:p-4 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/10 z-30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-2xl font-black text-emerald-900">8</span>
          </div>
          <h1 className="text-xl font-display font-bold tracking-tight hidden sm:block">乐悠疯狂 8 点</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium flex items-center gap-2">
            <Layers size={14} />
            <span>剩余: {game.deck.length}</span>
          </div>
          <button 
            onClick={() => setShowRules(true)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <Info size={20} />
          </button>
          <button 
            onClick={() => setGame(prev => ({ ...prev, status: 'waiting' }))}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow relative flex flex-col justify-between p-2 sm:p-4 overflow-hidden min-h-0">
        {/* AI Hand */}
        <div className="flex flex-col items-center gap-1 shrink-0">
          <div className="flex items-center gap-2 text-emerald-200 mb-1">
            <Cpu size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">AI 对手 ({game.aiHand.length})</span>
          </div>
          <div className="flex -space-x-10 sm:-space-x-16 justify-center max-w-full overflow-x-auto pb-2 px-4">
            {game.aiHand.map((card, i) => (
              <Card key={card.id} card={card} isFaceUp={false} index={i} className="shadow-xl scale-90 sm:scale-100" />
            ))}
          </div>
        </div>

        {/* Center Table */}
        <div className="flex flex-grow items-center justify-center gap-6 sm:gap-16 py-2">
          {/* Draw Pile */}
          <div className="flex flex-col items-center gap-2">
            <div 
              onClick={() => game.currentTurn === 'player' && game.status === 'playing' && drawCard('player')}
              className={`relative cursor-pointer group ${game.currentTurn !== 'player' ? 'opacity-50 grayscale' : ''}`}
            >
              {game.deck.length > 0 ? (
                <>
                  <div className="absolute inset-0 translate-x-1 translate-y-1 bg-indigo-950 rounded-lg -z-10"></div>
                  <Card card={game.deck[0]} isFaceUp={false} className="group-hover:-translate-y-1 transition-transform scale-90 sm:scale-100" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="bg-black/60 px-2 py-1 rounded text-[10px] font-bold">摸牌</span>
                  </div>
                </>
              ) : (
                <div className="w-16 h-24 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center">
                  <span className="text-[10px] text-white/40">空</span>
                </div>
              )}
            </div>
          </div>

          {/* Discard Pile */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <AnimatePresence mode="popLayout">
                {topDiscard && (
                  <Card 
                    key={topDiscard.id} 
                    card={topDiscard} 
                    className="shadow-2xl ring-2 ring-white/20 scale-90 sm:scale-100" 
                  />
                )}
              </AnimatePresence>
              {game.currentSuit && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl border-2 border-emerald-500 animate-pulse z-10">
                  <span className={`text-xl ${getSuitColor(game.currentSuit)}`}>
                    {getSuitSymbol(game.currentSuit)}
                  </span>
                </div>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">弃牌堆</span>
          </div>
        </div>

        {/* Player Hand */}
        <div className="flex flex-col items-center gap-2 shrink-0 pb-2">
          <div className="flex items-center gap-2 text-emerald-200">
            <User size={14} />
            <span className="text-xs font-bold uppercase tracking-wider">你的手牌 ({game.playerHand.length})</span>
          </div>
          <div className="flex -space-x-6 sm:-space-x-12 justify-center max-w-full overflow-x-auto py-2 px-6 min-h-[110px] sm:min-h-[160px]">
            {game.playerHand.map((card, i) => (
              <Card 
                key={card.id} 
                card={card} 
                index={i}
                className="scale-90 sm:scale-100"
                isPlayable={game.currentTurn === 'player' && game.status === 'playing' && isCardPlayable(card)}
                onClick={() => playCard(card, 'player')}
              />
            ))}
          </div>
        </div>
      </main>

            {/* Footer Status */}
            <footer className="shrink-0 p-2 sm:p-3 bg-black/40 backdrop-blur-md border-t border-white/10 text-center z-30">
              <p className="text-emerald-100 text-xs sm:text-sm font-medium">
                {game.lastAction}
              </p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {game.status === 'suit_selection' && (
          <SuitPicker onSelect={(suit) => handleSuitSelection(suit, 'player')} />
        )}

        {game.status === 'game_over' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            >
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="text-yellow-600" size={40} />
              </div>
              <h2 className="text-3xl font-black mb-2">
                {game.winner === 'player' ? '你赢了！' : 'AI 赢了'}
              </h2>
              <p className="text-slate-500 mb-8">
                {game.winner === 'player' ? '太棒了，你是个纸牌大师！' : '别灰心，再来一局挑战 AI 吧。'}
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setGame(prev => ({ ...prev, status: 'waiting' }))}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={20} />
                  再玩一次
                </button>
                <button 
                  onClick={() => setGame(prev => ({ ...prev, status: 'home' }))}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all active:scale-95"
                >
                  返回首页
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showRules && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl max-w-md w-full"
            >
              <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                <Info className="text-indigo-600" />
                游戏规则
              </h2>
              <ul className="space-y-3 text-slate-600 text-sm sm:text-base">
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">1.</span>
                  <span>每人初始发 8 张牌。</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">2.</span>
                  <span>出牌必须与弃牌堆顶部的牌在<span className="font-bold">花色</span>或<span className="font-bold">点数</span>上匹配。</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">3.</span>
                  <span><span className="font-bold text-emerald-600">数字 8 是万能牌</span>，可以在任何时候打出，并指定一个新的花色。</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">4.</span>
                  <span>无牌可出时必须摸一张牌。</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-indigo-600">5.</span>
                  <span>最先清空手牌的人获胜！</span>
                </li>
              </ul>
              <button 
                onClick={() => setShowRules(false)}
                className="w-full mt-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition-all"
              >
                知道了
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
