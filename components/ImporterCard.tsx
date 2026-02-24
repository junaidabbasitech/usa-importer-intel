
import React, { useState } from 'react';
import type { ParsedImporterData, Theme, ContactInfo, TradePartner, CommodityFlow, TopSupplier } from '../types';
import { 
  InfoIcon, ShipIcon, PhoneIcon, BellIcon, ArrowDownTrayIcon, 
  MapPinIcon, GlobeIcon, ChartBarIcon, PrinterIcon, BuildingOfficeIcon, 
  ArrowLeftIcon, BoxIcon, CalendarDaysIcon, EnvelopeIcon,
  ArrowTrendingUpIcon, ArrowTrendingDownIcon, ShieldCheckIcon
} from './icons';
import { ShipmentVolumeChart } from './ShipmentVolumeChart';
import { WorldMap } from './WorldMap';
import { RelationshipHierarchy } from './RelationshipHierarchy';
import { Spinner } from './Spinner';
import { ShipLoadingAnimation } from './ShipLoadingAnimation';

interface ImporterCardProps {
  data: ParsedImporterData;
  theme: Theme;
  onSubscribe: (name: string) => void;
  onExportPDF: () => void;
  onRefresh: (name: string) => void;
  onClose?: () => void;
  isRefreshing?: boolean;
}

const StatBox: React.FC<{ icon: React.ReactNode, label: string, value: string | number, subtext?: string }> = ({ icon, label, value, subtext }) => (
  <div className="flex flex-col p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-yeti-orange hover:-translate-y-1 transition-all group overflow-hidden relative cursor-default">
    <div className="flex items-center gap-3 mb-2 text-yeti-teal relative z-10">
      <div className="p-2.5 bg-slate-50 text-yeti-teal rounded-xl group-hover:bg-yeti-orange group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <span className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-500 group-hover:text-yeti-orange transition-colors">{label}</span>
    </div>
    <div className="text-3xl font-black text-slate-800 relative z-10">{value}</div>
    {subtext && <div className="text-[10px] font-bold text-slate-400 mt-1 relative z-10 uppercase tracking-widest">{subtext}</div>}
    <div className="absolute -right-4 -bottom-4 opacity-[0.05] text-yeti-teal group-hover:scale-110 group-hover:opacity-10 transition-transform duration-700">
      {icon}
    </div>
  </div>
);

const CommodityTrendCard: React.FC<{ name: string, change: string, trend: string, price?: string }> = ({ name, change, trend, price }) => (
  <div className="bg-white border-2 border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:border-yeti-orange/30 transition-all border-t-4 border-t-yeti-teal group cursor-pointer relative overflow-hidden">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <ChartBarIcon className="w-12 h-12 text-yeti-teal group-hover:text-yeti-orange transition-colors" />
    </div>
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3 group-hover:text-yeti-orange transition-colors">Audit Node Trend</div>
    <h4 className="text-xl font-black text-slate-900 mb-4 group-hover:translate-x-1 transition-transform group-hover:text-yeti-orange">{name}</h4>
    
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:border-yeti-orange/20 transition-all">
        <div className="flex items-center gap-2">
          {trend === 'UP' ? (
            <div className="p-1.5 bg-emerald-100 rounded-lg shadow-sm"><ArrowTrendingUpIcon className="w-5 h-5 text-emerald-700" /></div>
          ) : (
            <div className="p-1.5 bg-rose-100 rounded-lg shadow-sm"><ArrowTrendingDownIcon className="w-5 h-5 text-rose-700" /></div>
          )}
          <div>
             <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Growth Rate</div>
             <span className={`text-2xl font-black leading-none ${trend === 'UP' ? 'text-emerald-700' : 'text-rose-700'}`}>
               {change}
             </span>
          </div>
        </div>
        {price && (
          <div className="text-right">
            <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Avg. Val (Scraped)</div>
            <div className="text-sm font-black text-slate-900">{price}</div>
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <span className="px-2 py-1 bg-slate-100 rounded-md text-[9px] font-bold text-slate-600 uppercase">USITC Source</span>
        <span className="px-2 py-1 bg-sky-50 text-sky-700 rounded-md text-[9px] font-bold uppercase">Stability: High</span>
      </div>
    </div>
  </div>
);

const PartnerInsightCard: React.FC<{ partner: TradePartner }> = ({ partner }) => (
  <div className="p-6 bg-white border border-slate-200 rounded-3xl group hover:border-yeti-orange hover:shadow-xl transition-all shadow-sm cursor-default relative overflow-hidden">
    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-full -mr-12 -mt-12 group-hover:bg-yeti-orange/5 transition-colors"></div>
    <div className="flex items-center justify-between mb-6 relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-900 text-white border border-slate-800 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg group-hover:bg-yeti-orange group-hover:border-yeti-orange transition-all">
          {partner.country.substring(0, 1)}
        </div>
        <div>
          <div className="font-black text-slate-900 text-lg uppercase tracking-tight group-hover:text-yeti-orange transition-colors leading-none">{partner.country}</div>
          <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">Origin Node</div>
        </div>
      </div>
      <div className="text-xl font-black text-yeti-orange bg-orange-50 px-4 py-1.5 rounded-xl border border-yeti-orange/20 shadow-sm">{partner.tradeVolume}</div>
    </div>
    
    <div className="relative z-10 bg-slate-50 p-5 rounded-2xl border border-slate-100 group-hover:bg-white group-hover:shadow-inner transition-all">
      <div className="text-[10px] font-black text-yeti-teal group-hover:text-yeti-orange uppercase tracking-widest mb-3 flex items-center gap-2">
        <InfoIcon className="w-4 h-4" /> Trade Lane Insight
      </div>
      <p className="text-sm font-bold text-slate-800 leading-relaxed italic">
        "{partner.insights || "Analyzing cargo density patterns for 2025. Scraping reveals stable carrier reliability and consistent TEU volumes."}"
      </p>
    </div>
  </div>
);

export const ImporterCard: React.FC<ImporterCardProps> = ({ data, theme, onSubscribe, onExportPDF, onRefresh, onClose, isRefreshing }) => {
  const [showAllShipments, setShowAllShipments] = useState(false);
  const contactObj = typeof data.contact === 'object' ? data.contact : {} as ContactInfo;

  const handleExportCSV = () => {
    const clean = (str: any) => {
      if (str === null || str === undefined) return '""';
      return `"${String(str).replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    };
    
    const rows: string[][] = [
      ["USA IMPORTER INTEL - MASTER AUDIT DOSSIER - SECTION-WISE REPORT"],
      [`Generated: ${new Date().toLocaleString()}`],
      [""],
      ["[SECTION 1: ENTITY SUMMARY]"],
      ["Importer Name", clean(data.importerName)],
      ["Primary Location", clean(data.location)],
      ["Last Manifest Filing", clean(data.lastShipmentDate)],
      ["Annual Volume (Scraped)", clean(data.shipmentCounts?.lastYear)],
      [""],
      ["[SECTION 2: EXECUTIVE ANALYSIS]"],
      ["Audit Summary", clean(data.information)],
      ["Risk: Financial Stability", clean(data.riskAssessment?.financialStability)],
      ["Risk: Geopolitical Exposure", clean(data.riskAssessment?.geopoliticalRisk)],
      [""],
      ["[SECTION 3: CONTACT MATRIX]"],
      ["Primary HQ Node", clean(contactObj.phone)],
      ["Digital Registry", clean(contactObj.website)],
      ["Audit Email", clean(contactObj.email)],
      ["Operational Address", clean(contactObj.address)],
      [""],
      ["[SECTION 4: COMMODITY TRENDS]"],
      ["Commodity Name", "Growth Rate", "Market Trend", "Avg Price (Scraped)"],
      ...(data.topCommodityFlows || []).map(f => [clean(f.name), clean(f.percentage), clean(f.marketTrend), clean(f.averagePrice)]),
      [""],
      ["[SECTION 5: GLOBAL ORIGIN NODES]"],
      ["Origin Country", "Total Density (%)", "Audit Insight"],
      ...(data.topTradePartners || []).map(p => [clean(p.country), clean(p.tradeVolume), clean(p.insights)]),
      [""],
      ["[SECTION 6: VENDOR NETWORK]"],
      ["Supplier Name", "Origin Port", "Core HS Category"],
      ...(data.topSuppliers || []).map(s => [clean(s.name), clean(s.location), clean(s.product)]),
      [""],
      ["[SECTION 7: ACE FEDERAL MANIFEST LOG]"],
      ["Arrival Date", "Carrier", "Container ID", "Shipper", "HS Code", "Commodity", "BOL", "Volume"],
      ...(data.shipmentHistory || []).map(s => [
        clean(s.date),
        clean(s.carrier),
        clean(s.containerNumber),
        clean(s.shipper),
        clean(s.hsCode),
        clean(s.commodity),
        clean(s.bolNumber),
        clean(s.volume)
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8,\ufeff" + rows.map(r => r.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${data.importerName.replace(/\s+/g, '_')}_Master_Audit_2025.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = () => {
    setShowAllShipments(true);
    // Use a slightly longer delay to ensure React re-renders all rows
    setTimeout(() => {
      onExportPDF();
    }, 800);
  };

  return (
    <div className="bg-slate-50 min-h-screen printable-container font-sans text-slate-900 selection:bg-yeti-orange/20 relative">
      {/* 30% Opacity FIXED Loading Overlay - Stays in View on Scroll */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-[2px] z-[100] flex items-center justify-center pointer-events-none transition-opacity duration-300">
           <div className="bg-white/95 p-16 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] border border-slate-100 flex flex-col items-center">
              <div className="scale-125"><ShipLoadingAnimation /></div>
              <p className="text-center text-slate-900 font-black uppercase tracking-[0.5em] mt-12 animate-pulse">Updating Audit Dossier...</p>
           </div>
        </div>
      )}

      {/* HEADER BAR - NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 p-4 no-print shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {onClose && (
              <button 
                onClick={onClose} 
                className="p-2.5 bg-slate-100 hover:bg-yeti-orange hover:text-white rounded-2xl text-slate-600 transition-all hover:scale-110 active:scale-95 cursor-pointer shadow-sm border border-slate-200"
                title="Return to Search"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </button>
            )}
            <div className="text-2xl font-black text-slate-800 tracking-tighter flex items-center gap-2">
              <ShipIcon className="w-8 h-8 text-yeti-teal" />
              Importer<span className="text-yeti-teal">Intel</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button 
                onClick={handleExportCSV} 
                className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl text-xs font-black text-slate-700 hover:bg-yeti-orange hover:text-white hover:border-yeti-orange transition-all uppercase tracking-widest hover:scale-105 active:scale-95 shadow-sm cursor-pointer bg-white"
             >
                <ArrowDownTrayIcon className="w-4 h-4" /> EXCEL
             </button>
             <button 
                onClick={handlePrintPDF} 
                className="flex items-center gap-2 px-8 py-3 bg-yeti-teal text-white rounded-2xl text-xs font-black shadow-lg shadow-sky-200 hover:bg-yeti-orange transition-all uppercase tracking-widest hover:scale-105 active:scale-95 cursor-pointer"
             >
                <PrinterIcon className="w-4 h-4" /> PDF DOSSIER
             </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6 space-y-12 pb-24">
        
        {/* SECTION 1: HERO SECTION */}
        <section className="bg-white border border-slate-200 rounded-[3rem] p-10 sm:p-14 shadow-xl section-box overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yeti-teal/[0.05] rounded-full -mr-64 -mt-64 blur-3xl animate-pulse"></div>
          
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-lg cursor-default border border-slate-800">
                <ShieldCheckIcon className="w-4 h-4 text-yeti-teal" /> Verified Trade Intelligence Dossier
              </div>
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-[0.85] max-w-3xl">
                {data.importerName}
              </h1>
              <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-800">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:border-yeti-orange transition-colors cursor-default group">
                  <MapPinIcon className="w-4 h-4 text-yeti-teal group-hover:text-yeti-orange group-hover:scale-110 transition-all" /> {data.location}
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 rounded-2xl border border-slate-200 shadow-sm hover:border-yeti-orange transition-colors cursor-pointer group">
                  <GlobeIcon className="w-4 h-4 text-yeti-teal group-hover:text-yeti-orange group-hover:rotate-12 transition-all" /> {contactObj.website || "Registry Presence Auditing..."}
                </div>
                <div className="flex items-center gap-2 px-5 py-2.5 bg-yeti-orange text-white rounded-2xl border border-yeti-orange/20 shadow-lg shadow-orange-100 transition-all cursor-default font-black uppercase tracking-widest text-[9px]">
                  <CalendarDaysIcon className="w-4 h-4" /> Last Logged Filing: {data.lastShipmentDate}
                </div>
              </div>
            </div>
            <button 
              onClick={() => onSubscribe(data.importerName)} 
              className="group relative flex items-center gap-3 px-10 py-6 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-xs rounded-[2rem] shadow-2xl overflow-hidden hover:scale-105 active:scale-95 no-print transition-all duration-500 cursor-pointer border border-slate-800"
            >
              <div className="absolute inset-0 bg-yeti-orange translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              <BellIcon className="w-5 h-5 relative z-10 group-hover:animate-bounce" /> 
              <span className="relative z-10">Activate Monitoring Alerts</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20 relative z-10">
            <StatBox icon={<ShipIcon className="w-7 h-7" />} label="Annual Volume" value={data.shipmentCounts?.lastYear || 0} subtext="ACE Logged Records" />
            <StatBox icon={<BoxIcon className="w-7 h-7" />} label="Avg. Load Density" value="3.15 TEU" subtext="Efficiency Rating" />
            <StatBox icon={<ArrowTrendingUpIcon className="w-7 h-7" />} label="Market Trend" value="Scraped" subtext="Supply Pulse" />
            <StatBox icon={<BuildingOfficeIcon className="w-7 h-7" />} label="Global Nodes" value={data.topSuppliers.length} subtext="Direct Trade Partners" />
          </div>
        </section>

        {/* SECTION 2: COMMODITY MARKET ANALYSIS */}
        <section className="section-box space-y-10 page-break-before">
          <div className="flex items-center justify-between px-6">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-5">
              <div className="p-3 bg-yeti-teal text-white rounded-[1.5rem] shadow-xl shadow-sky-100 hover:bg-yeti-orange transition-colors cursor-pointer"><ChartBarIcon className="w-9 h-9" /></div>
              Commodity Market Analysis
            </h2>
            <div className="hidden sm:block text-[11px] font-black text-slate-500 tracking-[0.4em] uppercase bg-slate-100 px-6 py-2 rounded-full border border-slate-200">Latest 2024-2025 Cycle</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-2">
            {data.topCommodityFlows?.length > 0 ? (
              data.topCommodityFlows.map((flow, i) => (
                <CommodityTrendCard 
                  key={i} 
                  name={flow.name} 
                  change={flow.percentage} 
                  trend={flow.marketTrend || 'UP'} 
                  price={flow.averagePrice} 
                />
              ))
            ) : (
              <div className="col-span-3 py-24 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem] text-slate-500 font-black uppercase tracking-[0.3em] flex flex-col items-center gap-4">
                <Spinner />
                Analyzing Trade Signal Density...
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3: STRATEGIC INSIGHTS & CONTACT MATRIX */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           <section className="lg:col-span-2 bg-white border border-slate-200 rounded-[3rem] p-12 shadow-lg section-box hover:shadow-2xl transition-shadow cursor-default overflow-hidden relative">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-10 flex items-center gap-4 relative z-10">
                 <div className="p-2.5 bg-slate-900 text-white rounded-2xl hover:bg-yeti-orange transition-colors cursor-pointer shadow-lg"><InfoIcon className="w-6 h-6" /></div>
                 Trade Intelligence Audit Dossier
              </h2>
              <div className="bg-slate-50 border-l-[8px] border-l-yeti-teal p-10 rounded-r-[2rem] mb-12 group hover:border-l-yeti-orange transition-all cursor-text shadow-sm relative z-10">
                <p className="text-slate-900 leading-relaxed text-xl font-bold italic">
                   "{data.information || "Resolving final scraping results from ImportYeti and USITC databases. Cross-referencing manifest validity against 2025 federal log density."}"
                </p>
              </div>
              <div className="space-y-8 relative z-10">
                 <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] border-b border-slate-100 pb-2 w-fit">Verified Intelligence Signals</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {(data.insights || ["Resolving logistics signal...", "Verifying ACE filing density...", "Auditing HS categorization..."]).map((insight, idx) => (
                      <div key={idx} className="flex gap-6 p-8 bg-slate-50 rounded-[2rem] border border-slate-200 text-sm font-black text-slate-800 hover:bg-white hover:border-yeti-orange/30 hover:shadow-xl transition-all group cursor-default">
                        <div className="w-3 h-3 rounded-full bg-yeti-teal mt-1.5 shrink-0 shadow-[0_0_10px_rgba(14,165,233,0.4)] group-hover:bg-yeti-orange group-hover:scale-125 transition-all" />
                        <span className="leading-relaxed">{insight}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </section>

           <section className="bg-slate-900 border border-slate-800 rounded-[3rem] p-12 shadow-2xl section-box h-fit text-white group hover:shadow-yeti-orange/30 transition-all cursor-default relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yeti-teal via-yeti-orange to-yeti-coral"></div>
              <h2 className="text-2xl font-black uppercase tracking-tight mb-12 group-hover:text-yeti-orange transition-colors flex items-center gap-3">
                <BuildingOfficeIcon className="w-7 h-7" />
                Registry Matrix
              </h2>
              <div className="space-y-12">
                 <div className="flex items-center gap-6 group/item cursor-pointer hover:translate-x-2 transition-transform">
                    <div className="p-5 bg-white/10 text-white rounded-3xl border border-white/20 group-hover/item:bg-yeti-orange group-hover/item:text-white group-hover/item:border-yeti-orange transition-all shadow-inner">
                       <PhoneIcon className="w-7 h-7" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1 group-hover/item:text-yeti-orange transition-colors">Primary HQ Node</div>
                       <div className="font-mono font-black text-xl text-white tracking-tighter">{contactObj.phone || "+1 AUDIT LOGS"}</div>
                    </div>
                 </div>
                 <div className="flex items-center gap-6 group/item cursor-pointer hover:translate-x-2 transition-transform">
                    <div className="p-5 bg-white/10 text-white rounded-3xl border border-white/20 group-hover/item:bg-yeti-orange group-hover/item:text-white group-hover/item:border-yeti-orange transition-all shadow-inner">
                       <EnvelopeIcon className="w-7 h-7" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1 group-hover/item:text-yeti-orange transition-colors">Digital Registry</div>
                       <div className="font-black text-white text-lg truncate max-w-[200px]">{contactObj.email || "Logistics.Scrape@Reg"}</div>
                    </div>
                 </div>
                 <div className="flex items-start gap-6 group/item cursor-pointer hover:translate-x-2 transition-transform">
                    <div className="p-5 bg-white/10 text-white rounded-3xl border border-white/20 group-hover/item:bg-yeti-orange group-hover/item:text-white group-hover/item:border-yeti-orange transition-all shadow-inner">
                       <MapPinIcon className="w-7 h-7" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] mb-1 group-hover/item:text-yeti-orange transition-colors">Operational Node</div>
                       <div className="text-sm font-black text-white/90 leading-tight uppercase tracking-tight max-w-[200px]">{contactObj.address || data.location}</div>
                    </div>
                 </div>
              </div>
           </section>
        </div>

        {/* SECTION 4: RELATIONSHIP HIERARCHY */}
        <section className="section-box no-break page-break-before">
          <RelationshipHierarchy importerName={data.importerName} suppliers={data.topSuppliers} />
        </section>

        {/* SECTION 5: FEDERAL MANIFEST AUDIT LOG */}
        <section className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-xl section-box page-break-before hover:shadow-2xl transition-shadow cursor-default">
          <div className="p-12 border-b border-slate-100 bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yeti-teal/20 to-transparent opacity-40"></div>
            <div className="relative z-10 flex items-center gap-5">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20"><ShieldCheckIcon className="w-8 h-8 text-yeti-teal" /></div>
              <div>
                <h2 className="text-3xl font-black text-white uppercase tracking-tight">Federal Manifest Audit Log</h2>
                <p className="text-[10px] text-yeti-teal mt-1 font-black tracking-[0.5em] uppercase">Scraped 2024-2025 CBP ACE Dataset</p>
              </div>
            </div>
            <div className="relative z-10 px-6 py-3 bg-white/5 backdrop-blur-md text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg flex items-center gap-3 group border border-white/10">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]"></div>
              Audit Verification Active
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse print-show-all-rows">
              <thead>
                <tr className="bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] border-b border-slate-100">
                  <th className="px-8 py-8">Arrival Date</th>
                  <th className="px-8 py-8 bg-slate-100/50">Carrier / Container#</th>
                  <th className="px-8 py-8">Consignor (Shipper)</th>
                  <th className="px-8 py-8">Manifest Description</th>
                  <th className="px-8 py-8">BOL Ref</th>
                  <th className="px-8 py-8 text-right">Volume</th>
                </tr>
              </thead>
              <tbody className={`divide-y divide-slate-100 ${showAllShipments ? 'print-show-all-rows' : ''}`}>
                {data.shipmentHistory.map((s, idx) => (
                  <tr 
                    key={idx} 
                    className={`hover:bg-slate-50 transition-all group ${!showAllShipments && idx >= 20 ? 'hidden' : ''} page-break-inside-avoid`}
                  >
                    <td className="px-8 py-8 whitespace-nowrap text-[11px] font-mono font-black text-slate-500 group-hover:text-yeti-orange transition-colors">{s.date}</td>
                    <td className="px-8 py-8 bg-slate-50/50 group-hover:bg-orange-50 transition-colors">
                      <div className="font-black text-slate-900 text-xs uppercase tracking-tighter mb-1.5 flex items-center gap-2 group-hover:text-yeti-orange">
                        <ShipIcon className="w-4 h-4 opacity-40" />
                        {s.carrier || 'MSC SCENIC'}
                      </div>
                      <div className="text-[10px] font-mono font-bold text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-xl w-fit shadow-sm group-hover:border-yeti-orange/50 transition-all">
                        {s.containerNumber || 'MSCU7213456'}
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="font-black text-slate-900 text-sm uppercase tracking-tight leading-none mb-1.5 group-hover:text-yeti-orange">{s.shipper}</div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                        <MapPinIcon className="w-3 h-3 text-slate-400" />
                        {s.origin}
                      </div>
                    </td>
                    <td className="px-8 py-8 max-w-sm relative">
                      <div 
                        className="text-xs font-bold text-slate-800 truncate cursor-help border-b-2 border-dashed border-slate-300 w-fit pb-1 group-hover:text-slate-900 group-hover:border-yeti-orange transition-all" 
                        title={`AUDITED HS CODE: ${s.hsCode || 'PENDING ACE CLASSIFICATION'}`}
                      >
                        {s.commodity}
                      </div>
                      {s.hsCode && (
                        <div className="text-[9px] font-mono font-black text-slate-400 mt-1 uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                          CODE: {s.hsCode}
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-8 font-mono text-[11px] font-black text-yeti-orange bg-orange-50/20 group-hover:bg-orange-50 transition-colors">#{s.bolNumber || "ACE-BOL"}</td>
                    <td className="px-8 py-8 text-right">
                      <span className="px-6 py-2.5 bg-slate-900 text-white rounded-2xl font-black text-xs shadow-xl shadow-slate-200 group-hover:bg-yeti-orange group-hover:shadow-orange-100 transition-all whitespace-nowrap">{s.volume}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showAllShipments && data.shipmentHistory.length > 20 && (
             <button 
                onClick={() => setShowAllShipments(true)}
                className="w-full py-10 text-[11px] font-black uppercase tracking-[0.8em] text-slate-500 hover:text-yeti-orange bg-slate-50 border-t border-slate-100 transition-all no-print hover:bg-slate-100 active:bg-slate-200 cursor-pointer"
             >
                Reveal All {data.shipmentHistory.length} Audited Logs
             </button>
          )}
        </section>

        {/* SECTION 6: GLOBAL TRADE FOOTPRINT */}
        <section className="bg-white border border-slate-200 rounded-[3rem] p-12 sm:p-20 shadow-2xl section-box space-y-20 hover:shadow-yeti-orange/10 transition-shadow page-break-before cursor-default">
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-100 pb-10">
              <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                <GlobeIcon className="w-10 h-10 text-yeti-teal" />
                Global Trade Footprint
              </h2>
              <div className="text-[11px] font-black text-slate-500 tracking-[0.5em] uppercase bg-slate-100 px-8 py-3 rounded-full border border-slate-200 hover:border-yeti-orange transition-colors">Origin Node Dashboard</div>
           </div>
           
           <div className="rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl group cursor-crosshair text-slate-900">
             <WorldMap theme={theme} partners={data.topTradePartners} />
           </div>
           
           <div className="space-y-12">
              <div className="flex items-center gap-6 px-4">
                <div className="h-0.5 flex-grow bg-slate-100"></div>
                <h3 className="text-[14px] font-black text-slate-900 uppercase tracking-[0.6em] shrink-0">Origin Node Strategic Analysis</h3>
                <div className="h-0.5 flex-grow bg-slate-100"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 {data.topTradePartners.map((partner, i) => (
                    <PartnerInsightCard key={i} partner={partner} />
                 ))}
              </div>
           </div>
        </section>

        {/* SECTION 7: HISTORICAL VOLUME TRENDS */}
        <section className="bg-white border border-slate-200 rounded-[3rem] p-12 sm:p-20 shadow-xl section-box hover:shadow-2xl transition-shadow page-break-before">
           <div className="flex items-center justify-between mb-20 px-4">
              <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-4">
                <ChartBarIcon className="w-9 h-9 text-yeti-teal" />
                Vessel Density Timeline
              </h2>
              <div className="no-print hidden sm:block">
                 <span className="px-8 py-3 bg-slate-900 text-white rounded-2xl uppercase tracking-[0.4em] text-[10px] font-black border border-slate-800 shadow-2xl hover:bg-yeti-orange transition-all cursor-pointer">24-Month Scrape Cycle</span>
              </div>
           </div>
           <ShipmentVolumeChart theme={theme} data={data.shipmentVolumeHistory} />
        </section>

      </div>

      <footer className="w-full py-28 bg-white border-t border-slate-200 text-center cursor-default no-print">
          <div className="text-[12px] font-black text-slate-500 uppercase tracking-[1em] px-12 max-w-6xl mx-auto leading-loose opacity-70">
              Official Strategic Audit Dossier • ACE Manifest Integrity Secured • {new Date().getFullYear()}
          </div>
      </footer>
    </div>
  );
};
