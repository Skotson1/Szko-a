import React, { useState, useEffect } from 'react';
import { Book, Subject, Task } from '../types';
import { TaskCard } from './TaskCard';
import { SubjectIcon } from './SubjectIcon';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookOpen,
  FileText,
  List,
  Search,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  PenLine,
  Eye,
  KeyRound,
  FileEdit,
  Save,
} from 'lucide-react';

interface BookViewerProps {
  book: Book;
  subject: Subject;
  initialPage?: number;
  solvedTasks: string[];
  studentAnswers: Record<string, string>;
  pageNotes: Record<string, string>;
  isFavorite: boolean;
  onToggleFavorite: (bookId: string) => void;
  onToggleSolved: (taskId: string) => void;
  onSavePage: (bookId: string, page: number) => void;
  onSaveStudentAnswer: (taskId: string, answer: string) => void;
  onSavePageNote: (noteKey: string, note: string) => void;
  onBack: () => void;
  onAddTaskForPage: (page: number) => void;
  onEditTask: (task: Task) => void;
}

export const BookViewer: React.FC<BookViewerProps> = ({
  book,
  subject,
  initialPage = 1,
  solvedTasks,
  studentAnswers,
  pageNotes,
  isFavorite,
  onToggleFavorite,
  onToggleSolved,
  onSavePage,
  onSaveStudentAnswer,
  onSavePageNote,
  onBack,
  onAddTaskForPage,
  onEditTask,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageInput, setPageInput] = useState<string>(initialPage.toString());
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [viewAllTasks, setViewAllTasks] = useState<boolean>(false);
  const [pdfZoom, setPdfZoom] = useState<number>(100);
  const [showQuickAnswers, setShowQuickAnswers] = useState<boolean>(true);
  const [isPageNoteOpen, setIsPageNoteOpen] = useState<boolean>(false);

  const pageNoteKey = `${book.id}_page_${currentPage}`;
  const [currentNoteText, setCurrentNoteText] = useState<string>(pageNotes[pageNoteKey] || '');

  // Sync page state when initialPage prop changes
  useEffect(() => {
    if (initialPage && initialPage !== currentPage) {
      setCurrentPage(initialPage);
      setPageInput(initialPage.toString());
    }
  }, [initialPage]);

  // Sync page notes when page changes
  useEffect(() => {
    const key = `${book.id}_page_${currentPage}`;
    setCurrentNoteText(pageNotes[key] || '');
  }, [currentPage, book.id, pageNotes]);

  // Update localStorage when currentPage changes
  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, book.totalPages || 300));
    setCurrentPage(validPage);
    setPageInput(validPage.toString());
    onSavePage(book.id, validPage);
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed)) {
      handlePageChange(parsed);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handleSaveCurrentPageNote = () => {
    onSavePageNote(pageNoteKey, currentNoteText);
  };

  // Find chapter of current page
  const currentChapter = book.chapters?.find(
    (ch) => currentPage >= ch.startPage && currentPage <= ch.endPage
  );

  // Tasks filtering
  const allTasks = book.tasks || [];
  const pageTasks = allTasks.filter((t) => t.page === currentPage);
  const displayedTasks = viewAllTasks ? allTasks : pageTasks;

  // Pages with tasks for quick jumping
  const taskPages = Array.from(new Set(allTasks.map((t) => t.page))).sort((a, b) => a - b);

  return (
    <div className="space-y-6 pb-20">
      {/* 1. Permanent Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs cursor-pointer"
            title="Wróć do wyboru książki"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Klasa {book.grade}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{subject.name}</span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {book.type === 'podrecznik' ? 'Podręcznik' : 'Zeszyt ćwiczeń'}
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                {book.editionYear}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2 mt-0.5">
              <span>{book.title}</span>
              {book.part && (
                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({book.part})</span>
              )}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Page margin note toggle */}
          <button
            onClick={() => setIsPageNoteOpen(!isPageNoteOpen)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all shadow-xs cursor-pointer ${
              isPageNoteOpen || currentNoteText.trim().length > 0
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
            }`}
            title="Zapisz notatkę na marginesie tej strony"
          >
            <FileEdit className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>{currentNoteText.trim().length > 0 ? 'Notatka na stronie (zapisano)' : 'Margines / Notatka'}</span>
          </button>

          <button
            onClick={() => onToggleFavorite(book.id)}
            className={`p-2 rounded-xl border transition-colors shadow-xs cursor-pointer ${
              isFavorite
                ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
            }`}
            title={isFavorite ? 'W ulubionych' : 'Dodaj do ulubionych'}
          >
            <Bookmark className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all shadow-xs cursor-pointer ${
              isSidebarOpen
                ? 'bg-sky-600 border-sky-600 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-slate-300'
            }`}
          >
            <List className="w-4 h-4" />
            <span>Spis treści</span>
          </button>
        </div>
      </div>

      {/* 2. Top Controls Bar: Page Navigation & Switchers */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Page Switcher */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-between sm:justify-start">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Poprzednia</span>
          </button>

          <form onSubmit={handleInputSubmit} className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Strona:</span>
            <input
              type="number"
              min={1}
              max={book.totalPages || 300}
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={() => setPageInput(currentPage.toString())}
              className="w-14 px-2 py-1 text-center font-bold text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
            />
            <span className="text-xs text-slate-400">z {book.totalPages || 100}</span>
          </form>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= (book.totalPages || 300)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <span>Następna</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Current Chapter Indicator */}
        <div className="text-center md:text-left text-xs text-slate-600 dark:text-slate-400">
          {currentChapter ? (
            <span className="font-medium">
              <strong className="text-slate-900 dark:text-white">Rozdział {currentChapter.number}:</strong>{' '}
              {currentChapter.title}
            </span>
          ) : (
            <span className="text-slate-400">Strona {currentPage}</span>
          )}
        </div>

        {/* View mode toggle: Current Page vs All Tasks in Book */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewAllTasks(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              !viewAllTasks
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Strona {currentPage} ({pageTasks.length})
          </button>
          <button
            onClick={() => setViewAllTasks(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              viewAllTasks
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Wszystkie zadania ({allTasks.length})
          </button>
        </div>
      </div>

      {/* 3. Page Margin Notes / Brudnopis panel (when opened) */}
      {isPageNoteOpen && (
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <FileEdit className="w-4 h-4 text-amber-600" />
              Margines i notatnik ucznia na stronie {currentPage}:
            </span>
            <button
              onClick={() => setIsPageNoteOpen(false)}
              className="text-xs text-amber-700 hover:underline"
            >
              Zamknij notatnik
            </button>
          </div>

          <textarea
            rows={3}
            placeholder="Wpisz własne notatki z lekcji, uwagi nauczyciela, wskazówki do sprawdzianu lub brudnopis dla tej strony..."
            value={currentNoteText}
            onChange={(e) => {
              setCurrentNoteText(e.target.value);
              onSavePageNote(pageNoteKey, e.target.value);
            }}
            className="w-full p-3 text-xs sm:text-sm rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          />

          <div className="flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
            <span>Notatka przypisana do: {book.title}, strona {currentPage}</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">✓ Zapisano w pamięci</span>
          </div>
        </div>
      )}

      {/* 4. Quick Jump to Pages with Tasks */}
      {taskPages.length > 0 && !viewAllTasks && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-slate-500 no-scrollbar">
          <span className="font-semibold whitespace-nowrap text-slate-700 dark:text-slate-300">
            Przejdź do zadań na stronach:
          </span>
          {taskPages.map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors shrink-0 cursor-pointer ${
                p === currentPage
                  ? 'bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-bold'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              str. {p}
            </button>
          ))}
        </div>
      )}

      {/* 5. Main Grid: Optional Sidebar (Spis treści) + Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Table of contents sidebar */}
        {isSidebarOpen && (
          <aside className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <List className="w-4 h-4 text-sky-600" />
                Spis treści i działy
              </h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Zamknij
              </button>
            </div>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {book.chapters && book.chapters.length > 0 ? (
                book.chapters.map((ch) => {
                  const isActive = currentPage >= ch.startPage && currentPage <= ch.endPage;
                  const chapterTasks = allTasks.filter(
                    (t) => t.page >= ch.startPage && t.page <= ch.endPage
                  );

                  return (
                    <button
                      key={ch.id}
                      onClick={() => handlePageChange(ch.startPage)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                        isActive
                          ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Rozdział {ch.number}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          str. {ch.startPage}–{ch.endPage}
                        </span>
                      </div>
                      <p className="mt-1 font-medium line-clamp-2">{ch.title}</p>
                      {chapterTasks.length > 0 && (
                        <p className="mt-2 text-[10px] text-sky-600 dark:text-sky-400 font-semibold">
                          {chapterTasks.length} {chapterTasks.length === 1 ? 'zadanie' : 'zadań'} z rozwiązaniem
                        </p>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">Brak zdefiniowanych rozdziałów</p>
              )}
            </div>

            {/* Book metadata info card */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-[11px] text-slate-500">
              <p>
                <strong>Wydawnictwo:</strong> {book.publisher}
              </p>
              <p>
                <strong>Wydanie:</strong> {book.editionYear}
              </p>
              {book.isbn && (
                <p>
                  <strong>ISBN:</strong> {book.isbn}
                </p>
              )}
              {book.approvalNumber && (
                <p>
                  <strong>Nr dopuszczenia MEN:</strong> {book.approvalNumber}
                </p>
              )}
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                {book.licenseInfo}
              </p>
            </div>
          </aside>
        )}

        {/* Main Content Area */}
        <main className={`${isSidebarOpen ? 'lg:col-span-8' : 'lg:col-span-12'} space-y-6`}>
          {/* Quick Answers Sheet Banner (Zestawienie odpowiedzi na stronie) */}
          {pageTasks.length > 0 && !viewAllTasks && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-slate-900 dark:via-emerald-950/20 dark:to-slate-900 border border-emerald-200 dark:border-emerald-800/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-900 dark:text-emerald-200">
                    Szybkie odpowiedzi do zadań na stronie {currentPage}:
                  </span>
                </div>
                <button
                  onClick={() => setShowQuickAnswers(!showQuickAnswers)}
                  className="text-xs text-emerald-700 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  {showQuickAnswers ? 'Schowaj skrót' : 'Pokaż skrót odpowiedzi'}
                </button>
              </div>

              {showQuickAnswers && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
                  {pageTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-850 border border-emerald-100 dark:border-emerald-800/60 shadow-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {task.taskNumber}
                        </span>
                        <a
                          href={`#task-${task.id}`}
                          className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                        >
                          Zobacz kroki ↓
                        </a>
                      </div>
                      <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300 line-clamp-2">
                        {task.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* If Book has a PDF attached */}
          {book.pdfUrl && (
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 flex items-center justify-between gap-3 text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-600" />
                  Wbudowany czytnik PDF materiałów
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPdfZoom((z) => Math.max(50, z - 20))}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Pomniejsz"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-xs">{pdfZoom}%</span>
                  <button
                    onClick={() => setPdfZoom((z) => Math.min(200, z + 20))}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Powiększ"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setPdfZoom(100)}
                    className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                    title="Domyślne powiększenie"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="h-[450px] w-full bg-slate-950 flex items-center justify-center overflow-auto p-4">
                <iframe
                  src={`${book.pdfUrl}#page=${currentPage}`}
                  title={book.title}
                  className="w-full h-full rounded border-0"
                  style={{ transform: `scale(${pdfZoom / 100})`, transformOrigin: 'top center' }}
                />
              </div>
            </div>
          )}

          {/* Section: Tasks and Solutions for Current Page / Book */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>
                    {viewAllTasks ? 'Wszystkie zadania z książki' : `Zadania i rozwiązania (Strona ${currentPage})`}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-semibold">
                    {displayedTasks.length}
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Możesz pisać swoje obliczenia w zeszycie ćwiczeń, podkreślać fragmenty i natychmiast sprawdzać poprawność odpowiedzi.
                </p>
              </div>

              <button
                onClick={() => onAddTaskForPage(currentPage)}
                className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj zadanie do str. {currentPage}</span>
              </button>
            </div>

            {/* Tasks List */}
            {displayedTasks.length > 0 ? (
              <div className="space-y-5">
                {displayedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    grade={book.grade}
                    isSolved={solvedTasks.includes(task.id)}
                    studentAnswer={studentAnswers[task.id] || ''}
                    onSaveStudentAnswer={onSaveStudentAnswer}
                    onToggleSolved={onToggleSolved}
                    onEditTask={onEditTask}
                  />
                ))}
              </div>
            ) : (
              /* Empty page tasks message with direct add affordance */
              <div className="p-10 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center bg-white dark:bg-slate-900 space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div className="max-w-md mx-auto">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Brak zadań wprowadzonych na stronę {currentPage}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Dla strony {currentPage} możesz dodać nowe zadanie z pytaniem i rozwiązaniem lub przejść do stron z gotowymi opracowaniami.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => onAddTaskForPage(currentPage)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Dodaj zadanie na stronę {currentPage}</span>
                  </button>

                  {taskPages.length > 0 && (
                    <button
                      onClick={() => handlePageChange(taskPages[0])}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                      Przejdź do str. {taskPages[0]}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
