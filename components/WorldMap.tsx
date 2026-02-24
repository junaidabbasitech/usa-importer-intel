
import React from 'react';
import type { TradePartner, Theme } from '../types';

interface WorldMapProps {
  partners: TradePartner[];
  theme: Theme;
}

export const WorldMap: React.FC<WorldMapProps> = ({ partners }) => {
  return (
    <div className="relative w-full aspect-[21/9] bg-[#f8fafc] border border-slate-200 rounded-[3rem] overflow-hidden group shadow-inner cursor-crosshair">
      <div className="absolute inset-0 opacity-[0.15] pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(#0ea5e9_2.5px,transparent_2.5px)] [background-size:32px:32px]"></div>
      </div>
      
      {/* Background World Graphic (Stylized) */}
      <div className="absolute inset-0 opacity-[0.03] select-none pointer-events-none flex items-center justify-center">
         <div className="text-[24rem] font-black text-yeti-teal rotate-[-5deg] tracking-tighter">PLANET</div>
      </div>

      <div className="absolute inset-0 flex items-center justify-around p-12 flex-wrap">
         {partners.map((p, i) => (
          <div 
            key={i} 
            className="relative group/node"
            style={{ 
              transform: `translate(${Math.sin(i * 1.5) * 40}px, ${Math.cos(i * 1.5) * 40}px)` 
            }}
          >
            {/* Animated Pulser */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-yeti-teal/20 rounded-full animate-ping"></div>
              <div className="absolute w-32 h-32 bg-yeti-orange/10 rounded-full animate-pulse blur-xl"></div>
            </div>

            <div className="relative z-10 p-8 bg-white/95 backdrop-blur-md border border-slate-200 rounded-[2.5rem] shadow-2xl border-l-[8px] border-l-yeti-teal group-hover/node:border-l-yeti-orange group-hover/node:scale-110 transition-all duration-500 w-56 hover:bg-white">
               <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 group-hover/node:text-yeti-teal transition-colors leading-none">{p.country}</div>
               <div className="text-4xl font-black text-slate-900 tracking-tighter leading-none group-hover/node:text-yeti-orange transition-colors">{p.tradeVolume}</div>
               
               <div className="mt-6 flex flex-col gap-2">
                 <div className="flex justify-between text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">
                    <span>Flow Density</span>
                    <span className="text-yeti-teal font-black">{p.tradeVolume}</span>
                 </div>
                 <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                    <div className="h-full bg-gradient-to-r from-yeti-teal to-sky-400 group-hover/node:from-yeti-orange group-hover/node:to-coral transition-all duration-1000" style={{ width: p.tradeVolume }}></div>
                 </div>
               </div>

               {/* Metric label visible on map - Tooltip with country and volume */}
               <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black px-6 py-3 rounded-2xl opacity-0 group-hover/node:opacity-100 group-hover/node:bg-slate-800 transition-all shadow-2xl whitespace-nowrap uppercase tracking-[0.2em] border border-white/10 z-20 scale-90 group-hover/node:scale-100">
                  <span className="text-yeti-teal mr-2">{p.country}:</span> {p.tradeVolume} Logged
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px] border-b-slate-900"></div>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-12 left-12 flex flex-col gap-4 no-print bg-white/40 backdrop-blur-xl p-6 rounded-[2rem] border border-white/40 shadow-xl">
         <div className="flex items-center gap-4 group cursor-default">
            <div className="w-4 h-4 rounded-full bg-yeti-teal shadow-[0_0_15px_rgba(14,165,233,0.6)] animate-pulse"></div>
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">Established Lanes</span>
         </div>
         <div className="flex items-center gap-4 group cursor-default">
            <div className="w-4 h-4 rounded-full bg-yeti-orange shadow-[0_0_15px_rgba(249,115,22,0.6)] animate-ping"></div>
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.4em]">High Volume Nodes</span>
         </div>
      </div>
      
      <div className="absolute top-12 right-12 border border-slate-200 bg-white/80 backdrop-blur-xl px-8 py-3 rounded-2xl text-[11px] font-black text-slate-600 uppercase tracking-[0.3em] shadow-2xl">
         Temporal Origin Registry 2025
      </div>
    </div>
  );
};
