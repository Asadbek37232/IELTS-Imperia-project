import { useState } from 'react';
import { adminApi } from '../../services/api';
import { SectionType } from '../../types';

interface SectionForm {
  sectionType: SectionType;
  numberOfQuestions: number;
  timeAllocated: number;
  sectionOrder: number;
}

interface Props { onSuccess: () => void; }

export default function CreateTest({ onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [sections, setSections] = useState<SectionForm[]>([
    { sectionType: 'VOCABULARY', numberOfQuestions: 10, timeAllocated: 15, sectionOrder: 1 },
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdPin, setCreatedPin] = useState('');

  const addSection = () => {
    const nextOrder = sections.length + 1;
    const usedTypes = sections.map(s => s.sectionType);
    const available = (['VOCABULARY', 'GRAMMAR'] as SectionType[]).filter(t => !usedTypes.includes(t));
    if (available.length === 0) return;
    setSections(prev => [...prev, {
      sectionType: available[0],
      numberOfQuestions: 10,
      timeAllocated: 20,
      sectionOrder: nextOrder,
    }]);
  };

  const removeSection = (idx: number) => {
    setSections(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, sectionOrder: i + 1 })));
  };

  const updateSection = (idx: number, field: keyof SectionForm, value: string | number) => {
    setSections(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await adminApi.createTest({ title, sections });
      setCreatedPin(res.data.data.pinCode);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  if (createdPin) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <p className="text-xl font-bold text-gray-900">Test Created!</p>
          <p className="text-gray-500 mt-1">Share this PIN with students:</p>
        </div>
        <div className="bg-blue-50 border-2 border-blue-300 rounded-2xl p-6">
          <p className="text-5xl font-mono font-bold text-blue-700 tracking-widest">{createdPin}</p>
        </div>
        <button onClick={onSuccess}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
          Done
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Test Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
          placeholder="e.g. IELTS Mock Test #1" required />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Sections</label>
          {sections.length < 2 && (
            <button type="button" onClick={addSection}
              className="text-sm text-blue-600 hover:underline font-medium">+ Add Section</button>
          )}
        </div>

        {sections.map((section, idx) => (
          <div key={idx} className="bg-gray-50 rounded-xl p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm text-gray-700">Section {section.sectionOrder}</span>
              {sections.length > 1 && (
                <button type="button" onClick={() => removeSection(idx)}
                  className="text-red-500 hover:text-red-700 text-sm">Remove</button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Type</label>
                <select value={section.sectionType}
                  onChange={e => updateSection(idx, 'sectionType', e.target.value as SectionType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                  <option value="VOCABULARY">Vocabulary</option>
                  <option value="GRAMMAR">Grammar</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Questions</label>
                <input type="number" min={1} max={100} value={section.numberOfQuestions}
                  onChange={e => updateSection(idx, 'numberOfQuestions', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Time (min)</label>
                <input type="number" min={1} max={180} value={section.timeAllocated}
                  onChange={e => updateSection(idx, 'timeAllocated', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" disabled={loading}
        className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors">
        {loading ? 'Creating...' : 'Create Test & Generate PIN'}
      </button>
    </form>
  );
}
