import React, { useState } from 'react';
import { Book, MaterialType, Subject } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { ArrowLeft, Bookmark, BookOpen, FileText, CheckCircle2, ShieldCheck, Sparkles, Plus } from 'lucide-react';

interface BookCatalogProps {
  grade: number;
  subject: Subject;
  books: Book[];
  favorites: string[];
  onToggleFavorite: (bookId: string) => void;
  onSelectBook: (bookId: string) => void;
  onBack: () => void;
  onAddBook: () => void;
}

export const BookCatalog: React.FC<BookCatalogProps> = ({
  grade,
  subject,
  books,
  favorites,
  onToggleFavorite,
  onSelectBook,
  onBack,
  onAddBook,
}) => {
  const [activeTab, setActiveTab] = useState<MaterialType>('podrecznik');

  // Filter books for current grade, subject, and type
  const subjectBooks = books.filter((b) => b.grade === grade && b.subjectId === subject.id);
  const textbooks = subjectBooks.filter((b) => b.type === 'podrecznik');
  const workbooks = subjectBooks.filter((b) => b.type === 'zeszyt_cwiczen');

  const displayedBooks = activeTab === 'podrecznik' ? textbooks : workbooks;

  return (
    <div className="space-y-8 pb-16">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            title="Wróć do wyboru przedmiotu"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Krok 3 z 4: Wybór książki
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">Klasa {grade}</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{subject.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <SubjectIcon name={subject.iconName} className="w-7 h-7 text-sky-600 dark:text-sky-400" />
              <span>{subject.name} – Klasa {grade}</span>
            </h1>
          </div>
        </div>

        <button
          onClick={onAddBook}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Dodaj książkę</span>
        </button>
      </div>

      {/* Two Prominent Tabs: Podręczniki vs Zeszyty ćwiczeń */}
      <div className="flex items-center justify-start border-b border-slate-200 dark:border-slate-800 gap-8">
        <button
          onClick={() => setActiveTab('podrecznik')}
          className={`flex items-center gap-2.5 pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
            activeTab === 'podrecznik'
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Podręczniki ({textbooks.length})</span>
          {activeTab === 'podrecznik' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('zeszyt_cwiczen')}
          className={`flex items-center gap-2.5 pb-4 text-base font-bold transition-all relative whitespace-nowrap ${
            activeTab === 'zeszyt_cwiczen'
              ? 'text-sky-600 dark:text-sky-400'
              : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Zeszyty ćwiczeń ({workbooks.length})</span>
          {activeTab === 'zeszyt_cwiczen' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full" />
          )}
        </button>
      </div>

      {/* Book Cards Grid */}
      {displayedBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedBooks.map((book) => {
            const isFav = favorites.includes(book.id);
            const tasksCount = book.tasks?.length || 0;

            return (
              <div
                key={book.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg transition-all duration-200 overflow-hidden"
              >
                {/* Book Card Top: Visual Book Cover & Favorite Button */}
                <div className="relative p-5 pb-3">
                  <div className="flex items-start gap-4">
                    {/* Visual Book Cover */}
                    <div
                      onClick={() => onSelectBook(book.id)}
                      className="w-24 sm:w-28 h-36 sm:h-40 shrink-0 rounded-xl overflow-hidden shadow-md relative cursor-pointer group-hover:scale-[1.02] transition-transform bg-gradient-to-br from-slate-800 via-sky-950 to-emerald-950 border border-slate-200/40 dark:border-slate-700 flex flex-col justify-between p-2.5 text-white"
                    >
                      {book.coverUrl ? (
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <div className="flex items-center justify-between z-10">
                            <span className="text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/40 text-sky-200">
                              KLASA {book.grade}
                            </span>
                            <span className="text-[9px] uppercase font-semibold text-emerald-300">
                              {book.type === 'podrecznik' ? 'PODR.' : 'ĆWICZ.'}
                            </span>
                          </div>

                          <div className="z-10 my-auto">
                            <p className="text-xs font-bold leading-tight line-clamp-3 text-white shadow-xs">
                              {book.title}
                            </p>
                            {book.part && (
                              <p className="text-[10px] text-sky-200 font-medium mt-1">
                                {book.part}
                              </p>
                            )}
                          </div>

                          <div className="z-10 text-[9px] text-slate-300 font-medium truncate pt-1 border-t border-white/20">
                            {book.publisher}
                          </div>

                          {/* Subtle spine gradient overlay */}
                          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/40 to-transparent pointer-events-none" />
                        </>
                      )}
                    </div>

                    {/* Book Metadata Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Status badges */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[11px] font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wide">
                            {book.publisher}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(book.id);
                            }}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isFav
                                ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                            }`}
                            title={isFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                          >
                            <Bookmark className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </div>

                        <h3
                          onClick={() => onSelectBook(book.id)}
                          className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                        >
                          {book.title}
                        </h3>

                        {book.part && (
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                            {book.part}
                          </p>
                        )}

                        {/* Edition & Year (strict separation of editions!) */}
                        <div className="mt-2.5 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                          <p className="truncate">
                            <span className="font-medium text-slate-700 dark:text-slate-300">Wydanie:</span>{' '}
                            {book.editionYear}
                          </p>
                          {book.approvalNumber && (
                            <p className="truncate">
                              <span className="font-medium text-slate-700 dark:text-slate-300">Nr MEN:</span>{' '}
                              {book.approvalNumber}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Demo vs Custom Badge */}
                      <div className="mt-3">
                        {book.isDemo ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            Materiały demonstracyjne
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded-md border border-indigo-200 dark:border-indigo-800">
                            Dodane przez użytkownika
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Book Card Bottom Action */}
                <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-850/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <div className="text-slate-600 dark:text-slate-400 font-medium">
                    {tasksCount > 0 ? (
                      <span className="text-slate-700 dark:text-slate-300 font-semibold">
                        {tasksCount} {tasksCount === 1 ? 'zadanie' : tasksCount < 5 ? 'zadania' : 'zadań'} z odpowiedziami
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">Brak wprowadzonych zadań</span>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectBook(book.id)}
                    className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                  >
                    <span>Otwórz</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 max-w-xl mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            {activeTab === 'podrecznik' ? <BookOpen className="w-7 h-7" /> : <FileText className="w-7 h-7" />}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Brak {activeTab === 'podrecznik' ? 'podręczników' : 'zeszytów ćwiczeń'} w tej kategorii
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Dla klasy {grade} ({subject.name}) nie dodano jeszcze materiału tego typu. Możesz go dodać teraz!
            </p>
          </div>
          <button
            onClick={onAddBook}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Dodaj {activeTab === 'podrecznik' ? 'nowy podręcznik' : 'nowy zeszyt ćwiczeń'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
