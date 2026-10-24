import React, { useState, useEffect } from 'react';
import { ViewMode, Book, Subject, Task } from './types';
import {
  getStoredBooks,
  saveStoredBooks,
  getStoredSubjects,
  saveStoredSubjects,
  getStoredProgress,
  saveStoredProgress,
  getStoredTheme,
  saveStoredTheme,
  resetToDemoData,
} from './utils/storage';
import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { SubjectSelector } from './components/SubjectSelector';
import { BookCatalog } from './components/BookCatalog';
import { BookViewer } from './components/BookViewer';
import { SearchModal } from './components/SearchModal';
import { ManageMaterialsModal } from './components/ManageMaterialsModal';
import { SubjectEditorModal } from './components/SubjectEditorModal';
import { FavoritesView } from './components/FavoritesView';
import { RecentView } from './components/RecentView';

export default function App() {
  // --- Persistent State ---
  const [books, setBooks] = useState<Book[]>(getStoredBooks);
  const [subjects, setSubjects] = useState<Subject[]>(getStoredSubjects);
  const [progress, setProgress] = useState(getStoredProgress);
  const [theme, setTheme] = useState<'light' | 'dark'>(getStoredTheme);

  // --- Navigation & View State ---
  const [currentView, setCurrentView] = useState<ViewMode>('grades');
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [readerInitialPage, setReaderInitialPage] = useState<number>(1);
  const [previousView, setPreviousView] = useState<ViewMode>('grades');

  // --- Modals State ---
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isManageModalOpen, setIsManageModalOpen] = useState<boolean>(false);
  const [isSubjectEditorOpen, setIsSubjectEditorOpen] = useState<boolean>(false);
  const [modalDefaultBookId, setModalDefaultBookId] = useState<string | undefined>();
  const [modalDefaultPage, setModalDefaultPage] = useState<number | undefined>();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sync theme to HTML root
  useEffect(() => {
    saveStoredTheme(theme);
  }, [theme]);

  // Save books whenever modified
  const handleUpdateBooks = (newBooks: Book[]) => {
    setBooks(newBooks);
    saveStoredBooks(newBooks);
  };

  // Save subjects whenever modified
  const handleUpdateSubjects = (newSubjects: Subject[]) => {
    setSubjects(newSubjects);
    saveStoredSubjects(newSubjects);
  };

  // Save progress helper
  const updateProgress = (updater: (prev: typeof progress) => typeof progress) => {
    setProgress((prev) => {
      const next = updater(prev);
      saveStoredProgress(next);
      return next;
    });
  };

  // Theme toggle
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation handlers
  const handleSelectGrade = (grade: number) => {
    setSelectedGrade(grade);
    setCurrentView('subjects');
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setCurrentView('books');
  };

  const handleSelectBook = (bookId: string, page?: number) => {
    const book = books.find((b) => b.id === bookId);
    if (!book) return;

    setSelectedBookId(bookId);
    setSelectedGrade(book.grade);
    setSelectedSubjectId(book.subjectId);

    const targetPage = page || progress.lastVisitedPage[bookId] || 1;
    setReaderInitialPage(targetPage);
    setPreviousView(currentView);
    setCurrentView('book_reader');

    // Record in recently viewed
    updateProgress((prev) => {
      const filtered = prev.recentlyViewed.filter((item) => item.bookId !== bookId);
      const updatedItem = {
        bookId,
        lastOpened: new Date().toISOString(),
        lastPage: targetPage,
      };
      return {
        ...prev,
        recentlyViewed: [updatedItem, ...filtered].slice(0, 20),
      };
    });
  };

  // Save visited page for book
  const handleSavePage = (bookId: string, page: number) => {
    updateProgress((prev) => {
      const nextPages = { ...prev.lastVisitedPage, [bookId]: page };
      const updatedRecent = prev.recentlyViewed.map((item) =>
        item.bookId === bookId ? { ...item, lastPage: page, lastOpened: new Date().toISOString() } : item
      );
      return {
        ...prev,
        lastVisitedPage: nextPages,
        recentlyViewed: updatedRecent,
      };
    });
  };

  // Favorite toggle
  const handleToggleFavorite = (bookId: string) => {
    updateProgress((prev) => {
      const isFav = prev.favorites.includes(bookId);
      return {
        ...prev,
        favorites: isFav ? prev.favorites.filter((id) => id !== bookId) : [...prev.favorites, bookId],
      };
    });
  };

  // Solved task toggle
  const handleToggleSolved = (taskId: string) => {
    updateProgress((prev) => {
      const isSolved = prev.solvedTasks.includes(taskId);
      return {
        ...prev,
        solvedTasks: isSolved ? prev.solvedTasks.filter((id) => id !== taskId) : [...prev.solvedTasks, taskId],
      };
    });
  };

  // Add / Save Book
  const handleSaveBook = (bookToSave: Book) => {
    const exists = books.some((b) => b.id === bookToSave.id);
    const updated = exists ? books.map((b) => (b.id === bookToSave.id ? bookToSave : b)) : [bookToSave, ...books];
    handleUpdateBooks(updated);
  };

  // Add / Save Task
  const handleSaveTask = (taskToSave: Task) => {
    const updatedBooks = books.map((b) => {
      if (b.id === taskToSave.bookId) {
        const tasks = b.tasks || [];
        const taskExists = tasks.some((t) => t.id === taskToSave.id);
        const nextTasks = taskExists
          ? tasks.map((t) => (t.id === taskToSave.id ? taskToSave : t))
          : [...tasks, taskToSave];
        return {
          ...b,
          tasks: nextTasks,
        };
      }
      return b;
    });
    handleUpdateBooks(updatedBooks);
    setEditingTask(null);
  };

  // Reset to demo data
  const handleResetDemo = () => {
    const { books: demoB, subjects: demoS } = resetToDemoData();
    setBooks(demoB);
    setSubjects(demoS);
  };

  // Import JSON handler
  const handleImportJSON = (importedBooks: Book[], importedSubjects?: Subject[]) => {
    if (importedBooks && importedBooks.length > 0) {
      handleUpdateBooks(importedBooks);
    }
    if (importedSubjects && importedSubjects.length > 0) {
      handleUpdateSubjects(importedSubjects);
    }
  };

  // Hotkey for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Save student written answers
  const handleSaveStudentAnswer = (taskId: string, answer: string) => {
    updateProgress((prev) => ({
      ...prev,
      studentAnswers: {
        ...prev.studentAnswers,
        [taskId]: answer,
      },
    }));
  };

  // Save page note / margin
  const handleSavePageNote = (noteKey: string, note: string) => {
    updateProgress((prev) => ({
      ...prev,
      pageNotes: {
        ...prev.pageNotes,
        [noteKey]: note,
      },
    }));
  };

  // Current selected entities
  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId);
  const selectedBook = books.find((b) => b.id === selectedBookId);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header */}
      <Header
        currentView={currentView}
        onNavigate={(view) => {
          if (view === 'grades') {
            setSelectedGrade(null);
            setSelectedSubjectId(null);
            setSelectedBookId(null);
          }
          setCurrentView(view);
        }}
        favoritesCount={progress.favorites.length}
        recentCount={progress.recentlyViewed.length}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenManageModal={() => {
          setEditingTask(null);
          setModalDefaultBookId(selectedBookId || undefined);
          setIsManageModalOpen(true);
        }}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main App Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* VIEW 1: Grades Selection (8 big tiles) */}
        {currentView === 'grades' && (
          <GradeSelector
            books={books}
            onSelectGrade={handleSelectGrade}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        )}

        {/* VIEW 2: Subjects Selection for chosen grade */}
        {currentView === 'subjects' && selectedGrade !== null && (
          <SubjectSelector
            grade={selectedGrade}
            subjects={subjects}
            books={books}
            onSelectSubject={handleSelectSubject}
            onBack={() => setCurrentView('grades')}
            onOpenSubjectEditor={() => setIsSubjectEditorOpen(true)}
          />
        )}

        {/* VIEW 3: Book Catalog (Podręczniki vs Zeszyty ćwiczeń) */}
        {currentView === 'books' && selectedGrade !== null && selectedSubject && (
          <BookCatalog
            grade={selectedGrade}
            subject={selectedSubject}
            books={books}
            favorites={progress.favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectBook={handleSelectBook}
            onBack={() => setCurrentView('subjects')}
            onAddBook={() => {
              setModalDefaultBookId(undefined);
              setIsManageModalOpen(true);
            }}
          />
        )}

        {/* VIEW 4: Book Reader (Chapters, Page Jump, Tasks & Solutions) */}
        {currentView === 'book_reader' && selectedBook && selectedSubject && (
          <BookViewer
            book={selectedBook}
            subject={selectedSubject}
            initialPage={readerInitialPage}
            solvedTasks={progress.solvedTasks}
            studentAnswers={progress.studentAnswers || {}}
            pageNotes={progress.pageNotes || {}}
            isFavorite={progress.favorites.includes(selectedBook.id)}
            onToggleFavorite={handleToggleFavorite}
            onToggleSolved={handleToggleSolved}
            onSavePage={handleSavePage}
            onSaveStudentAnswer={handleSaveStudentAnswer}
            onSavePageNote={handleSavePageNote}
            onBack={() => {
              if (previousView === 'favorites' || previousView === 'recent') {
                setCurrentView(previousView);
              } else {
                setCurrentView('books');
              }
            }}
            onAddTaskForPage={(page) => {
              setEditingTask(null);
              setModalDefaultBookId(selectedBook.id);
              setModalDefaultPage(page);
              setIsManageModalOpen(true);
            }}
            onEditTask={(task) => {
              setEditingTask(task);
              setModalDefaultBookId(selectedBook.id);
              setModalDefaultPage(task.page);
              setIsManageModalOpen(true);
            }}
          />
        )}

        {/* VIEW 5: Favorites */}
        {currentView === 'favorites' && (
          <FavoritesView
            favorites={progress.favorites}
            books={books}
            subjects={subjects}
            lastVisitedPages={progress.lastVisitedPage}
            onSelectBook={handleSelectBook}
            onRemoveFavorite={handleToggleFavorite}
            onBack={() => setCurrentView('grades')}
          />
        )}

        {/* VIEW 6: Recently Viewed */}
        {currentView === 'recent' && (
          <RecentView
            recentItems={progress.recentlyViewed}
            books={books}
            subjects={subjects}
            onSelectBook={handleSelectBook}
            onBack={() => setCurrentView('grades')}
          />
        )}
      </div>

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        books={books}
        subjects={subjects}
        onOpenBook={(bookId, page) => {
          handleSelectBook(bookId, page);
        }}
      />

      <ManageMaterialsModal
        isOpen={isManageModalOpen}
        onClose={() => {
          setIsManageModalOpen(false);
          setEditingTask(null);
        }}
        books={books}
        subjects={subjects}
        onSaveBook={handleSaveBook}
        onSaveTask={handleSaveTask}
        onImportJSON={handleImportJSON}
        onResetDemo={handleResetDemo}
        defaultBookId={modalDefaultBookId}
        defaultPage={modalDefaultPage}
        editingTask={editingTask}
      />

      {selectedGrade !== null && (
        <SubjectEditorModal
          isOpen={isSubjectEditorOpen}
          onClose={() => setIsSubjectEditorOpen(false)}
          grade={selectedGrade}
          subjects={subjects}
          onSaveSubjects={handleUpdateSubjects}
          onResetSubjects={() => {
            const { subjects: demoS } = resetToDemoData();
            setSubjects(demoS);
          }}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 mt-auto py-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© Szkolna Biblioteka 1–8. Opracowania dydaktyczne do celów edukacyjnych.</p>
          <div className="flex items-center gap-4 text-xs">
            <span>Dozwolony użytek edukacyjny</span>
            <span>·</span>
            <span>Weryfikacja dydaktyczna</span>
            <span>·</span>
            <button
              onClick={() => {
                setEditingTask(null);
                setIsManageModalOpen(true);
              }}
              className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
            >
              Zarządzaj bazą JSON
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
