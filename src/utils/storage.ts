import { Book, Subject, Task, UserProgress } from '../types';
import { DEMO_BOOKS } from '../data/demoBooks';
import { INITIAL_SUBJECTS } from '../data/initialSubjects';

const STORAGE_KEYS = {
  BOOKS: 'szkolna_biblioteka_books_v2',
  SUBJECTS: 'szkolna_biblioteka_subjects_v1',
  PROGRESS: 'szkolna_biblioteka_progress_v2',
  THEME: 'szkolna_biblioteka_theme_v1',
};

export const getStoredBooks = (): Book[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(DEMO_BOOKS));
      return DEMO_BOOKS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEMO_BOOKS;
  } catch (e) {
    console.error('Error loading stored books, falling back to demo:', e);
    return DEMO_BOOKS;
  }
};

export const saveStoredBooks = (books: Book[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books));
  } catch (e) {
    console.error('Error saving books to storage:', e);
  }
};

export const getStoredSubjects = (): Subject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
      return INITIAL_SUBJECTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SUBJECTS;
  } catch (e) {
    console.error('Error loading stored subjects, falling back to initial:', e);
    return INITIAL_SUBJECTS;
  }
};

export const saveStoredSubjects = (subjects: Subject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  } catch (e) {
    console.error('Error saving subjects to storage:', e);
  }
};

export const getStoredProgress = (): UserProgress => {
  const fallback: UserProgress = {
    favorites: [],
    recentlyViewed: [],
    lastVisitedPage: {},
    solvedTasks: [],
    notes: {},
    studentAnswers: {},
    pageNotes: {},
    highlights: {},
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(fallback));
      return fallback;
    }
    const parsed = JSON.parse(raw);
    return {
      ...fallback,
      ...parsed,
      studentAnswers: parsed.studentAnswers || {},
      pageNotes: parsed.pageNotes || {},
      highlights: parsed.highlights || {},
    };
  } catch (e) {
    console.error('Error loading progress:', e);
    return fallback;
  }
};

export const saveStoredProgress = (progress: UserProgress): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
};

export const getStoredTheme = (): 'light' | 'dark' => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.THEME);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const saveStoredTheme = (theme: 'light' | 'dark'): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Error setting theme:', e);
  }
};

// Export entire dataset to downloadable JSON
export const exportDataAsJSON = (books: Book[], subjects: Subject[]): void => {
  const exportPayload = {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    appName: 'Szkolna Biblioteka 1–8',
    subjects,
    books,
  };

  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `szkolna_biblioteka_backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Reset library to factory demonstration state
export const resetToDemoData = (): { books: Book[]; subjects: Subject[] } => {
  localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(DEMO_BOOKS));
  localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(INITIAL_SUBJECTS));
  return {
    books: DEMO_BOOKS,
    subjects: INITIAL_SUBJECTS,
  };
};
