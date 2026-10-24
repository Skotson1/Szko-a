import React, { useState } from 'react';
import { Subject } from '../types';
import { SubjectIcon } from './SubjectIcon';
import { X, Plus, Trash2, Edit3, Check, RotateCcw } from 'lucide-react';

interface SubjectEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  grade: number;
  subjects: Subject[];
  onSaveSubjects: (updatedSubjects: Subject[]) => void;
  onResetSubjects: () => void;
}

const AVAILABLE_ICONS = [
  'BookOpenText',
  'Calculator',
  'Divide',
  'BookMarked',
  'Languages',
  'Globe',
  'MessageSquare',
  'Landmark',
  'Leaf',
  'Dna',
  'Compass',
  'Atom',
  'FlaskConical',
  'Monitor',
  'Laptop',
  'Wrench',
  'Palette',
  'Music',
  'Users',
  'ShieldAlert',
  'HeartPulse',
  'Award',
];

export const SubjectEditorModal: React.FC<SubjectEditorModalProps> = ({
  isOpen,
  onClose,
  grade,
  subjects,
  onSaveSubjects,
  onResetSubjects,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState<string>('');
  const [newIcon, setNewIcon] = useState<string>('BookMarked');
  const [newCategory, setNewCategory] = useState<Subject['category']>('scisle');
  const [newDesc, setNewDesc] = useState<string>('');

  if (!isOpen) return null;

  const gradeSubjects = subjects.filter((s) => s.grades.includes(grade));

  // Add new custom subject for this grade
  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSubject: Subject = {
      id: `subj-${Date.now()}`,
      name: newName.trim(),
      iconName: newIcon,
      grades: [grade],
      category: newCategory,
      description: newDesc.trim() || undefined,
      isCustom: true,
    };

    onSaveSubjects([...subjects, newSubject]);
    setNewName('');
    setNewDesc('');
  };

  // Remove grade from subject or delete custom subject
  const handleDelete = (subjectId: string) => {
    const target = subjects.find((s) => s.id === subjectId);
    if (!target) return;

    if (target.isCustom && target.grades.length <= 1) {
      onSaveSubjects(subjects.filter((s) => s.id !== subjectId));
    } else {
      // Remove current grade from subject's grades
      const updated = subjects.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            grades: s.grades.filter((g) => g !== grade),
          };
        }
        return s;
      });
      onSaveSubjects(updated);
    }
  };

  // Update existing subject name/desc
  const handleUpdateSubject = (subjectId: string, updatedName: string) => {
    if (!updatedName.trim()) return;
    const updated = subjects.map((s) => {
      if (s.id === subjectId) {
        return {
          ...s,
          name: updatedName.trim(),
        };
      }
      return s;
    });
    onSaveSubjects(updated);
    setEditingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl overflow-hidden my-8 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Edycja przedmiotów dla Klasy {grade}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Możesz zmieniać nazwy, usuwać lub dodawać nowe przedmioty
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Add New Subject Form */}
          <form onSubmit={handleAddSubject} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Dodaj nowy przedmiot do Klasy {grade}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Nazwa przedmiotu *
                </label>
                <input
                  type="text"
                  required
                  placeholder="np. Język hiszpański, Filozofia"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  Kategoria
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Subject['category'])}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium"
                >
                  <option value="scisle">Nauki ścisłe</option>
                  <option value="humanistyczne">Humanistyczne</option>
                  <option value="przyrodnicze">Przyrodnicze</option>
                  <option value="jezyki">Języki obce</option>
                  <option value="artystyczne_praktyczne">Artystyczne / Praktyczne</option>
                  <option value="wczesnoszkolne">Wczesnoszkolne</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Wybierz ikonę
              </label>
              <div className="flex items-center gap-1.5 flex-wrap p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 max-h-24 overflow-y-auto">
                {AVAILABLE_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setNewIcon(icon)}
                    className={`p-1.5 rounded-md transition-colors ${
                      newIcon === icon
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <SubjectIcon name={icon} className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Dodaj do klasy {grade}</span>
              </button>
            </div>
          </form>

          {/* Current Subjects List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Przedmioty aktywne w Klasie {grade} ({gradeSubjects.length})
            </h4>

            <div className="space-y-2">
              {gradeSubjects.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 flex items-center justify-center shrink-0">
                      <SubjectIcon name={sub.iconName} className="w-4 h-4" />
                    </div>

                    {editingId === sub.id ? (
                      <input
                        type="text"
                        defaultValue={sub.name}
                        onBlur={(e) => handleUpdateSubject(sub.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleUpdateSubject(sub.id, (e.target as HTMLInputElement).value);
                          }
                        }}
                        autoFocus
                        className="px-2 py-1 text-xs font-bold rounded border border-sky-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      />
                    ) : (
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                          {sub.name}
                        </span>
                        {sub.isCustom && (
                          <span className="text-[10px] text-emerald-600 font-semibold">
                            Własny
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingId(editingId === sub.id ? null : sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                      title="Zmień nazwę"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                      title="Usuń z tej klasy"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('Czy na pewno chcesz przywrócić domyślną listę przedmiotów?')) {
                onResetSubjects();
              }
            }}
            className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Przywróć domyślne przedmioty</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 dark:bg-white text-white dark:text-slate-900"
          >
            Gotowe
          </button>
        </div>
      </div>
    </div>
  );
};
