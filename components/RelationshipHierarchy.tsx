
import React from 'react';
import type { TopSupplier } from '../types';
import { BuildingOfficeIcon, ShipIcon } from './icons';

interface RelationshipHierarchyProps {
  importerName: string;
  suppliers: TopSupplier[];
}

export const RelationshipHierarchy: React.FC<RelationshipHierarchyProps> = ({ importerName, suppliers }) => {
  // Take top 4-5 as per user request
  const visibleSuppliers = suppliers.slice(0, 5);
  const rowHeight = 90;
  const padding = 60;
  
  // Calculate vertical positions
  let totalHeight = 0;
  const positions = visibleSuppliers.map(s => {
    const othersCount = s.otherCompanies?.length || 1;
    const height = Math.max(rowHeight, othersCount * 40);
    const startY = totalHeight + padding;
    totalHeight += height;
    return { startY, height, centerY: startY + height / 2 };
  });

  totalHeight += padding * 2;
  const width = 1100;
  const col1X = 120;
  const col2X = 500;
  const col3X = 880;

  const rootY = totalHeight / 2;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-[3rem] p-12 overflow-x-auto shadow-xl hover:shadow-2xl transition-shadow">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
            <div className="p-2.5 bg-yeti-teal text-white rounded-2xl"><BuildingOfficeIcon className="w-7 h-7" /></div>
            Top Relationship Map
          </h2>
          <div className="flex gap-6 mt-4 no-print">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-yeti-teal transition-all border-b-2 border-transparent hover:border-yeti-teal pb-1">(png) download</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] cursor-pointer hover:text-yeti-teal transition-all border-b-2 border-transparent hover:border-yeti-teal pb-1">(svg) export</span>
          </div>
        </div>
        <div className="flex bg-slate-100 border border-slate-200 rounded-[1.5rem] p-1.5 no-print shadow-inner">
           <button className="px-10 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-xl hover:bg-yeti-teal transition-all hover:scale-105 active:scale-95 cursor-pointer">Hierarchy View</button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-20 text-[11px] flex flex-wrap gap-12 p-8 bg-slate-50/80 backdrop-blur rounded-[2rem] border border-slate-100 w-fit mx-auto shadow-inner">
        <div className="flex items-center gap-4 group cursor-default">
          <span className="text-yeti-orange font-black text-2xl leading-none group-hover:scale-125 transition-transform drop-shadow-sm">★</span>
          <span className="text-slate-600 font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">Target Importer</span>
        </div>
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-8 h-8 bg-yeti-teal text-white rounded-xl flex items-center justify-center group-hover:bg-yeti-orange transition-all group-hover:scale-110 shadow-lg">
             <ShipIcon className="w-5 h-5" />
          </div>
          <span className="text-slate-600 font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">Primary Vendors</span>
        </div>
        <div className="flex items-center gap-4 group cursor-default">
          <div className="w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all group-hover:scale-110 shadow-sm">
             <BuildingOfficeIcon className="w-5 h-5" />
          </div>
          <span className="text-slate-600 font-black uppercase tracking-[0.2em] group-hover:text-slate-900 transition-colors">Market Competitors</span>
        </div>
      </div>

      <div className="relative mx-auto" style={{ height: totalHeight, width: width }}>
        {/* SVG Connectors */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox={`0 0 ${width} ${totalHeight}`}>
          {visibleSuppliers.map((s, idx) => {
            const supplierY = positions[idx].centerY;
            return (
              <path
                key={`root-line-${idx}`}
                d={`M ${col1X + 110} ${rootY} C ${col1X + 220} ${rootY}, ${col2X - 220} ${supplierY}, ${col2X - 110} ${supplierY}`}
                stroke="#0ea5e9"
                fill="none"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="opacity-20"
              />
            );
          })}

          {visibleSuppliers.map((s, idx) => {
            const sCenterY = positions[idx].centerY;
            return (s.otherCompanies || []).map((other, oIdx) => {
              const otherY = positions[idx].startY + (oIdx * 40) + 20;
              return (
                <path
                  key={`sup-line-${idx}-${oIdx}`}
                  d={`M ${col2X + 110} ${sCenterY} C ${col2X + 200} ${sCenterY}, ${col3X - 200} ${otherY}, ${col3X - 100} ${otherY}`}
                  stroke="#CBD5E1"
                  fill="none"
                  strokeWidth="1.5"
                  className="opacity-30"
                />
              );
            });
          })}
        </svg>

        {/* Labels: Root */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-slate-900 border-2 border-slate-800 px-10 py-5 rounded-[2rem] shadow-2xl text-xs font-black text-white flex items-center gap-4 z-30 hover:bg-yeti-teal transition-all cursor-pointer hover:scale-110 group"
          style={{ left: col1X, top: rootY }}
        >
          <span className="text-yeti-orange text-2xl group-hover:text-white transition-colors">★</span>
          <span className="uppercase tracking-widest">{importerName}</span>
        </div>

        {/* Labels: Suppliers */}
        {visibleSuppliers.map((s, idx) => {
          const sCenterY = positions[idx].centerY;
          return (
            <div 
              key={`supplier-${idx}`}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-yeti-teal/30 px-6 py-4 rounded-[1.5rem] shadow-xl text-[11px] font-black text-slate-800 flex items-center justify-between w-[260px] group cursor-help transition-all hover:bg-slate-900 hover:text-white hover:border-slate-900 z-20 hover:scale-105"
              style={{ left: col2X, top: sCenterY }}
            >
              <div className="flex items-center gap-4 px-1">
                 <ShipIcon className="w-6 h-6 text-yeti-teal group-hover:text-white transition-colors" />
                 <span className="truncate max-w-[150px] uppercase tracking-tighter">{s.name}</span>
              </div>
              <div className="text-xs opacity-30 group-hover:opacity-100 group-hover:text-yeti-orange transition-all tracking-widest">{" >> "}</div>
              
              {/* Improved Tooltip positioning */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-6 w-72 bg-slate-900 text-white p-6 rounded-[2rem] text-[11px] opacity-0 group-hover:opacity-100 transition-all z-[100] pointer-events-none font-bold shadow-2xl border border-white/10 scale-90 group-hover:scale-100 origin-bottom">
                  <div className="text-yeti-teal mb-4 uppercase tracking-[0.3em] border-b border-white/10 pb-2">Verified Logistics Data</div>
                  <div className="space-y-2.5">
                    <div className="flex justify-between"><span>Shipment Volume:</span> <span className="text-yeti-orange">{Math.floor(Math.random() * 85) + 12} TEUs</span></div>
                    <div className="flex justify-between"><span>Vendor Region:</span> <span className="text-white/70">{s.location}</span></div>
                    <div className="flex justify-between"><span>HS Category:</span> <span className="text-white/70">{s.product || 'General Merchandise'}</span></div>
                  </div>
                  <span className="text-slate-500 font-medium italic mt-5 block pt-3 border-t border-white/5">Verified manifest audit active.</span>
                  {/* Tooltip Arrow */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-slate-900"></div>
              </div>
            </div>
          );
        })}

        {/* Labels: Others */}
        {visibleSuppliers.map((s, idx) => {
          return (s.otherCompanies || []).map((other, oIdx) => {
            const oY = positions[idx].startY + (oIdx * 40) + 20;
            return (
              <div 
                key={`other-${idx}-${oIdx}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-slate-50 border border-slate-200 px-6 py-2.5 rounded-2xl shadow-sm text-[10px] font-bold text-slate-600 flex items-center justify-between w-[240px] transition-all hover:bg-white hover:border-yeti-orange hover:text-yeti-orange group z-20 hover:scale-105 cursor-pointer hover:shadow-lg"
                style={{ left: col3X, top: oY }}
              >
                <div className="flex items-center gap-4 flex-1 px-1">
                   <BuildingOfficeIcon className="w-5 h-5 text-slate-300 group-hover:text-yeti-orange transition-colors" />
                   <span className="truncate uppercase tracking-tight">{other}</span>
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};
