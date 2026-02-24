
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { searchImporters, fetchDetailedImporterData, searchSimilarImporters } from './services/geminiService';
import { checkBackendHealth } from './services/backendService';
import type { ImporterSummary, DetailedImporterResult, Subscription, Notification, ContactInfo, ParsedImporterData, Theme } from './types';
import { ImporterCard } from './components/ImporterCard';
import { ImporterSummaryCard } from './components/ImporterSummaryCard';
import { Spinner } from './components/Spinner';
import { ShipLoadingAnimation } from './components/ShipLoadingAnimation';
import { BellIcon, SearchIcon, ArrowPathIcon, BuildingOfficeIcon, GlobeIcon, ChartBarIcon, XCircleIcon, ShipIcon } from './components/icons';
import { AlertModal } from './components/AlertModal';
import { NotificationPanel } from './components/NotificationPanel';
import { DetailedViewModal } from './components/DetailedViewModal';

const FilterIconComp: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
    </svg>
);

interface SearchFormProps {
    query: string;
    setQuery: (q: string) => void;
    city: string;
    setCity: (c: string) => void;
    state: string;
    setState: (s: string) => void;
    industry: string;
    setIndustry: (i: string) => void;
    isAdvancedOpen: boolean;
    setIsAdvancedOpen: (isOpen: boolean) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    isLoading: boolean;
    theme: Theme;
}

const SearchForm: React.FC<SearchFormProps> = ({ 
    query, setQuery, 
    city, setCity,
    state, setState,
    industry, setIndustry,
    isAdvancedOpen, setIsAdvancedOpen,
    onSubmit, onCancel, isLoading, theme
}) => {
    const [validationError, setValidationError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isLoading) inputRef.current?.focus();
    }, [isLoading]);

    const inputClass = theme === 'dark' 
      ? "block w-full border-none rounded-2xl bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yeti-teal/50 transition-all text-base sm:text-sm shadow-inner group-hover:bg-slate-900 hover:shadow-lg cursor-text"
      : "block w-full border border-slate-200 rounded-2xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-yeti-teal/50 transition-all text-base sm:text-sm shadow-sm hover:shadow-md cursor-text";
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) {
            setValidationError("Provide target entity or sector for scraping.");
            return;
        }
        setValidationError(null);
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full group">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow group/input">
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (validationError) setValidationError(null);
                        }}
                        placeholder="Importer Name, Commodity, or Sector..."
                        className={`${inputClass} pl-12 pr-4 py-5 shadow-2xl group-hover:border-yeti-orange transition-all`}
                        disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        {isLoading ? <Spinner /> : <SearchIcon className="h-6 w-6 text-slate-500 group-focus-within/input:text-yeti-orange group-hover:text-yeti-orange transition-colors" />}
                    </div>
                </div>
                {isLoading ? (
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="bg-slate-900 hover:bg-yeti-orange/20 text-yeti-orange border border-yeti-orange/30 font-black py-5 px-10 rounded-2xl transition-all shadow-lg flex items-center justify-center gap-3 active:scale-95 whitespace-nowrap hover:scale-105 cursor-pointer"
                    >
                        <XCircleIcon className="h-5 w-5" />
                        <span>Cancel Task</span>
                    </button>
                ) : (
                    <button 
                        type="submit" 
                        className="bg-yeti-teal hover:bg-yeti-orange text-white font-black py-5 px-10 rounded-2xl transition-all shadow-xl shadow-sky-200 flex items-center justify-center gap-3 active:scale-95 whitespace-nowrap hover:scale-105 hover:-translate-y-1 cursor-pointer"
                    >
                        <SearchIcon className="h-5 w-5" />
                        <span>Scrape Intelligence</span>
                    </button>
                )}
            </div>
            
            <div className="flex flex-wrap items-center justify-between mt-6 px-2 gap-4">
                <div className="flex-grow">
                    {validationError && (
                        <p className="text-sm text-yeti-orange font-bold animate-in slide-in-from-left-2">{validationError}</p>
                    )}
                </div>
                <button 
                    type="button" 
                    onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all px-5 py-3 rounded-xl border hover:scale-105 active:scale-95 cursor-pointer ${
                      theme === 'dark' 
                      ? 'text-slate-400 bg-slate-900/40 border-slate-800/50 hover:bg-slate-900 hover:text-yeti-orange' 
                      : 'text-slate-700 bg-white border-slate-200 hover:bg-slate-50 hover:text-yeti-orange shadow-sm'
                    }`}
                >
                    <FilterIconComp className="h-3.5 w-3.5" />
                    {isAdvancedOpen ? 'Hide Parameters' : 'Refine Scope'}
                </button>
            </div>

            {isAdvancedOpen && (
                <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 p-8 rounded-[2rem] border animate-in fade-in slide-in-from-top-4 duration-300 ${
                  theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'
                }`}>
                    <div className="group/param">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 group-hover/param:text-yeti-orange transition-colors">Port City</label>
                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Savannah" className={`w-full p-4 rounded-xl outline-none transition-all text-sm cursor-text border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:border-yeti-orange' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-yeti-orange'}`} />
                    </div>
                    <div className="group/param">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 group-hover/param:text-yeti-orange transition-colors">State Node</label>
                        <input type="text" value={state} onChange={(e) => setState(e.target.value)} placeholder="e.g. Georgia" className={`w-full p-4 rounded-xl outline-none transition-all text-sm cursor-text border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:border-yeti-orange' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-yeti-orange'}`} />
                    </div>
                    <div className="group/param">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 group-hover/param:text-yeti-orange transition-colors">Market Niche</label>
                        <input type="text" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="e.g. Logistics" className={`w-full p-4 rounded-xl outline-none transition-all text-sm cursor-text border ${theme === 'dark' ? 'bg-slate-950 border-slate-800 text-white focus:border-yeti-orange' : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-yeti-orange'}`} />
                    </div>
                </div>
            )}
        </form>
    );
};

const App: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [state, setState] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshingDetails, setIsRefreshingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ImporterSummary[]>([]);
  const [similarResults, setSimilarResults] = useState<ImporterSummary[]>([]);
  const [selectedImporter, setSelectedImporter] = useState<DetailedImporterResult | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertCompanyName, setAlertCompanyName] = useState<string>('');
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<'ok' | 'error' | 'checking'>('checking');
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkBackendHealth();
      setBackendStatus(status.status === 'ok' ? 'ok' : 'error');
    };
    checkStatus();
  }, []);

  useEffect(() => {
    try {
      const storedSubscriptions = localStorage.getItem('importerIntel-subscriptions');
      if (storedSubscriptions) setSubscriptions(JSON.parse(storedSubscriptions));
      const storedNotifications = localStorage.getItem('importerIntel-notifications');
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications));
    } catch (e) {}
  }, []);

  useEffect(() => {
    localStorage.setItem('importerIntel-subscriptions', JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => {
    localStorage.setItem('importerIntel-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const cancelSearch = useCallback(() => {
    if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        setIsLoading(false);
        setError("Scraping task terminated by user.");
    }
  }, []);

  const triggerSearch = useCallback(async (searchParams: { query: string; city: string; state: string; industry: string; }) => {
    const { query, city, state, industry } = searchParams;
    if ((!query.trim() && !city.trim() && !state.trim() && !industry.trim()) || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const [mainResults, similar] = await Promise.allSettled([
        searchImporters({ query, city, state, industry }),
        searchSimilarImporters(query || industry)
      ]);
      
      if (mainResults.status === 'fulfilled') {
        const data = mainResults.value;
        // Case-Distinct Preservation Logic:
        // We sort them, but we do NOT filter out entries with same spelling but different casing
        // if the model returned them as distinct profiles.
        const sortedResults = [...data].sort((a, b) => {
            const aName = a.importerName.toLowerCase();
            const bName = b.importerName.toLowerCase();
            const q = query.toLowerCase();

            const aExact = aName === q;
            const bExact = bName === q;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = aName.startsWith(q);
            const bStarts = bName.startsWith(q);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return 0;
        });
        setResults(sortedResults);
      } else {
        setError('Market scraping failed. Try another keyword.');
      }

      if (similar.status === 'fulfilled') {
        setSimilarResults(similar.value);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
          setError("Intell operation stopped.");
      } else {
          setError(err.message || "Scraping latency detected.");
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [isLoading]);

  const handleViewDetails = useCallback(async (importerName: string) => {
    const summary = [...results, ...similarResults].find(r => r.importerName === importerName);
    if (!summary) return;

    setSelectedImporter({
      parsedData: {
        importerName: summary.importerName,
        location: summary.location,
        lastShipmentDate: summary.lastShipmentDate,
        commodities: summary.primaryCommodities,
        information: '',
        shipmentActivity: '',
        shipmentCounts: { lastMonth: '...', lastQuarter: '...', lastYear: '...' },
        shipmentHistory: [],
        shipmentVolumeHistory: [],
        contact: { phone: '...', website: '...', email: '...', address: '...' },
        riskAssessment: { financialStability: 'Pending...', regulatoryCompliance: 'Pending...', geopoliticalRisk: 'Pending...' },
        topTradePartners: [],
        topCommodityFlows: [],
        topSuppliers: [],
      }
    });
    setIsModalOpen(true);
    setIsRefreshingDetails(true);

    try {
      const fullData = await fetchDetailedImporterData(importerName, summary);
      setSelectedImporter(fullData);
    } catch (err: any) {
        setError("Scraping resolution failed for detailed logs.");
    } finally {
        setIsRefreshingDetails(false);
    }
  }, [results, similarResults]);

  const handleRefreshDetails = useCallback(async (name: string) => {
    setIsRefreshingDetails(true);
    try {
        const fullData = await fetchDetailedImporterData(name);
        setSelectedImporter(fullData);
    } catch (e) {} finally {
        setIsRefreshingDetails(false);
    }
  }, []);

  const deleteNotification = (id: string) => {
      setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleTheme = () => {
      setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-yeti-orange/30 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <header className={`fixed top-0 inset-x-0 h-20 border-b backdrop-blur-xl z-40 transition-colors duration-500 ${theme === 'dark' ? 'border-yeti-teal/20 bg-slate-950/80' : 'border-slate-200 bg-white/80'}`}>
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-all ${theme === 'dark' ? 'bg-yeti-teal shadow-sky-500/20' : 'bg-yeti-teal shadow-sky-400/20'} group-hover:bg-yeti-orange`}>
                        <ShipIcon className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-black tracking-tighter group-hover:text-yeti-orange transition-colors uppercase">Importer<span className="text-yeti-teal group-hover:text-yeti-orange transition-colors">Intel</span></span>
                </div>
                <div className="flex items-center gap-4">
                    <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${theme === 'dark' ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                        <div className={`w-2 h-2 rounded-full ${backendStatus === 'ok' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : backendStatus === 'error' ? 'bg-rose-500 shadow-[0_0_8px_#f43f5e]' : 'bg-amber-500 animate-pulse'}`}></div>
                        <span className={backendStatus === 'ok' ? 'text-emerald-500' : backendStatus === 'error' ? 'text-rose-500' : 'text-amber-500'}>
                            Backend: {backendStatus === 'ok' ? 'Active' : backendStatus === 'error' ? 'Offline' : 'Connecting'}
                        </span>
                    </div>
                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-xl transition-all hover:scale-110 active:scale-90 cursor-pointer ${theme === 'dark' ? 'text-slate-400 bg-slate-900 hover:text-yeti-orange shadow-lg' : 'text-slate-700 bg-slate-200 hover:text-yeti-orange shadow-md'}`}
                        title="Toggle Theme"
                    >
                        {theme === 'dark' ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 16.95l.707.707M7.05 7.05l.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                        )}
                    </button>
                    <button
                        ref={notificationButtonRef}
                        onClick={() => setIsNotificationPanelOpen(!isNotificationPanelOpen)}
                        className={`p-3 rounded-xl transition-all relative hover:scale-110 active:scale-90 cursor-pointer ${theme === 'dark' ? 'text-slate-400 bg-slate-900 hover:text-yeti-orange shadow-lg' : 'text-slate-700 bg-slate-200 hover:text-yeti-orange shadow-md'}`}
                    >
                        <BellIcon className="w-6 h-6" />
                        {notifications.length > 0 && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-yeti-orange animate-pulse"></span>
                        )}
                    </button>
                    {isNotificationPanelOpen && (
                        <NotificationPanel
                            notifications={notifications}
                            onClose={() => setIsNotificationPanelOpen(false)}
                            onClearAll={() => setNotifications([])}
                            onDelete={deleteNotification}
                            parentRef={notificationButtonRef}
                        />
                    )}
                </div>
            </div>
        </header>

        <main className="flex-grow max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center w-full">
            {results.length === 0 && !isLoading && (
                <div className="w-full max-w-4xl text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl sm:text-7xl font-black tracking-tighter mb-6 leading-tight">
                        Importer Trade <span className={`text-transparent bg-clip-text bg-gradient-to-r ${theme === 'dark' ? 'from-yeti-teal to-sky-400' : 'from-yeti-teal to-sky-600'}`}>Intell</span> Platform.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 font-medium">
                        Scraping manifest flows from ImportYeti, usatradeonline, and USITC to get importer profiles.
                    </p>
                </div>
            )}

            <div className={`w-full max-w-4xl transition-all duration-500 ${results.length > 0 ? 'mb-12' : 'mb-24'}`}>
                <SearchForm 
                    query={query} setQuery={setQuery}
                    city={city} setCity={setCity}
                    state={state} setState={setState}
                    industry={industry} setIndustry={setIndustry}
                    isAdvancedOpen={isAdvancedSearchOpen}
                    setIsAdvancedOpen={setIsAdvancedSearchOpen}
                    onSubmit={() => triggerSearch({ query, city, state, industry })}
                    onCancel={cancelSearch}
                    isLoading={isLoading}
                    theme={theme}
                />
            </div>

            {isLoading && (
                <div className="w-full max-w-2xl">
                    <ShipLoadingAnimation />
                    <div className="text-center mt-6">
                        <button 
                            onClick={cancelSearch}
                            className="text-xs font-black text-slate-500 hover:text-yeti-orange hover:bg-orange-50 hover:border-yeti-orange uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 mx-auto px-8 py-4 border border-slate-800 rounded-2xl active:scale-95 shadow-lg cursor-pointer"
                        >
                            <XCircleIcon className="w-5 h-5" />
                            Abort Intell Seq
                        </button>
                    </div>
                </div>
            )}

            {error && (
                <div className="bg-orange-950/10 border border-yeti-orange/20 p-8 rounded-[2rem] text-yeti-orange text-center max-w-lg mb-10 flex flex-col items-center gap-4 animate-in zoom-in-95 duration-300">
                    <div className="bg-yeti-orange text-white p-2 rounded-xl shadow-lg"><XCircleIcon className="w-8 h-8" /></div>
                    <span className="font-bold text-lg">{error}</span>
                    <button onClick={() => setError(null)} className="text-[11px] font-black uppercase tracking-widest hover:underline hover:scale-105 active:scale-95 py-2 px-6 bg-slate-900 rounded-full border border-slate-800 cursor-pointer">Dismiss</button>
                </div>
            )}

            {!isLoading && results.length > 0 && (
                <div className="w-full max-w-4xl space-y-20">
                    <section>
                        <div className="flex items-center justify-between mb-8 px-4">
                            <h2 className="text-3xl font-black tracking-tight text-yeti-teal uppercase">CNEE Intell Found</h2>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">{results.length} Scraped Entities</span>
                        </div>
                        <div className="grid grid-cols-1 gap-8">
                            {results.map((r, i) => (
                                <ImporterSummaryCard key={`${r.importerName}-${i}`} summary={r} onViewDetails={handleViewDetails} />
                            ))}
                        </div>
                    </section>

                    {similarResults.length > 0 && (
                        <section className={`${theme === 'dark' ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'} p-12 rounded-[3rem] border transition-all group cursor-default`}>
                            <h2 className="text-3xl font-black tracking-tight mb-10 text-yeti-teal uppercase group-hover:text-yeti-orange transition-colors">Sector Peer Scrape</h2>
                            <div className="grid grid-cols-1 gap-8">
                                {similarResults.map((r, i) => (
                                    <ImporterSummaryCard key={`${r.importerName}-sim-${i}`} summary={r} onViewDetails={handleViewDetails} />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </main>

        <footer className={`w-full py-16 border-t text-center no-print transition-colors duration-500 ${theme === 'dark' ? 'border-slate-900 bg-slate-950' : 'border-slate-200 bg-white'}`}>
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.6em] transition-all hover:text-yeti-orange cursor-default group">
                Audit Core • <span className="text-yeti-orange group-hover:text-yeti-teal transition-colors uppercase">USA Trade Intel</span> • Scraped Integrity Secured
            </p>
            <p className="text-[10px] font-black text-slate-400 mt-4 uppercase tracking-[0.5em] hover:text-yeti-orange transition-all cursor-pointer group">
              Powered By <span className="text-yeti-teal group-hover:text-yeti-orange transition-colors">M JUNAID ABBASI</span>
            </p>
        </footer>

        {isModalOpen && selectedImporter && (
            <DetailedViewModal theme={theme} onClose={() => setIsModalOpen(false)}>
                <ImporterCard 
                    data={selectedImporter.parsedData}
                    theme={theme}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={handleRefreshDetails}
                    isRefreshing={isRefreshingDetails}
                    onSubscribe={(name) => { setAlertCompanyName(name); setIsAlertModalOpen(true); }}
                    onExportPDF={() => window.print()}
                />
            </DetailedViewModal>
        )}

        {isAlertModalOpen && (
            <AlertModal 
                companyName={alertCompanyName} 
                onClose={() => setIsAlertModalOpen(false)}
                onSubscribe={(name, email) => {
                    setSubscriptions(prev => [...prev, { companyName: name, email }]);
                    setNotifications(prev => [{ id: Date.now().toString(), message: `Intell Monitoring Active: ${name}`, timestamp: Date.now() }, ...prev]);
                    setIsAlertModalOpen(false);
                }}
                subscriptions={subscriptions}
            />
        )}
    </div>
  );
};

export default App;
