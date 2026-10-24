import React from 'react';
import { Book } from '../types';
import { BookOpen, Sparkles, ArrowRight, Library, FileText, CheckCircle2 } from 'lucide-react';

interface GradeSelectorProps {
  books: Book[];
  onSelectGrade: (grade: number) => void;
  onOpenSearch: () => void;
}

interface GradeMeta {
  grade: number;
  stageName: string;
  stageGroup: 'wczesnoszkolna' | 'srednia' | 'egzaminacyjna';
  badgeColor: string;
  description: string;
}

const GRADES_META: GradeMeta[] = [
  {
    grade: 1,
    stageName: 'Edukacja wczesnoszkolna',
    stageGroup: 'wczesnoszkolna',
    badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    description: 'Pierwsze litery, głoskowanie, liczby do 10 i obserwacje przyrody',
  },
  {
    grade: 2,
    stageName: 'Edukacja wczesnoszkolna',
    stageGroup: 'wczesnoszkolna',
    badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    description: 'Płynne czytanie, podstawy gramatyki i tabliczka mnożenia',
  },
  {
    grade: 3,
    stageName: 'Edukacja wczesnoszkolna',
    stageGroup: 'wczesnoszkolna',
    badgeColor: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300',
    description: 'Kolejność działań, ortografia, ekosystemy i podsumowanie I etapu',
  },
  {
    grade: 4,
    stageName: 'Drugi etap edukacyjny',
    stageGroup: 'srednia',
    badgeColor: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
    description: 'Wprowadzenie do osobnych przedmiotów, przyroda, historia i technika',
  },
  {
    grade: 5,
    stageName: 'Drugi etap edukacyjny',
    stageGroup: 'srednia',
    badgeColor: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
    description: 'Geografia i biologia jako osobne przedmioty, ułamki i mapa',
  },
  {
    grade: 6,
    stageName: 'Drugi etap edukacyjny',
    stageGroup: 'srednia',
    badgeColor: 'border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300',
    description: 'Środki stylistyczne, ułamki dziesiętne, proporcje i historia nowożytna',
  },
  {
    grade: 7,
    stageName: 'Przygotowanie egzaminacyjne',
    stageGroup: 'egzaminacyjna',
    badgeColor: 'border-indigo-200 bg-indigo-50 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300',
    description: 'Fizyka i chemia, algebra, zaawansowana gramatyka i rozszerzone lektury',
  },
  {
    grade: 8,
    stageName: 'Klasa egzaminacyjna (CKE)',
    stageGroup: 'egzaminacyjna',
    badgeColor: 'border-violet-200 bg-violet-50 text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-300',
    description: 'Egzamin ósmoklasisty, arkusze CKE, WOS, EDB i powtórzenie wiedzy',
  },
];

export const GradeSelector: React.FC<GradeSelectorProps> = ({ books, onSelectGrade, onOpenSearch }) => {
  // Counts per grade
  const getCountsForGrade = (grade: number) => {
    const gradeBooks = books.filter((b) => b.grade === grade);
    const textbooksCount = gradeBooks.filter((b) => b.type === 'podrecznik').length;
    const workbooksCount = gradeBooks.filter((b) => b.type === 'zeszyt_cwiczen').length;
    const tasksCount = gradeBooks.reduce((sum, b) => sum + (b.tasks?.length || 0), 0);
    return { total: gradeBooks.length, textbooksCount, workbooksCount, tasksCount };
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Welcome Banner */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-sky-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/70 p-6 sm:p-10 shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-sky-700 dark:text-sky-300 uppercase tracking-wider mb-3">
            <Sparkles className="w-4 h-4 text-sky-500" />
            <span>Katalog szkolny szkół podstawowych w Polsce</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.15]">
            Szkolna Biblioteka <span className="text-sky-600 dark:text-sky-400">1–8</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Przeglądaj podręczniki, zeszyty ćwiczeń i rzetelne rozwiązania zadań krok po kroku. Wybierz swoją klasę,
            aby zacząć naukę z oficjalnymi spisami treści i autorskimi wyjaśnieniami dydaktycznymi.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Klasy 1 do 8 w pełnym wymiarze</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Osobne wydania i tomy</span>
            </div>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Wskazówki przed odkryciem odpowiedzi</span>
            </div>
          </div>
        </div>

        {/* Decorative corner illustration */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-15 dark:opacity-10 pointer-events-none hidden lg:block bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:16px_16px]" />
      </section>

      {/* 8 Big Aesthetic Grade Tiles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Wybierz klasę
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Kliknij kafelek klasy, aby przejść do listy przedmiotów i podręczników
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {GRADES_META.map((meta) => {
            const counts = getCountsForGrade(meta.grade);
            return (
              <button
                key={meta.grade}
                onClick={() => onSelectGrade(meta.grade)}
                className="group relative flex flex-col justify-between text-left p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                {/* Header of card: Grade number and stage */}
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-extrabold text-2xl group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600 transition-colors shadow-sm">
                      {meta.grade}
                    </div>

                    <span className="text-[11px] font-semibold tracking-wide text-slate-500 dark:text-slate-400 uppercase text-right">
                      {meta.stageName}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Klasa {meta.grade}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {meta.description}
                  </p>
                </div>

                {/* Footer of card: Material counts and action arrow */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                      {counts.textbooksCount} podr.
                    </span>
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    <span className="flex items-center gap-1 font-medium">
                      <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      {counts.workbooksCount} ćwicz.
                    </span>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/60 group-hover:text-sky-600 dark:group-hover:text-sky-400 flex items-center justify-center transition-colors">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Info on methodology & legal notices */}
      <section className="p-6 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Library className="w-4 h-4 text-sky-600" />
              Standardy rzetelności i prawa autorskiego
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
              Wszystkie rozwiązania zadań są tworzone jako niezależne opracowania dydaktyczne. Odpowiedzi oznaczone jako
              „Oficjalne” pochodzą z autoryzowanych kluczy wydawców. Własne zeszyty i podręczniki PDF możesz wgrać w
              panelu „Dodaj materiał” do prywatnego użytku edukacyjnego.
            </p>
          </div>
          <button
            onClick={onOpenSearch}
            className="self-start md:self-auto px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-slate-300 transition-colors whitespace-nowrap"
          >
            Przeszukaj bazę zadań
          </button>
        </div>
      </section>
    </div>
  );
};
