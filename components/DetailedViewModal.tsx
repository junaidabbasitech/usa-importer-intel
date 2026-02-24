
import React, { useEffect, useRef } from 'react';
import { CloseIcon } from './icons';
import type { Theme } from '../types';

interface DetailedViewModalProps {
  onClose: () => void;
  children: React.ReactNode;
  theme: Theme;
}

export const DetailedViewModal: React.FC<DetailedViewModalProps> = ({ onClose, children, theme }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) onClose();
    };
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-start z-50 p-4 transition-opacity duration-300 animate-fade-in printable-modal-wrapper"
      role="dialog"
      aria-modal="true"
    >
      <div 
        ref={modalRef}
        className={`rounded-xl shadow-lg w-full max-w-[1400px] relative mt-12 mb-8 max-h-[calc(100vh-6rem)] overflow-y-auto transform transition-all duration-300 animate-fade-in-scale printable-content-container ${theme === 'dark' ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}
      >
        <button
          onClick={onClose}
          className={`sticky top-4 right-4 z-40 p-2 rounded-full transition-colors no-print ml-auto block mr-4 mt-4 ${theme === 'dark' ? 'text-slate-400 bg-slate-800/80 hover:bg-slate-700' : 'text-slate-500 bg-slate-100 hover:bg-slate-200'}`}
          aria-label="Close modal"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
        <div className="relative z-10">
          {children}
        </div>
      </div>
       <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeInScale { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in-scale { animation: fadeInScale 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};
