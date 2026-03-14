import { ClientGrammarQuestion, ClientGrammarSubQuestion, SubmitAnswer } from '../../types';

interface Props {
  passage: ClientGrammarQuestion;
  answers: Record<string, string>;
  onAnswer: (answer: SubmitAnswer) => void;
  passageIndex: number;
  totalPassages: number;
}

export default function GrammarQuestion({ passage, answers, onAnswer, passageIndex, totalPassages }: Props) {
  const subType = passage.subType;

  // ── Left panel: passage text ─────────────────────────────────────────────────
  const renderPassage = () => {
    const text = passage.passage;

    if (subType !== 'gap_fill_input') {
      return (
        <p className="text-gray-800 dark:text-gray-200 leading-8 text-[15px] whitespace-pre-wrap">
          {text}
        </p>
      );
    }

    // gap_fill_input: replace ___N___ with inline number + input
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    passage.questions.forEach(sq => {
      const pattern = `___${sq.blank}___`;
      const idx = text.indexOf(pattern, lastIndex);
      if (idx === -1) return;

      if (idx > lastIndex) {
        parts.push(<span key={`t-${sq.blank}`}>{text.slice(lastIndex, idx)}</span>);
      }

      const val = answers[sq.id] || '';
      parts.push(
        <span key={`inp-${sq.blank}`} className="inline-flex items-baseline gap-0.5 mx-1">
          <span className="text-indigo-600 dark:text-indigo-400 font-bold text-xs select-none">
            {sq.questionNumber}.
          </span>
          <input
            type="text"
            value={val}
            onChange={e => onAnswer({
              questionId: sq.id,
              questionType: 'GRAMMAR',
              selectedAnswer: e.target.value,
              questionText: `Blank ${sq.blank}`,
            })}
            className={`border-b-2 bg-transparent text-sm font-medium px-1 w-24 focus:outline-none transition-colors
              ${val
                ? 'border-indigo-500 text-indigo-800 dark:text-indigo-200'
                : 'border-gray-400 dark:border-gray-500 text-gray-700 dark:text-gray-300'
              } focus:border-indigo-600 dark:focus:border-indigo-400`}
            placeholder="_ _ _ _"
          />
        </span>
      );

      lastIndex = idx + pattern.length;
    });

    parts.push(<span key="end">{text.slice(lastIndex)}</span>);
    return parts;
  };

  // ── Right panel: questions based on subType ──────────────────────────────────
  const renderQuestions = () => {
    if (subType === 'gap_fill_input') {
      return (
        <div className="space-y-3">
          <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
            Blanks answered
          </p>
          {passage.questions.map((sq: ClientGrammarSubQuestion) => {
            const val = answers[sq.id] || '';
            return (
              <div key={sq.id} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-black flex items-center justify-center flex-shrink-0">
                  {sq.questionNumber}
                </span>
                {val ? (
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 italic">
                    "{val}"
                  </span>
                ) : (
                  <span className="text-sm text-gray-400 dark:text-gray-600 italic">not answered</span>
                )}
              </div>
            );
          })}
        </div>
      );
    }

    if (subType === 'multiple_choice') {
      return (
        <div className="space-y-5">
          {passage.questions.map((sq: ClientGrammarSubQuestion) => {
            const chosen = answers[sq.id];
            return (
              <div key={sq.id} className="space-y-2.5">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
                  <span className="text-indigo-500 dark:text-indigo-400 font-black mr-1.5">{sq.questionNumber}.</span>
                  {sq.question}
                </p>
                <div className="space-y-2">
                  {sq.options.map(opt => {
                    const sel = chosen === opt.key;
                    return (
                      <label
                        key={opt.key}
                        className={`flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all
                          ${sel
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                          }`}
                      >
                        <input
                          type="radio"
                          name={sq.id}
                          value={opt.key}
                          checked={sel}
                          onChange={() => onAnswer({
                            questionId: sq.id,
                            questionType: 'GRAMMAR',
                            selectedAnswer: opt.key,
                            questionText: sq.question,
                          })}
                          className="sr-only"
                        />
                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 text-xs font-black transition-all
                          ${sel
                            ? 'border-indigo-500 bg-indigo-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                          }`}>
                          {opt.key}
                        </span>
                        <span className={`text-sm leading-snug ${sel ? 'text-indigo-900 dark:text-indigo-100 font-medium' : 'text-gray-700 dark:text-gray-300'}`}>
                          {opt.value}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // heading_match
    const headings = passage.availableHeadings ?? [];
    return (
      <div className="space-y-4">
        {passage.questions.map((sq: ClientGrammarSubQuestion) => {
          const chosen = answers[sq.id] || '';
          return (
            <div key={sq.id} className="space-y-1.5">
              <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">
                <span className="text-indigo-500 dark:text-indigo-400 font-black mr-1.5">{sq.questionNumber}.</span>
                {sq.question}
              </p>
              <select
                value={chosen}
                onChange={e => onAnswer({
                  questionId: sq.id,
                  questionType: 'GRAMMAR',
                  selectedAnswer: e.target.value,
                  questionText: sq.question,
                })}
                className={`w-full border rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer
                  ${chosen
                    ? 'border-indigo-400 dark:border-indigo-600 text-gray-800 dark:text-gray-200'
                    : 'border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-500'
                  }`}
              >
                <option value="" disabled>-- Select --</option>
                {headings.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    );
  };

  // ── Sub-type badge ───────────────────────────────────────────────────────────
  const badgeLabel =
    subType === 'gap_fill_input' ? 'Gap Fill'
    : subType === 'multiple_choice' ? 'Multiple Choice'
    : 'True / False / Not Given';

  const answeredCount = passage.questions.filter(sq => answers[sq.id]?.trim()).length;
  const total = passage.questions.length;

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/80">
        <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
          Exercise {passageIndex + 1} of {totalPassages}
        </span>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-bold">
            {badgeLabel}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            {answeredCount}/{total}
          </span>
        </div>
      </div>

      {/* Two-panel body */}
      <div className="flex" style={{ minHeight: '420px', maxHeight: '620px' }}>
        {/* Left: passage */}
        <div className="w-[55%] overflow-y-auto p-5 bg-slate-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800">
          {passage.audio_path && (
            <div className="mb-4">
              <audio controls className="w-full h-9" src={passage.audio_path} />
            </div>
          )}
          {passage.image_path && (
            <div className="mb-4 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={passage.image_path} alt="" className="w-full max-h-48 object-contain bg-gray-50 dark:bg-gray-800" />
            </div>
          )}
          <p className="text-[11px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-3">
            Passage
          </p>
          <div className="text-gray-800 dark:text-gray-200 leading-8 text-[15px]">
            {renderPassage()}
          </div>
        </div>

        {/* Right: questions */}
        <div className="w-[45%] overflow-y-auto p-5 bg-white dark:bg-gray-900">
          <p className="text-[11px] font-bold text-indigo-400 dark:text-indigo-500 uppercase tracking-widest mb-4">
            {subType === 'gap_fill_input' ? 'Your Answers' : 'Questions'}
          </p>
          {renderQuestions()}
        </div>
      </div>
    </div>
  );
}
