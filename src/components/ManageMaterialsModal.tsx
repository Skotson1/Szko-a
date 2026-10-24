import React, { useState } from 'react';
import { Book, Subject, Task, MaterialType, AnswerStatus, VerificationStatus, ExplanationStep } from '../types';
import { exportDataAsJSON } from '../utils/storage';
import {
  X,
  Plus,
  BookOpen,
  FileText,
  Upload,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Sparkles,
} from 'lucide-react';

interface ManageMaterialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  books: Book[];
  subjects: Subject[];
  onSaveBook: (book: Book) => void;
  onSaveTask: (task: Task) => void;
  onImportJSON: (importedBooks: Book[], importedSubjects?: Subject[]) => void;
  onResetDemo: () => void;
  defaultBookId?: string;
  defaultPage?: number;
  editingTask?: Task | null;
}

export const ManageMaterialsModal: React.FC<ManageMaterialsModalProps> = ({
  isOpen,
  onClose,
  books,
  subjects,
  onSaveBook,
  onSaveTask,
  onImportJSON,
  onResetDemo,
  defaultBookId,
  defaultPage = 1,
  editingTask,
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'task' | 'backup'>(
    editingTask ? 'task' : 'book'
  );

  // --- Book Form State ---
  const [bookTitle, setBookTitle] = useState('');
  const [bookType, setBookType] = useState<MaterialType>('podrecznik');
  const [bookGrade, setBookGrade] = useState<number>(4);
  const [bookSubjectId, setBookSubjectId] = useState<string>(subjects[0]?.id || 'matematyka');
  const [bookPublisher, setBookPublisher] = useState('Nowa Era');
  const [bookPart, setBookPart] = useState('');
  const [bookEdition, setBookEdition] = useState('Wydanie 2024');
  const [bookIsbn, setBookIsbn] = useState('');
  const [bookMenNumber, setBookMenNumber] = useState('');
  const [bookCoverUrl, setBookCoverUrl] = useState('');
  const [bookPdfUrl, setBookPdfUrl] = useState('');
  const [bookTotalPages, setBookTotalPages] = useState<number>(120);
  const [bookLicense, setBookLicense] = useState('Materiały własne do użytku prywatnego (art. 27 pr. aut.)');

  // --- Task Form State ---
  const [taskBookId, setTaskBookId] = useState<string>(defaultBookId || books[0]?.id || '');
  const [taskPage, setTaskPage] = useState<number>(defaultPage);
  const [taskNumber, setTaskNumber] = useState(editingTask?.taskNumber || 'Zadanie 1');
  const [taskTitle, setTaskTitle] = useState(editingTask?.title || '');
  const [taskContent, setTaskContent] = useState(editingTask?.content || '');
  const [taskHint, setTaskHint] = useState(editingTask?.hint || '');
  const [taskAnswer, setTaskAnswer] = useState(editingTask?.answer || '');
  const [taskIsOpenEnded, setTaskIsOpenEnded] = useState<boolean>(editingTask?.isOpenEnded || false);
  const [taskStatus, setTaskStatus] = useState<AnswerStatus>(editingTask?.answerStatus || 'autorska');
  const [taskSteps, setTaskSteps] = useState<ExplanationStep[]>(
    editingTask?.explanationSteps || [
      { step: 1, title: 'Krok 1: Analiza polecenia i wypisanie danych', text: '' },
    ]
  );

  // Sync when defaultBookId or editingTask changes
  React.useEffect(() => {
    if (defaultBookId) {
      setTaskBookId(defaultBookId);
    }
    if (defaultPage) {
      setTaskPage(defaultPage);
    }
  }, [defaultBookId, defaultPage]);

  React.useEffect(() => {
    if (editingTask) {
      setActiveTab('task');
      setTaskBookId(editingTask.bookId);
      setTaskPage(editingTask.page);
      setTaskNumber(editingTask.taskNumber);
      setTaskTitle(editingTask.title || '');
      setTaskContent(editingTask.content);
      setTaskHint(editingTask.hint || '');
      setTaskAnswer(editingTask.answer);
      setTaskIsOpenEnded(!!editingTask.isOpenEnded);
      setTaskStatus(editingTask.answerStatus);
      setTaskSteps(editingTask.explanationSteps || []);
    }
  }, [editingTask]);

  if (!isOpen) return null;

  // Handle PDF file selection via input
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBookPdfUrl(url);
    }
  };

  // Handle Cover file selection
  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setBookCoverUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new Book
  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookTitle.trim()) return;

    const newBook: Book = {
      id: `book-${Date.now()}`,
      title: bookTitle.trim(),
      type: bookType,
      grade: bookGrade,
      subjectId: bookSubjectId,
      publisher: bookPublisher.trim(),
      part: bookPart.trim() || undefined,
      editionYear: bookEdition.trim() || 'Wydanie 2024',
      isbn: bookIsbn.trim() || undefined,
      approvalNumber: bookMenNumber.trim() || undefined,
      coverUrl: bookCoverUrl || undefined,
      pdfUrl: bookPdfUrl || undefined,
      isDemo: false,
      verificationStatus: 'weryfikacja_spolecznosci',
      licenseInfo: bookLicense,
      totalPages: bookTotalPages || 100,
      chapters: [
        {
          id: `ch-${Date.now()}-1`,
          number: 1,
          title: 'Dział 1',
          startPage: 1,
          endPage: Math.floor(bookTotalPages / 2) || 50,
        },
        {
          id: `ch-${Date.now()}-2`,
          number: 2,
          title: 'Dział 2',
          startPage: (Math.floor(bookTotalPages / 2) || 50) + 1,
          endPage: bookTotalPages || 100,
        },
      ],
      tasks: [],
      createdAt: new Date().toISOString(),
    };

    onSaveBook(newBook);
    alert('Książka została pomyślnie dodana!');
    setBookTitle('');
    onClose();
  };

  // Add step to task
  const handleAddStep = () => {
    setTaskSteps((prev) => [
      ...prev,
      {
        step: prev.length + 1,
        title: `Krok ${prev.length + 1}`,
        text: '',
      },
    ]);
  };

  // Submit Task
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskContent.trim() || !taskAnswer.trim() || !taskBookId) {
      alert('Proszę wypełnić treść zadania, odpowiedź oraz wybrać książkę.');
      return;
    }

    const newTask: Task = {
      id: editingTask?.id || `task-${Date.now()}`,
      bookId: taskBookId,
      page: taskPage,
      taskNumber: taskNumber.trim(),
      title: taskTitle.trim() || undefined,
      content: taskContent.trim(),
      hint: taskHint.trim() || undefined,
      answer: taskAnswer.trim(),
      explanationSteps: taskSteps.filter((s) => s.text.trim().length > 0),
      isOpenEnded: taskIsOpenEnded,
      answerStatus: taskStatus,
      difficulty: 'srednie',
    };

    onSaveTask(newTask);
    alert(editingTask ? 'Zadanie zostało zaktualizowane!' : 'Zadanie zostało dodane do książki!');
    onClose();
  };

  // Handle JSON Import File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed.books && Array.isArray(parsed.books)) {
          onImportJSON(parsed.books, parsed.subjects);
          alert(`Pomyślnie zaimportowano ${parsed.books.length} podręczników i zeszytów!`);
          onClose();
        } else if (Array.isArray(parsed)) {
          onImportJSON(parsed);
          alert(`Pomyślnie zaimportowano ${parsed.length} pozycji!`);
          onClose();
        } else {
          alert('Nieprawidłowy format pliku JSON. Brak tablicy "books".');
        }
      } catch (err) {
        alert('Błąd podczas odczytu pliku JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-3xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Centrum Materiałów Edukacyjnych
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Dodawaj własne podręczniki, arkusze PDF, zadania i zarządzaj bazą danych
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tab Switcher */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('book')}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
              activeTab === 'book'
                ? 'text-sky-600 dark:text-sky-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              Dodaj podręcznik / zeszyt
            </span>
            {activeTab === 'book' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('task')}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
              activeTab === 'task'
                ? 'text-sky-600 dark:text-sky-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              {editingTask ? 'Edytuj zadanie' : 'Dodaj zadanie z rozwiązaniem'}
            </span>
            {activeTab === 'task' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
              activeTab === 'backup'
                ? 'text-sky-600 dark:text-sky-400 font-bold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Upload className="w-4 h-4" />
              Kopia zapasowa / Eksport JSON
            </span>
            {activeTab === 'backup' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 dark:bg-sky-400" />
            )}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: ADD BOOK */}
          {activeTab === 'book' && (
            <form onSubmit={handleCreateBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Rodzaj materiału *
                  </label>
                  <select
                    value={bookType}
                    onChange={(e) => setBookType(e.target.value as MaterialType)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  >
                    <option value="podrecznik">Podręcznik</option>
                    <option value="zeszyt_cwiczen">Zeszyt ćwiczeń</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Klasa (1–8) *
                  </label>
                  <select
                    value={bookGrade}
                    onChange={(e) => setBookGrade(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                      <option key={g} value={g}>
                        Klasa {g}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Przedmiot *
                </label>
                <select
                  value={bookSubjectId}
                  onChange={(e) => setBookSubjectId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (klasy: {s.grades.join(', ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pełny tytuł książki *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Matematyka z plusem 7, Planeta Nowa 5"
                  value={bookTitle}
                  onChange={(e) => setBookTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Wydawnictwo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Nowa Era, WSiP, GWO"
                    value={bookPublisher}
                    onChange={(e) => setBookPublisher(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Część / Tom
                  </label>
                  <input
                    type="text"
                    placeholder="np. Część 1, Całość"
                    value={bookPart}
                    onChange={(e) => setBookPart(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Wydanie i rok *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="np. Wydanie 2024 (nowa podstawa)"
                    value={bookEdition}
                    onChange={(e) => setBookEdition(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Numer dopuszczenia MEN / MENiS
                  </label>
                  <input
                    type="text"
                    placeholder="np. 780/4/2018"
                    value={bookMenNumber}
                    onChange={(e) => setBookMenNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Łączna liczba stron
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={1000}
                    value={bookTotalPages}
                    onChange={(e) => setBookTotalPages(parseInt(e.target.value, 10) || 100)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Plik PDF lub link (opcjonalnie)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="Wklej link do pliku PDF..."
                    value={bookPdfUrl}
                    onChange={(e) => setBookPdfUrl(e.target.value)}
                    className="w-full sm:flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  />
                  <label className="cursor-pointer px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 whitespace-nowrap">
                    Wgraj plik z dysku
                    <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                >
                  Zapisz podręcznik w bibliotece
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ADD/EDIT TASK */}
          {activeTab === 'task' && (
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Wybierz książkę *
                  </label>
                  <select
                    value={taskBookId}
                    onChange={(e) => setTaskBookId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                  >
                    {books.map((b) => (
                      <option key={b.id} value={b.id}>
                        [Klasa {b.grade}] {b.title} ({b.editionYear})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Strona *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={1000}
                      value={taskPage}
                      onChange={(e) => setTaskPage(parseInt(e.target.value, 10))}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Numer zadania *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="np. Zadanie 3, Ćw. 2 b)"
                      value={taskNumber}
                      onChange={(e) => setTaskNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tytuł / Temat zadania (opcjonalnie)
                </label>
                <input
                  type="text"
                  placeholder="np. Obliczanie obwodu trójkąta, Środki stylistyczne"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Treść zadania *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Wpisz treść zadania z podręcznika lub zeszytu ćwiczeń..."
                  value={taskContent}
                  onChange={(e) => setTaskContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Wskazówka / Podpowiedź (widoczna przed odkryciem odpowiedzi)
                </label>
                <input
                  type="text"
                  placeholder="Wskazówka pomocnicza dla ucznia..."
                  value={taskHint}
                  onChange={(e) => setTaskHint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pełna odpowiedź *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Wpisz wynik lub pełną odpowiedź końcową..."
                  value={taskAnswer}
                  onChange={(e) => setTaskAnswer(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={taskIsOpenEnded}
                    onChange={(e) => setTaskIsOpenEnded(e.target.checked)}
                    className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span>Zadanie otwarte („Przykładowa odpowiedź”)</span>
                </label>

                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Status:</span>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as AnswerStatus)}
                    className="px-2 py-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                  >
                    <option value="autorska">Rozwiązanie autorskie dydaktyczne</option>
                    <option value="oficjalna">Oficjalny klucz wydawcy</option>
                  </select>
                </div>
              </div>

              {/* Step-by-Step Explanation Editor */}
              <div className="pt-3 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                    Wyjaśnienie krok po kroku ({taskSteps.length} kroków)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddStep}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Dodaj kolejny krok
                  </button>
                </div>

                <div className="space-y-3">
                  {taskSteps.map((step, idx) => (
                    <div
                      key={step.step}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          placeholder={`Tytuł kroku ${idx + 1}`}
                          value={step.title || ''}
                          onChange={(e) => {
                            const updated = [...taskSteps];
                            updated[idx].title = e.target.value;
                            setTaskSteps(updated);
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 w-full"
                        />
                        {taskSteps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              setTaskSteps(taskSteps.filter((_, i) => i !== idx));
                            }}
                            className="text-slate-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <textarea
                        rows={2}
                        placeholder="Wyjaśnienie tego etapu..."
                        value={step.text}
                        onChange={(e) => {
                          const updated = [...taskSteps];
                          updated[idx].text = e.target.value;
                          setTaskSteps(updated);
                        }}
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xs"
                >
                  {editingTask ? 'Zapisz zmiany w zadaniu' : 'Dodaj zadanie do bazy'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: BACKUP / JSON IMPORT & EXPORT */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs sm:text-sm text-sky-900 dark:text-sky-200 space-y-2">
                <div className="font-bold flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  Struktura danych gotowa pod zewnętrzną bazę
                </div>
                <p className="leading-relaxed">
                  Aplikacja przechowuje dane w formacie zgodnym z backendem Firestore / SQL. Możesz pobrać całą bazę w
                  jednym pliku JSON, edytować ją, wgrać z powrotem lub zresetować do autorskich materiałów demonstracyjnych.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Export Card */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>Eksport bazy do JSON</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Pobierz kopię zapasową wszystkich {books.length} książek, zadań i przedmiotów.
                  </p>
                  <button
                    onClick={() => exportDataAsJSON(books, subjects)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Pobierz plik JSON</span>
                  </button>
                </div>

                {/* Import Card */}
                <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                    <Upload className="w-4 h-4 text-sky-600" />
                    <span>Import bazy z JSON</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Wgraj wcześniej zapisany plik JSON, aby przywrócić książki lub dodać pakiet materiałów.
                  </p>
                  <label className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors cursor-pointer text-center">
                    <Upload className="w-4 h-4" />
                    <span>Wybierz plik JSON</span>
                    <input type="file" accept=".json,application/json" onChange={handleImportFile} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Reset to Demo Data */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    Przywróć stan początkowy
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Przywraca fabryczne wzorcowe materiały demonstracyjne dla wszystkich klas 1–8.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Czy na pewno chcesz zresetować bazę do domyślnych materiałów demonstracyjnych?')) {
                      onResetDemo();
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Resetuj do demo</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
