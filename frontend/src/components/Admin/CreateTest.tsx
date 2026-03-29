import { useState } from 'react';
import { adminApi } from '../../services/api';
import { SectionSubject, SectionType, VARIANT_GROUPS, VARIANT_GROUP_LABELS, VariantGroup } from '../../types';

interface SectionForm {
  subject: SectionSubject;
  sectionType: SectionType;
  variantGroups: string[];
  numberOfExercises: number;
  timeAllocated: number;
  sectionOrder: number;
}

interface Props { onSuccess: () => void; }

export default function CreateTest({ onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [sections, setSections] = useState<SectionForm[]>([
    { subject: 'GRAMMAR', sectionType: 'EXERCISE', variantGroups: ['1_5'], numberOfExercises: 3, timeAllocated: 20, sectionOrder: 1 },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdPin, setCreatedPin] = useState('');

  const addSection = () => {
    const nextOrder = sections.length + 1;
    setSections(prev => [...prev, {
      subject: 'GRAMMAR', sectionType: 'EXERCISE',
      variantGroups: ['1_5'], numberOfExercises: 3, timeAllocated: 20, sectionOrder: nextOrder,
    }]);
  };

  const removeSection = (idx: number) => {
    setSections(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sectionOrder: i + 1 })));
  };

  const updateSection = (idx: number, field: keyof SectionForm, value: unknown) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const toggleVariantGroup = (idx: number, group: string) => {
    setSections(prev => prev.map((s, i) => {
      if (i !== idx) return s;
      const groups = s.variantGroups.includes(group)
        ? s.variantGroups.filter(g => g !== group)
        : [...s.variantGroups, group];
      return { ...s, variantGroups: groups.length > 0 ? groups : s.variantGroups };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.createTest({
        title, maxAttempts,
        sections: sections.map(s => ({
          subject: s.subject, sectionType: s.sectionType,
          variantGroups: s.variantGroups, numberOfExercises: s.numberOfExercises,
          timeAllocated: s.timeAllocated, sectionOrder: s.sectionOrder,
        })),
      });
      setCreatedPin(res.data.data.pinCode);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || "Test yaratishda xatolik");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──────────────────────────────────────────────────────────
  if (createdPin) {
    return (
      <div className="flex flex-col items-center gap-6 py-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">Test yaratildi</p>
          <p className="text-sm text-gray-400 mt-0.5">PIN kodni o'quvchilarga ulashing</p>
        </div>
        <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-2xl py-6 border border-gray-100 dark:border-gray-700">
          <p className="text-5xl font-mono font-black tracking-[0.25em] text-gray-900 dark:text-white">{createdPin}</p>
        </div>
        <button onClick={onSuccess} className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
          Tayyor
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2.5 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 text-red-600 dark:text-red-400 px-3.5 py-2.5 rounded-xl text-sm">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      {/* Row 1: Title + Max attempts */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wide">Test nomi</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Vocabulary — Unit 1–5"
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 outline-none focus:border-blue-400 dark:focus:border-blue-500 focus:ring-0 transition"
          />
        </div>
        <div className="w-24 flex-shrink-0">
          <label className="block text-xs font-semibold text-gray-400 dark:text-gray-500 mb-1.5 uppercase tracking-wide">Urinish</label>
          <input
            type="number" min={1} max={100} value={maxAttempts}
            onChange={e => setMaxAttempts(parseInt(e.target.value) || 1)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-900 dark:text-white outline-none focus:border-blue-400 dark:focus:border-blue-500 transition text-center"
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
            Bo'limlar
          </label>
          <button type="button" onClick={addSection}
            className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Qo'shish
          </button>
        </div>

        {sections.map((sec, idx) => (
          <SectionCard
            key={idx}
            section={sec}
            idx={idx}
            canRemove={sections.length > 1}
            onRemove={() => removeSection(idx)}
            onUpdate={(field, value) => updateSection(idx, field, value)}
            onToggleVariant={group => toggleVariantGroup(idx, group)}
            onSelectAll={() => setSections(prev => prev.map((s, i) => i === idx ? { ...s, variantGroups: [...VARIANT_GROUPS] } : s))}
          />
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold text-sm hover:opacity-90 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
      >
        {loading ? (
          <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>Yaratilmoqda...</>
        ) : 'Test yaratish va PIN olish'}
      </button>
    </form>
  );
}

// ── Section Card ──────────────────────────────────────────────────────────────

interface SectionCardProps {
  section: SectionForm;
  idx: number;
  canRemove: boolean;
  onRemove: () => void;
  onUpdate: (field: keyof SectionForm, value: unknown) => void;
  onToggleVariant: (group: string) => void;
  onSelectAll: () => void;
}

function SectionCard({ section, idx, canRemove, onRemove, onUpdate, onToggleVariant, onSelectAll }: SectionCardProps) {
  const isExercise = section.sectionType === 'EXERCISE';
  const isVocab = section.subject === 'VOCABULARY';

  const inputCls = "w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-400 dark:focus:border-blue-500 transition";

  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Card header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/60 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-gray-300 dark:text-gray-600 tabular-nums">
            {String(idx + 1).padStart(2, '0')}
          </span>
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full ${isVocab ? 'bg-blue-400' : 'bg-indigo-400'}`} />
            <span className="text-xs font-bold text-gray-600 dark:text-gray-400">
              {isVocab ? 'Vocabulary' : 'Grammar'} · {isExercise ? 'Mashq' : 'Practice Test'}
            </span>
          </div>
        </div>
        {canRemove && (
          <button type="button" onClick={onRemove}
            className="text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-4 bg-white dark:bg-gray-900 space-y-4">

        {/* Type toggle */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-50 dark:bg-gray-800 rounded-xl">
          {([['EXERCISE', 'Mashq'], ['PRACTICE_TEST', 'Practice Test']] as const).map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => onUpdate('sectionType', val)}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                section.sectionType === val
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Subject / Count / Time */}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Fan</p>
            <select
              value={section.subject}
              onChange={e => onUpdate('subject', e.target.value)}
              className={inputCls}
            >
              <option value="GRAMMAR">Grammar</option>
              <option value="VOCABULARY">Vocabulary</option>
            </select>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
              {isExercise ? 'Mashqlar' : 'Savollar'}
            </p>
            <input
              type="number" min={1} max={200}
              value={section.numberOfExercises}
              onChange={e => onUpdate('numberOfExercises', parseInt(e.target.value) || 1)}
              className={`${inputCls} text-center font-bold`}
            />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">Vaqt (min)</p>
            <input
              type="number" min={1} max={180}
              value={section.timeAllocated}
              onChange={e => onUpdate('timeAllocated', parseInt(e.target.value) || 1)}
              className={`${inputCls} text-center font-bold`}
            />
          </div>
        </div>

        {/* Variant groups */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Variantlar</p>
            <button type="button" onClick={onSelectAll}
              className="text-[10px] font-bold text-blue-400 hover:text-blue-500 uppercase tracking-wide transition-colors">
              Barchasi
            </button>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {VARIANT_GROUPS.map(group => {
              const selected = section.variantGroups.includes(group);
              return (
                <button
                  key={group}
                  type="button"
                  onClick={() => onToggleVariant(group)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                    selected
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  {VARIANT_GROUP_LABELS[group as VariantGroup]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
