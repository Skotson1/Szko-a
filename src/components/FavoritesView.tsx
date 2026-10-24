import React from 'react';
import { Book, Subject } from '../types';
import { Bookmark, ArrowLeft, BookOpen, Trash2, ArrowRight } from 'lucide-react';

interface FavoritesViewProps {
  favorites: string[];
  books: Book[];
  subjects: Subject[];
  lastVisitedPages: Record<string, number>;
  onSelectBook: (bookId: string, page?: number) => void;
  onRemoveFavorite: (bookId: string) => void;
  onBack: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  books,
  subjects,
  lastVisitedPages,
  onSelectBook,
  onRemoveFavorite,
  onBack,
}) => {
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));
  const favoriteBooks = books.filter((b) => favorites.includes(b.id));

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
              <span className="text-xs font-semibold uppercase tracking-wider text-rose-600">
                Ulubione podręczniki
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500">{favoriteBooks.length} pozycji</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Twoje zapisane materiały
            </h1>
          </div>
        </div>
      </div>

      {favoriteBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteBooks.map((book) => {
            const lastPage = lastVisitedPages[book.id] || 1;
            const subjectName = subjectMap.get(book.subjectId) || '';

            return (
              <div
                key={book.id}
                className="group flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-bold text-sky-600 dark:text-sky-400">
                      Klasa {book.grade} · {subjectName}
                    </span>
                    <button
                      onClick={() => onRemoveFavorite(book.id)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                      title="Usuń z ulubionych"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onSelectBook(book.id, lastPage)}
                    className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-sky-600 transition-colors"
                  >
                    {book.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {book.publisher} · {book.editionYear}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Ostatnia strona: <strong className="text-slate-900 dark:text-white">{lastPage}</strong>
                  </span>
                  <button
                    onClick={() => onSelectBook(book.id, lastPage)}
                    className="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700"
                  >
                    <span>Otwórz podręcznik</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-16 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Brak ulubionych książek
          </h3>
          <p className="text-xs text-slate-500">
            Podczas przeglądania podręczników i zeszytów ćwiczeń kliknij ikonę zakładki, aby dodać je do ulubionych.
          </p>
        </div>
      )}
    </div>
  );
};
