import React, { useState } from 'react';
import { Book, Subject } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { ArrowLeft, Plus, Settings2, BookOpen, Layers, Sparkles } from 'lucide-react';

interface SubjectSelectorProps {
  grade: number;
  subjects: Subject[];
  books: Book[];
  onSelectSubject: (subjectId: string) => void;
  onBack: () => void;
  onOpenSubjectEditor: () => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  grade,
  subjects,
  books,
  onSelectSubject,
  onBack,
  onOpenSubjectEditor,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Filter subjects for this grade
  const gradeSubjects = subjects.filter((s) => s.grades.includes(grade));

  const filteredSubjects = filterCategory === 'all'
    ? gradeSubjects
    : gradeSubjects.filter((s) => s.category === filterCategory);

  const getBooksCountForSubject = (subjectId: string) => {
    const list = books.filter((b) => b.grade === grade && b.subjectId === subjectId);
    const textbooks = list.filter((b) => b.type === 'podrecznik').length;
    const workbooks = list.filter((b) => b.type === 'zeszyt_cwiczen').length;
    return { total: list.length, textbooks, workbooks };
  };

  const isEarlyGrade = grade >= 1 && grade <= 3;

  return (
    <div className="space-y-8 pb-16">
      {/* Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
            title="Wróć do wyboru klasy"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                Krok 2 z 4: Wybór przedmiotu
              </span>
              <span className="text-slate-300 dark:text-slate-700">·</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {isEarlyGrade ? 'I etap: Edukacja wczesnoszkolna' : 'II etap: Przedmioty nauczania'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Klasa {grade} – Przedmioty szkolne
            </h1>
          </div>
        </div>

        <button
          onClick={onOpenSubjectEditor}
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-xs"
        >
          <Settings2 className="w-4 h-4 text-slate-500" />
          <span>Edytuj listę przedmiotów</span>
        </button>
      </div>

      {/* Early Elementary Explanatory note */}
      {isEarlyGrade && (
        <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm text-amber-900 dark:text-amber-200 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>W klasach 1–3</strong> nauczanie ma charakter zintegrowany. Podręczniki łączą edukację polonistyczną,
            społeczną, matematyczną i przyrodniczą w spójne bloki tematyczne (często dzielone na części: jesień, zima,
            wiosna).
          </p>
        </div>
      )}

      {/* Category filter tabs */}
      {!isEarlyGrade && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium no-scrollbar">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterCategory === 'all'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            Wszystkie ({gradeSubjects.length})
          </button>
          <button
            onClick={() => setFilterCategory('scisle')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterCategory === 'scisle'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            Ścisłe (Matematyka, Fizyka, Chemia...)
          </button>
          <button
            onClick={() => setFilterCategory('humanistyczne')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterCategory === 'humanistyczne'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            Humanistyczne (Polski, Historia, WOS...)
          </button>
          <button
            onClick={() => setFilterCategory('przyrodnicze')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterCategory === 'przyrodnicze'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            Przyrodnicze (Biologia, Geografia...)
          </button>
          <button
            onClick={() => setFilterCategory('jezyki')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              filterCategory === 'jezyki'
                ? 'bg-slate-900 text-white dark:bg-sky-600'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
            }`}
          >
            Języki obce
          </button>
        </div>
      )}

      {/* Subject Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map((subject) => {
          const counts = getBooksCountForSubject(subject.id);
          return (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject.id)}
              className="group flex flex-col justify-between text-left p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 hover:border-sky-400 dark:hover:border-sky-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                    <SubjectIcon name={subject.iconName} className="w-6 h-6" />
                  </div>
                  {subject.isCustom && (
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                      Własny
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                  {subject.name}
                </h3>
                {subject.description && (
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                  {counts.total > 0 ? (
                    <span>
                      {counts.textbooks} podr. · {counts.workbooks} ćwicz.
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">Brak dodanych książek</span>
                  )}
                </span>
                <span className="text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Przeglądaj →
                </span>
              </div>
            </button>
          );
        })}

        {/* Custom Subject Creation Card */}
        <button
          onClick={onOpenSubjectEditor}
          className="flex flex-col items-center justify-center text-center p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-600 bg-slate-50/50 dark:bg-slate-900/30 text-slate-600 dark:text-slate-400 hover:text-sky-600 transition-all cursor-pointer min-h-[170px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center mb-3">
            <Plus className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </div>
          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Dodaj inny przedmiot</span>
          <span className="text-xs text-slate-400 mt-1">Dostosuj listę przedmiotów dla klasy {grade}</span>
        </button>
      </div>
    </div>
  );
};
