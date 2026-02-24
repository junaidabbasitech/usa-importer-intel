
import React from 'react';
import type { ImporterSummary } from '../types';
import { BoxIcon, CalendarDaysIcon, MapPinIcon, PhoneIcon, CodeBracketIcon } from './icons';

interface ImporterSummaryCardProps {
  summary: ImporterSummary;
  onViewDetails: (name: string) => void;
}

export const ImporterSummaryCard: React.FC<ImporterSummaryCardProps> = ({ summary, onViewDetails }) => {
  return (
    <div className="relative bg-white border border-slate-200 rounded-3xl group transition-all duration-500 hover:border-yeti-orange hover:shadow-2xl overflow-hidden shadow-sm">
      <div className="p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6">
            <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-900 group-hover:text-yeti-orange transition-colors uppercase tracking-tight">{summary.importerName}</h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2 font-bold group-hover:text-yeti-orange transition-colors">
                        <MapPinIcon className="w-4 h-4 text-yeti-teal group-hover:text-yeti-orange" />
                        <span>{summary.location}</span>
                    </div>
                    {summary.source && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full text-xs bg-slate-900 text-white font-black uppercase tracking-widest border border-slate-800 group-hover:bg-yeti-orange group-hover:border-yeti-orange transition-all">
                            <CodeBracketIcon className="w-3 h-3 text-yeti-teal group-hover:text-white" />
                            <span>{summary.source}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex-shrink-0">
                <button
                  onClick={() => onViewDetails(summary.importerName)}
                  className="w-full sm:w-auto text-center bg-yeti-teal text-white font-black py-4 px-10 rounded-2xl hover:bg-yeti-orange transition-all text-xs uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-sky-100 hover:shadow-orange-100 cursor-pointer"
                >
                  Dossier Intel
                </button>
            </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-100 space-y-4 text-slate-700">
            <div className="flex items-start gap-4 text-sm">
                <BoxIcon className="w-5 h-5 text-yeti-teal group-hover:text-yeti-orange transition-colors flex-shrink-0 mt-0.5" />
                <div className="font-bold">
                    <span className="mr-2 text-slate-400 uppercase text-[10px] tracking-[0.2em]">Audited Commodities:</span>
                    <span className="text-slate-900 group-hover:text-slate-950 transition-colors">{summary.primaryCommodities}</span>
                </div>
            </div>
            <div className="flex items-start gap-4 text-sm">
                <CalendarDaysIcon className="w-5 h-5 text-yeti-teal group-hover:text-yeti-orange transition-colors flex-shrink-0 mt-0.5" />
                <div className="font-bold">
                    <span className="mr-2 text-slate-400 uppercase text-[10px] tracking-[0.2em]">Latest ACE Entry:</span>
                    <span className="text-slate-900 group-hover:text-slate-950 transition-colors">{summary.lastShipmentDate}</span>
                </div>
            </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-gradient-to-r from-yeti-teal to-yeti-orange opacity-0 group-hover:opacity-100 transition-all duration-700" />
    </div>
  );
};
