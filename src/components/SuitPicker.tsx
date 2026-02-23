import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Suit } from '../types';
import { getSuitColor, getSuitSymbol, SUITS } from '../constants';

interface SuitPickerProps {
  onSelect: (suit: Suit) => void;
}

export const SuitPicker: React.FC<SuitPickerProps> = ({ onSelect }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full mx-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">选择一个花色</h2>
        <div className="grid grid-cols-2 gap-4">
          {SUITS.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
            >
              <span className={`text-4xl mb-2 ${getSuitColor(suit)} group-hover:scale-125 transition-transform`}>
                {getSuitSymbol(suit)}
              </span>
              <span className="text-sm font-medium text-slate-600 capitalize">
                {suit === 'hearts' ? '红心' : suit === 'diamonds' ? '方块' : suit === 'clubs' ? '梅花' : '黑桃'}
              </span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
