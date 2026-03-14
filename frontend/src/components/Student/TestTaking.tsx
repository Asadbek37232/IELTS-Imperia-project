import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTest } from '../../context/TestContext';
import { useAntiCheat } from '../../hooks/useAntiCheat';
import { studentApi } from '../../services/api';
import { connectSocket } from '../../services/socketClient';
import Timer from '../Common/Timer';
import VocabularyQuestion from './VocabularyQuestion';
import GrammarQuestion from './GrammarQuestion';
import { ClientVocabQuestion, ClientGrammarQuestion, SubmitAnswer } from '../../types';

export default function TestTaking() {
  const { testSessionId, currentSection, title, sections, setAnswer, answers, getAllAnswers, goToNextSection } = useTest();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [currentVocabIdx, setCurrentVocabIdx] = useState(0);

  useAntiCheat(testSessionId, true);

  useEffect(() => {
    if (!testSessionId) return;
    const socket = connectSocket();
    socket.emit('join_test_room', testSessionId);
    const interval = setInterval(() => socket.emit('heartbeat', { testSessionId }), 15000);
    return () => clearInterval(interval);
  }, [testSessionId]);

  const handleAnswer = useCallback((answer: SubmitAnswer) => {
    setAnswer(answer.questionId, answer);
  }, [setAnswer]);

  const submitSection = useCallback(async () => {
    if (!testSessionId || submitting) return;
    setSubmitting(true);
    try {
      const ord = currentSection?.sectionOrder ?? 1;
      const hasNext = sections.some(s => s.sectionOrder === ord + 1);
      if (hasNext) {
        const res = await studentApi.advanceSection(testSessionId);
        goToNextSection(res.data.data);
        setCurrentVocabIdx(0);
      } else {
        await studentApi.submitTest(testSessionId, getAllAnswers());
        goToNextSection(null);
        navigate('/student/results');
      }
    } catch {
      goToNextSection(null);
      navigate('/student/results');
    } finally {
      setSubmitting(false);
    }
  }, [testSessionId, submitting, currentSection, sections, getAllAnswers, goToNextSection, navigate]);

  if (!currentSection || !testSessionId) { navigate('/student'); return null; }

  const isVocab = currentSection.sectionType === 'VOCABULARY';
  const vocabQs = isVocab ? (currentSection.questions as ClientVocabQuestion[]) : [];
  const grammarPs = !isVocab ? (currentSection.questions as ClientGrammarQuestion[]) : [];
  const allIds = isVocab
    ? vocabQs.map(q => q.id)
    : grammarPs.flatMap(pp => pp.questions.map(sq => sq.id));
  const answered = allIds.filter(id => answers[id]).length;
  const total = allIds.length;
  const progress = total > 0 ? (answered / total) * 100 : 0;

  const grammarAns: Record<string, string> = {};
  Object.values(answers).forEach(a => {
    if (a.questionType === 'GRAMMAR') grammarAns[a.questionId] = a.selectedAnswer;
  });
  const isLast = !sections.some(s => s.sectionOrder === (currentSection.sectionOrder ?? 1) + 1);

  const sectionBadge = isVocab
    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
    : 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-bold text-gray-900 dark:text-white text-sm">{title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sectionBadge}`}>
                  {currentSection.sectionType}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {answered}/{total} answered
                </span>
              </div>
            </div>
            <Timer deadline={currentSection.deadline} onExpire={submitSection} />
          </div>
          <div className="mt-2.5 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isVocab ? 'bg-blue-500' : 'bg-indigo-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Vocabulary */}
        {isVocab && vocabQs.length > 0 && (
          <>
            <VocabularyQuestion
              key={vocabQs[currentVocabIdx].id}
              question={vocabQs[currentVocabIdx]}
              selectedAnswer={answers[vocabQs[currentVocabIdx].id]?.selectedAnswer || ''}
              questionIndex={currentVocabIdx}
              totalQuestions={vocabQs.length}
              onAnswer={handleAnswer}
            />

            {/* Question dots */}
            <div className="flex justify-center gap-1.5 flex-wrap">
              {vocabQs.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentVocabIdx(i)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all
                    ${i === currentVocabIdx
                      ? 'bg-blue-600 text-white shadow-md'
                      : answers[q.id]
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Nav buttons */}
            <div className="flex justify-between items-center gap-3">
              <button
                onClick={() => setCurrentVocabIdx(i => Math.max(0, i - 1))}
                disabled={currentVocabIdx === 0}
                className="px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 text-sm font-medium transition-all"
              >
                ← Prev
              </button>
              {currentVocabIdx < vocabQs.length - 1 ? (
                <button
                  onClick={() => setCurrentVocabIdx(i => Math.min(vocabQs.length - 1, i + 1))}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 text-sm shadow-lg shadow-blue-500/20 transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={submitSection}
                  disabled={submitting}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 disabled:opacity-50 text-sm shadow-lg shadow-emerald-500/20 transition-all"
                >
                  {submitting ? 'Saving...' : isLast ? 'Submit Test ✓' : 'Next Section →'}
                </button>
              )}
            </div>
          </>
        )}

        {/* Grammar */}
        {!isVocab && grammarPs.map((pp, i) => (
          <GrammarQuestion
            key={pp.id}
            passage={pp}
            answers={grammarAns}
            onAnswer={handleAnswer}
            passageIndex={i}
            totalPassages={grammarPs.length}
          />
        ))}
        {!isVocab && (
          <button
            onClick={submitSection}
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl font-bold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-sm shadow-xl shadow-emerald-500/20 transition-all"
          >
            {submitting ? 'Saving...' : isLast ? 'Submit Test ✓' : 'Finish Section →'}
          </button>
        )}
      </div>
    </div>
  );
}
