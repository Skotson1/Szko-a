import React from 'react';
import { Book, Subject } from '../types';
import { History, ArrowLeft, ArrowRight, Clock } from 'lucide-react';

interface RecentViewProps {
  recentItems: { bookId: string; lastOpened: string; lastPage: number }[];
  books: Book[];
  subjects: Subject[];
  onSelectBook: (bookId: string, page?: number) => void;
  onBack: () => void;
}

export const RecentView: React.FC<RecentViewProps> = ({
  recentItems,
  books,
  subjects,
  onSelectBook,
  onBack,
}) => {
  const bookMap = new Map(books.map((b) => [b.id, b]));
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            title="Wróć"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600">
                Historia przeglądania
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500">{recentItems.length} ostatnio otwartych</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Ostatnio otwierane materiały
            </h1>
          </div>
        </div>
      </div>

      {recentItems.length > 0 ? (
        <div className="space-y-3 max-w-3xl">
          {recentItems.map((item) => {
            const book = bookMap.get(item.bookId);
            if (!book) return null;
            const subjectName = subjectMap.get(book.subjectId) || '';

            return (
              <div
                key={item.bookId}
                onClick={() => onSelectBook(book.id, item.lastPage)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 hover:shadow-sm cursor-pointer transition-all"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      Klasa {book.grade} · {subjectName}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      {new Date(item.lastOpened).toLocaleDateString('pl-PL', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 transition-colors truncate">
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 truncate">
                    {book.publisher} · {book.editionYear}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300">
                    Ostatnia strona: {item.lastPage}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <History className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Brak historii czytania
          </h3>
          <p className="text-xs text-slate-500">
            Kiedy otworzysz jakikolwiek podręcznik lub zeszyt ćwiczeń, pojawi się on na tej liście z zapamiętaną ostatnią stroną.
          </p>
        </div>
      )}
    </div>
  );
};
