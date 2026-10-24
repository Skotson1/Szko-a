export type MaterialType = 'podrecznik' | 'zeszyt_cwiczen';

export type AnswerStatus = 'oficjalna' | 'autorska' | 'do_uzupelnienia';

export type VerificationStatus = 
  | 'oficjalny_klucz' 
  | 'autorskie_zweryfikowane' 
  | 'weryfikacja_spolecznosci' 
  | 'szkic';

export interface ExplanationStep {
  step: number;
  title?: string;
  text: string;
  tip?: string;
}

export interface Task {
  id: string;
  bookId: string;
  chapterId?: string;
  page: number;
  taskNumber: string; // e.g. "Zadanie 1", "Ćwiczenie 3 b)", "Zadanie z gwiazdką (*)"
  title?: string;
  content: string; // Task question / content
  hint?: string; // Optional hint before revealing answer
  answer: string; // Complete solution / final answer
  explanationSteps: ExplanationStep[]; // Step-by-step explanation
  isOpenEnded?: boolean; // e.g., open question / "Przykładowa odpowiedź"
  answerStatus: AnswerStatus;
  difficulty?: 'latwe' | 'srednie' | 'trudne' | 'olimpijskie';
  tags?: string[];
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  startPage: number;
  endPage: number;
  description?: string;
}

export interface Book {
  id: string;
  title: string;
  subtitle?: string;
  type: MaterialType;
  grade: number; // 1 to 8
  subjectId: string;
  publisher: string; // e.g. Nowa Era, GWO, WSiP, Macmillan, Pearson
  part?: string; // e.g. "Część 1", "Część 2", "Całość"
  editionYear: string; // e.g. "Wydanie 2024 (nowa podstawa)", "Wydanie 2022"
  isbn?: string;
  approvalNumber?: string; // Nr dopuszczenia MEN / MENiS
  coverUrl?: string;
  coverGradient?: string;
  pdfUrl?: string; // Optional PDF link or object URL
  pdfFileName?: string;
  isDemo: boolean; // Demonstracyjny vs Własny użytkownika
  verificationStatus: VerificationStatus;
  licenseInfo: string;
  description?: string;
  totalPages: number;
  chapters: Chapter[];
  tasks: Task[];
  createdAt?: string;
}

export interface Subject {
  id: string;
  name: string;
  iconName: string;
  grades: number[]; // Grades where this subject is taught
  category: 'humanistyczne' | 'scisle' | 'przyrodnicze' | 'jezyki' | 'artystyczne_praktyczne' | 'wczesnoszkolne' | 'ogolne';
  description?: string;
  isCustom?: boolean;
}

export interface HighlightItem {
  id: string;
  color: 'yellow' | 'green' | 'pink' | 'blue' | 'underline';
  text: string;
  date: string;
}

export interface UserProgress {
  favorites: string[]; // book IDs
  recentlyViewed: {
    bookId: string;
    lastOpened: string;
    lastPage: number;
  }[];
  lastVisitedPage: Record<string, number>; // bookId -> page
  solvedTasks: string[]; // task IDs
  notes: Record<string, string>; // note key -> content
  studentAnswers: Record<string, string>; // taskId -> student written answer
  pageNotes: Record<string, string>; // `${bookId}_page_${page}` -> note in margin
  highlights: Record<string, HighlightItem[]>; // `${bookId}_page_${page}` -> list of highlighted texts
}

export type ViewMode = 
  | 'grades' 
  | 'subjects' 
  | 'books' 
  | 'book_reader' 
  | 'favorites' 
  | 'recent' 
  | 'search';
