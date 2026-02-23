import React from 'react';
import { motion } from 'motion/react';
import { Play, Info, Trophy, Github } from 'lucide-react';

interface HomeScreenProps {
  onStart: () => void;
  onShowRules: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, onShowRules }) => {
  return (
    <div className="min-h-screen bg-emerald-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorative Cards */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-96 h-96 border-4 border-white/20 rounded-full"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -right-20 w-[500px] h-[500px] border-8 border-white/10 rounded-full"
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 flex flex-col items-center text-center max-w-lg w-full"
      >
        {/* Logo Section */}
        <div className="relative mb-12">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="w-32 h-44 bg-white rounded-2xl shadow-2xl flex flex-col p-4 text-emerald-900 border-4 border-emerald-100 relative z-20"
          >
            <div className="flex justify-between items-start w-full">
              <span className="text-2xl font-black">8</span>
              <span className="text-xl">♠</span>
            </div>
            <div className="flex-grow flex items-center justify-center text-7xl">
              ♠
            </div>
            <div className="flex justify-between items-end w-full rotate-180">
              <span className="text-2xl font-black">8</span>
              <span className="text-xl">♠</span>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ rotate: -15, x: -40 }}
            animate={{ rotate: -25, x: -60 }}
            className="absolute top-4 left-0 w-32 h-44 bg-red-50 rounded-2xl shadow-xl flex flex-col p-4 text-red-600 border-4 border-red-100 -z-10"
          >
            <div className="flex justify-between items-start w-full">
              <span className="text-2xl font-black">8</span>
              <span className="text-xl">♥</span>
            </div>
            <div className="flex-grow flex items-center justify-center text-7xl opacity-20">
              ♥
            </div>
          </motion.div>

          <motion.div 
            initial={{ rotate: 15, x: 40 }}
            animate={{ rotate: 25, x: 60 }}
            className="absolute top-4 right-0 w-32 h-44 bg-slate-50 rounded-2xl shadow-xl flex flex-col p-4 text-slate-900 border-4 border-slate-200 -z-10"
          >
            <div className="flex justify-between items-start w-full">
              <span className="text-2xl font-black">8</span>
              <span className="text-xl">♣</span>
            </div>
            <div className="flex-grow flex items-center justify-center text-7xl opacity-20">
              ♣
            </div>
          </motion.div>
        </div>

        <h1 className="text-5xl sm:text-7xl font-display font-black text-white mb-4 tracking-tighter drop-shadow-lg">
          乐悠疯狂 <span className="text-yellow-400">8</span> 点
        </h1>
        <p className="text-emerald-100/70 text-lg mb-12 font-medium max-w-xs mx-auto">
          经典纸牌游戏，挑战 AI 智慧，清空你的手牌！
        </p>

        <div className="flex flex-col gap-4 w-full px-4">
          <button 
            onClick={onStart}
            className="group relative w-full py-5 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 rounded-2xl font-black text-2xl shadow-xl shadow-yellow-900/20 transition-all active:scale-95 flex items-center justify-center gap-3"
          >
            <Play fill="currentColor" size={28} />
            开始游戏
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={onShowRules}
              className="py-4 bg-emerald-800/50 hover:bg-emerald-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10"
            >
              <Info size={20} />
              游戏规则
            </button>
            <button 
              className="py-4 bg-emerald-800/50 hover:bg-emerald-800 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2 border border-white/10 opacity-50 cursor-not-allowed"
            >
              <Trophy size={20} />
              排行榜
            </button>
          </div>
        </div>

        <div className="mt-16 flex items-center gap-6 text-emerald-100/40">
           <div className="flex flex-col items-center">
             <span className="text-2xl font-bold text-emerald-100/60">52</span>
             <span className="text-[10px] uppercase tracking-widest">张扑克</span>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="flex flex-col items-center">
             <span className="text-2xl font-bold text-emerald-100/60">1v1</span>
             <span className="text-[10px] uppercase tracking-widest">对战模式</span>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <div className="flex flex-col items-center">
             <span className="text-2xl font-bold text-emerald-100/60">8</span>
             <span className="text-[10px] uppercase tracking-widest">万能牌</span>
           </div>
        </div>
      </motion.div>

      <footer className="absolute bottom-8 text-emerald-100/30 text-xs font-medium tracking-widest uppercase">
        Designed for Fun & Strategy
      </footer>
    </div>
  );
};
