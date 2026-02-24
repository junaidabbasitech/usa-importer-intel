
import React from 'react';
import type { ShipmentVolume, Theme } from '../types';

interface ShipmentVolumeChartProps {
  data: ShipmentVolume[];
  theme: Theme;
}

export const ShipmentVolumeChart: React.FC<ShipmentVolumeChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(d => d.volume));

  return (
    <div className="w-full pb-12">
      <div className="relative h-[350px] flex items-end gap-3 sm:gap-6 px-12">
        {/* Y-Axis Guideline */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200 flex flex-col justify-between text-[11px] font-black text-slate-400 py-1">
           <span className="bg-white px-2 -ml-4 border border-slate-200 rounded-lg shadow-sm">{maxVal}</span>
           <span className="bg-white px-2 -ml-4 border border-slate-200 rounded-lg shadow-sm">0</span>
        </div>

        {data.map((d, i) => (
          <div key={i} className="flex-grow flex flex-col items-center group relative h-full">
            <div 
              className="w-full bg-gradient-to-t from-yeti-teal to-sky-400 rounded-t-2xl hover:from-yeti-orange hover:to-orange-400 transition-all duration-500 cursor-pointer relative shadow-2xl group-hover:shadow-orange-200 group-hover:-translate-y-2 border-x border-t border-white/20"
              style={{ height: `${(d.volume / maxVal) * 100}%` }}
            >
              {/* Floating label on hover - now showing Year and Volume */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[11px] font-black px-5 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap shadow-2xl border border-white/10 scale-75 group-hover:scale-100 z-10 origin-bottom">
                <div className="text-yeti-teal uppercase tracking-widest text-[9px] mb-1">{d.year} Log</div>
                <div>{d.volume} TEUs Verified</div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900"></div>
              </div>
              
              {/* Inner highlight glass effect */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2 h-1/2 bg-white/20 rounded-full blur-[4px]"></div>
            </div>
            
            <div className="absolute -bottom-10 text-[11px] font-black text-slate-500 uppercase mt-6 tracking-[0.3em] transition-all group-hover:text-slate-900 group-hover:scale-110">
               {d.year}
            </div>
          </div>
        ))}
      </div>
      
      {/* Grid Lines Overlay */}
      <div className="absolute inset-0 pointer-events-none px-12">
         <div className="h-full flex flex-col justify-between border-y border-slate-100 border-dashed opacity-50">
           <div className="w-full h-px border-t border-slate-100 shadow-sm"></div>
           <div className="w-full h-px border-t border-slate-100 shadow-sm"></div>
           <div className="w-full h-px border-t border-slate-100 shadow-sm"></div>
           <div className="w-full h-px border-t border-slate-100 shadow-sm"></div>
         </div>
      </div>
    </div>
  );
};
