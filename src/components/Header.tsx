import React from 'react';
import { ViewMode } from '../types';
import { Moon, Sun, Search, PlusCircle, Bookmark, History, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  currentView: ViewMode;
  onNavigate: (view: ViewMode) => void;
  favoritesCount: number;
  recentCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenManageModal: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
  recentCount,
  theme,
  onToggleTheme,
  onOpenManageModal,
  onOpenSearch,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('grades')}
            className="flex items-center gap-2.5 text-left group transition-transform active:scale-95 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white shadow-sm font-bold text-lg tracking-tight">
              1–8
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                Szkolna Biblioteka
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
                Podręczniki i Rozwiązania
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button
              onClick={() => onNavigate('grades')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-sky-600 dark:hover:text-sky-400 ${
                currentView === 'grades' || currentView === 'subjects' || currentView === 'books'
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : ''
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Klasy 1–8</span>
            </button>

            <button
              onClick={() => onNavigate('favorites')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-sky-600 dark:hover:text-sky-400 ${
                currentView === 'favorites' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Ulubione</span>
              {favoritesCount > 0 && (
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-700 dark:text-sky-300 tabular-nums font-semibold">
                  {favoritesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onNavigate('recent')}
              className={`flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 hover:text-sky-600 dark:hover:text-sky-400 ${
                currentView === 'recent' ? 'text-sky-600 dark:text-sky-400 font-semibold' : ''
              }`}
            >
              <History className="w-4 h-4" />
              <span>Ostatnie</span>
              {recentCount > 0 && (
                <span className="text-xs px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 tabular-nums">
                  {recentCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenManageModal}
              className="flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Dodaj materiał</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action & controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 text-xs sm:text-sm font-medium transition-all"
              title="Szukaj podręcznika, zadania lub tematu"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Szukaj zadania...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded text-slate-400">
                /
              </kbd>
            </button>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Przełącz tryb ciemny/jasny"
              title={theme === 'dark' ? 'Włącz tryb jasny' : 'Włącz tryb ciemny'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile menu action */}
            <button
              onClick={onOpenManageModal}
              className="md:hidden p-2 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              title="Dodaj materiał"
            >
              <PlusCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
