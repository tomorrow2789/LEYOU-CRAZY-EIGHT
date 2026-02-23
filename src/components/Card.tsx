import React from 'react';
import { motion } from 'motion/react';
import { CardData, Suit } from '../types';
import { getSuitColor, getSuitSymbol } from '../constants';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className,
  index = 0
}) => {
  if (!card) return null;
  const { suit, rank } = card;
  const color = getSuitColor(suit);
  const symbol = getSuitSymbol(suit);

  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -15, scale: 1.05 } : {}}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
      onClick={isPlayable ? onClick : undefined}
      className={cn(
        "relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg shadow-md cursor-pointer select-none transition-shadow",
        isFaceUp ? "bg-white" : "bg-indigo-800 border-4 border-white",
        isPlayable && "ring-4 ring-yellow-400 shadow-xl",
        !isPlayable && isFaceUp && "hover:shadow-lg",
        className
      )}
    >
      {isFaceUp ? (
        <div className={cn("flex flex-col h-full p-2", color)}>
          <div className="flex justify-between items-start">
            <span className="text-lg sm:text-xl font-bold leading-none">{rank}</span>
            <span className="text-sm sm:text-base leading-none">{symbol}</span>
          </div>
          <div className="flex-grow flex items-center justify-center text-3xl sm:text-5xl">
            {symbol}
          </div>
          <div className="flex justify-between items-end rotate-180">
            <span className="text-lg sm:text-xl font-bold leading-none">{rank}</span>
            <span className="text-sm sm:text-base leading-none">{symbol}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4/5 h-4/5 border-2 border-white/30 rounded flex items-center justify-center">
             <div className="text-white/20 text-4xl font-black">8</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
