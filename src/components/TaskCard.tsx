import React, { useState } from 'react';
import { Task, HighlightItem } from '../types';
import { FormattedMathText } from '../utils/mathFormatter';
import {
  Lightbulb,
  CheckCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Award,
  Check,
  Edit3,
  BookmarkCheck,
  PenLine,
  Highlighter,
  RotateCcw,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  grade: number;
  isSolved: boolean;
  studentAnswer?: string;
  onSaveStudentAnswer?: (taskId: string, answer: string) => void;
  onToggleSolved: (taskId: string) => void;
  onEditTask?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  grade,
  isSolved,
  studentAnswer = '',
  onSaveStudentAnswer,
  onToggleSolved,
  onEditTask,
}) => {
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [studentText, setStudentText] = useState<string>(studentAnswer);
  const [isWorkspaceOpen, setIsWorkspaceOpen] = useState<boolean>(!!studentAnswer);
  const [activeHighlightColor, setActiveHighlightColor] = useState<'yellow' | 'green' | 'pink' | 'blue' | 'underline'>('yellow');
  const [localHighlights, setLocalHighlights] = useState<string[]>([]);
  const [highlightInput, setHighlightInput] = useState<string>('');
  const [isHighlightInputOpen, setIsHighlightInputOpen] = useState<boolean>(false);

  // Sync prop changes
  React.useEffect(() => {
    if (studentAnswer !== studentText) {
      setStudentText(studentAnswer);
    }
  }, [studentAnswer]);

  const handleStudentTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setStudentText(val);
    if (onSaveStudentAnswer) {
      onSaveStudentAnswer(task.id, val);
    }
  };

  const handleAddHighlight = () => {
    if (!highlightInput.trim()) return;
    setLocalHighlights((prev) => [...prev, highlightInput.trim()]);
    setHighlightInput('');
    setIsHighlightInputOpen(false);
  };

  return (
    <div
      id={`task-${task.id}`}
      className={`rounded-2xl border transition-all duration-200 overflow-hidden bg-white dark:bg-slate-900 ${
        isSolved
          ? 'border-emerald-300 dark:border-emerald-800 shadow-xs'
          : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md'
      }`}
    >
      {/* 1. Header Bar: Task Number, Page, Difficulty & Action Buttons */}
      <div className="px-5 py-3.5 bg-slate-50/90 dark:bg-slate-850/90 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-extrabold text-slate-900 dark:text-white text-base">
            {task.taskNumber}
          </span>
          <span className="text-slate-300 dark:text-slate-700">·</span>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            strona {task.page}
          </span>

          {task.difficulty && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                task.difficulty === 'latwe'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                  : task.difficulty === 'trudne' || task.difficulty === 'olimpijskie'
                  ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
              }`}
            >
              {task.difficulty === 'latwe'
                ? 'Łatwe'
                : task.difficulty === 'trudne'
                ? 'Trudne'
                : task.difficulty === 'olimpijskie'
                ? 'Olimpijskie'
                : 'Średnie'}
            </span>
          )}

          {task.isOpenEnded && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
              Zadanie otwarte
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Write in workbook toggle button */}
          <button
            onClick={() => setIsWorkspaceOpen(!isWorkspaceOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isWorkspaceOpen || studentText.trim().length > 0
                ? 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
            }`}
            title="Pisz w zeszycie / Wpisz własne rozwiązanie"
          >
            <PenLine className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
            <span>{studentText.trim().length > 0 ? 'Mój zeszyt (zapisano)' : 'Wpisz odpowiedź'}</span>
          </button>

          {/* Text highlighter button */}
          <button
            onClick={() => setIsHighlightInputOpen(!isHighlightInputOpen)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Podkreśl lub zakreśl ważny fragment"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Podkreśl</span>
          </button>

          {/* Mark as solved */}
          <button
            onClick={() => onToggleSolved(task.id)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              isSolved
                ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title="Oznacz jako zrobione"
          >
            {isSolved ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Rozwiązane</span>
              </>
            ) : (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Zrobione?</span>
              </>
            )}
          </button>

          {onEditTask && (
            <button
              onClick={() => onEditTask(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edytuj treść lub rozwiązanie tego zadania"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Task Content & Questions */}
      <div className="p-5 sm:p-6 space-y-4">
        {task.title && (
          <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {task.title}
          </h4>
        )}

        <div className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
          <FormattedMathText text={task.content} />
        </div>

        {/* Highlighted Fragments Display */}
        {localHighlights.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Highlighter className="w-3 h-3 text-amber-500" />
              Podkreślone w zadaniu:
            </span>
            {localHighlights.map((hl, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-950/60 text-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800 font-medium"
              >
                „{hl}”
              </span>
            ))}
          </div>
        )}

        {/* Highlighting input form (when user wants to highlight keyword/phrase) */}
        {isHighlightInputOpen && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Wpisz fragment do podkreślenia:
            </span>
            <input
              type="text"
              placeholder="np. dana liczba, szukana wartość, wzór..."
              value={highlightInput}
              onChange={(e) => setHighlightInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddHighlight()}
              className="flex-1 min-w-[180px] px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
            />
            <button
              onClick={handleAddHighlight}
              className="px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold"
            >
              Podkreśl
            </button>
            <button
              onClick={() => setIsHighlightInputOpen(false)}
              className="px-2 py-1 text-slate-400 hover:text-slate-600"
            >
              Anuluj
            </button>
          </div>
        )}

        {/* 3. Interactive Student Workbook / Writing Area */}
        {isWorkspaceOpen && (
          <div className="p-4 rounded-xl bg-sky-50/50 dark:bg-slate-850 border border-sky-200/80 dark:border-slate-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 dark:text-sky-300 flex items-center gap-1.5">
                <PenLine className="w-4 h-4 text-sky-600" />
                Mój zeszyt ćwiczeń – Twoje obliczenia i odpowiedź:
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Zapisuje się automatycznie
              </span>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                placeholder="Wpisz tutaj swoje rozwiązanie, tok myślenia, obliczenia lub odpowiedź przed sprawdzeniem..."
                value={studentText}
                onChange={handleStudentTextChange}
                className="w-full p-3 text-xs sm:text-sm rounded-xl border border-sky-300 dark:border-sky-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-inner focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-mono leading-relaxed"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <div className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                {studentText.trim().length > 0 && (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Rozwiązanie ucznia zapisane</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {studentText.trim().length > 0 && (
                  <button
                    onClick={() => {
                      setStudentText('');
                      if (onSaveStudentAnswer) onSaveStudentAnswer(task.id, '');
                    }}
                    className="flex items-center gap-1 text-slate-400 hover:text-rose-500 px-2 py-1"
                    title="Wyczyść wpis w zeszycie"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Wyczyść</span>
                  </button>
                )}

                <button
                  onClick={() => setShowAnswer(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Sprawdź z odpowiedzią</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Hint Section */}
        {task.hint && (
          <div className="pt-1">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors"
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Pokaż podpowiedź (wskazówka przed rozwiązaniem)</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs sm:text-sm text-amber-900 dark:text-amber-100 space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                    <Lightbulb className="w-4 h-4" />
                    Wskazówka dydaktyczna
                  </span>
                  <button
                    onClick={() => setShowHint(false)}
                    className="text-xs text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Ukryj
                  </button>
                </div>
                <FormattedMathText text={task.hint} className="text-amber-900 dark:text-amber-100 text-xs sm:text-sm" />
              </div>
            )}
          </div>
        )}

        {/* 5. Answer Trigger Button */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer ${
              showAnswer
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {showAnswer ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Ukryj odpowiedź</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Pokaż odpowiedź: {task.taskNumber}</span>
              </>
            )}
          </button>

          {!isWorkspaceOpen && (
            <button
              onClick={() => setIsWorkspaceOpen(true)}
              className="text-xs font-semibold text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
            >
              <PenLine className="w-3.5 h-3.5" />
              <span>Otwórz pole do pisania (jak w zeszycie ćwiczeń)</span>
            </button>
          )}
        </div>

        {/* 6. Solution & Step-by-Step Breakdown */}
        {showAnswer && (
          <div className="mt-5 pt-5 border-t border-slate-200 dark:border-slate-800 space-y-4 animate-fadeIn">
            {/* Status & Accuracy banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                {task.answerStatus === 'oficjalna' ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Oficjalny klucz wydawcy
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 px-2 py-0.5 rounded border border-sky-200 dark:border-sky-800">
                    <Award className="w-3.5 h-3.5" />
                    Rozwiązanie autorskie (zweryfikowane)
                  </span>
                )}

                {task.isOpenEnded && (
                  <span className="text-slate-500 dark:text-slate-400 italic">
                    (Przykładowa odpowiedź – dopuszczalne inne poprawne sformułowania)
                  </span>
                )}
              </div>

              <span className="text-slate-400 text-[11px]">
                Klasa {grade} · Strona {task.page}
              </span>
            </div>

            {/* Prominent High-Visibility Answer Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 dark:from-emerald-950/40 dark:via-slate-900 dark:to-sky-950/30 border-2 border-emerald-200 dark:border-emerald-800/80 shadow-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  {task.taskNumber} — {task.isOpenEnded ? 'Przykładowa odpowiedź:' : 'Dokładna odpowiedź:'}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full">
                  Sprawdzona
                </span>
              </div>

              <div className="text-sm sm:text-base font-bold text-slate-950 dark:text-white pt-1">
                <FormattedMathText text={task.answer} />
              </div>
            </div>

            {/* Comparison with student's answer if written */}
            {studentText.trim().length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <PenLine className="w-3.5 h-3.5 text-sky-600" />
                  Twoja zapisana odpowiedź do porównania:
                </span>
                <p className="font-mono text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700 whitespace-pre-wrap">
                  {studentText}
                </p>
              </div>
            )}

            {/* Step-by-Step Explanation */}
            {task.explanationSteps && task.explanationSteps.length > 0 && (
              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                  <span>Wyjaśnienie krok po kroku (jak to rozwiązać):</span>
                </h5>

                <div className="space-y-3">
                  {task.explanationSteps.map((step) => (
                    <div
                      key={step.step}
                      className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-800 text-xs sm:text-sm text-slate-800 dark:text-slate-200 space-y-1.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-900/60 text-sky-800 dark:text-sky-300 font-bold text-xs flex items-center justify-center shrink-0">
                          {step.step}
                        </span>
                        {step.title && (
                          <span className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                            {step.title}
                          </span>
                        )}
                      </div>

                      <div className="pl-7">
                        <FormattedMathText text={step.text} />
                        {step.tip && (
                          <p className="mt-2 text-xs italic text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                            Wskazówka: {step.tip}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
