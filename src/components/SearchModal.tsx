import React, { useState, useMemo } from 'react';
import { Book, Subject, Task, MaterialType } from '../types';
import { FormattedMathText } from '../utils/mathFormatter';
import { Search, X, BookOpen, FileText, ChevronRight, Filter, Sparkles } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  subjects: Subject[];
  onOpenBook: (bookId: string, page?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  books,
  subjects,
  onOpenBook,
}) => {
  const [query, setQuery] = useState<string>('');
  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MaterialType | 'all'>('all');

  const subjectMap = useMemo(() => {
    return new Map(subjects.map((s) => [s.id, s]));
  }, [subjects]);

  // Perform search across books and tasks
  const { matchingBooks, matchingTasks } = useMemo(() => {
    const q = query.trim().toLowerCase();

    // Filter books by grade & type first
    let filtered = books;
    if (selectedGrade !== 'all') {
      filtered = filtered.filter((b) => b.grade === selectedGrade);
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter((b) => b.type === selectedType);
    }

    if (!q) {
      return {
        matchingBooks: filtered.slice(0, 8),
        matchingTasks: [],
      };
    }

    // Matching books
    const bMatches = filtered.filter((b) => {
      const subjectName = subjectMap.get(b.subjectId)?.name.toLowerCase() || '';
      return (
        b.title.toLowerCase().includes(q) ||
        b.publisher.toLowerCase().includes(q) ||
        b.editionYear.toLowerCase().includes(q) ||
        subjectName.includes(q)
      );
    });

    // Matching tasks inside filtered books
    const tMatches: { task: Task; book: Book }[] = [];
    filtered.forEach((b) => {
      (b.tasks || []).forEach((t) => {
        if (
          t.content.toLowerCase().includes(q) ||
          t.taskNumber.toLowerCase().includes(q) ||
          (t.title && t.title.toLowerCase().includes(q)) ||
          t.answer.toLowerCase().includes(q) ||
          t.page.toString() === q
        ) {
          tMatches.push({ task: t, book: b });
        }
      });
    });

    return {
      matchingBooks: bMatches,
      matchingTasks: tMatches.slice(0, 20),
    };
  }, [query, selectedGrade, selectedType, books, subjectMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden mt-6 sm:mt-12 transition-all">
        {/* Top Search Input */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Wpisz treść zadania, numer strony, tytuł książki lub przedmiot..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden text-base sm:text-lg"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg shrink-0"
          >
            Zamknij (ESC)
          </button>
        </div>

        {/* Filters Strip */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-850 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-medium text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtruj:</span>
          </div>

          {/* Grade filter */}
          <select
            value={selectedGrade}
            onChange={(e) =>
              setSelectedGrade(e.target.value === 'all' ? 'all' : parseInt(e.target.value, 10))
            }
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Wszystkie klasy (1–8)</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
              <option key={g} value={g}>
                Klasa {g}
              </option>
            ))}
          </select>

          {/* Type filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as MaterialType | 'all')}
            className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="all">Wszystkie rodzaje materiałów</option>
            <option value="podrecznik">Tylko podręczniki</option>
            <option value="zeszyt_cwiczen">Tylko zeszyty ćwiczeń</option>
          </select>
        </div>

        {/* Results Body */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6">
          {/* Books matches */}
          {matchingBooks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Podręczniki i Zeszyty ({matchingBooks.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingBooks.map((book) => {
                  const subjectName = subjectMap.get(book.subjectId)?.name || '';
                  return (
                    <button
                      key={book.id}
                      onClick={() => {
                        onClose();
                        onOpenBook(book.id);
                      }}
                      className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-xs transition-all text-left"
                    >
                      <div className="w-10 h-12 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-200/50">
                        {book.type === 'podrecznik' ? (
                          <BookOpen className="w-5 h-5 text-sky-600" />
                        ) : (
                          <FileText className="w-5 h-5 text-emerald-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-slate-500 font-medium flex items-center gap-1.5">
                          <span>Klasa {book.grade}</span>
                          <span>·</span>
                          <span className="truncate">{subjectName}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                          {book.title}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">
                          {book.publisher} · {book.editionYear}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 self-center" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tasks matches */}
          {matchingTasks.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Dopasowane zadania ({matchingTasks.length})
              </h4>
              <div className="space-y-3">
                {matchingTasks.map(({ task, book }) => (
                  <button
                    key={task.id}
                    onClick={() => {
                      onClose();
                      onOpenBook(book.id, task.page);
                    }}
                    className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 bg-white dark:bg-slate-900/50 transition-all space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400">
                        <span>{task.taskNumber}</span>
                        <span className="text-slate-400">·</span>
                        <span className="text-slate-600 dark:text-slate-300">
                          strona {task.page}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {book.title} (Klasa {book.grade})
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
                      {task.content}
                    </p>

                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 p-2 rounded-lg border border-emerald-100 dark:border-emerald-800/50 line-clamp-1">
                      <strong>Odpowiedź:</strong> {task.answer}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingBooks.length === 0 && matchingTasks.length === 0 && (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                Nie znaleziono wyników dla „{query}”
              </p>
              <p className="text-xs text-slate-400">
                Spróbuj zmienić filtry klasy lub wpisać inne słowo kluczowe.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
