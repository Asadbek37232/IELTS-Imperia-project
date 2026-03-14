import { ClientVocabQuestion, SubmitAnswer } from '../../types';

interface Props {
  question: ClientVocabQuestion;
  selectedAnswer: string;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: SubmitAnswer) => void;
}

export default function VocabularyQuestion({ question, selectedAnswer, questionIndex, totalQuestions, onAnswer }: Props) {
  const labels = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-5 animate-slide-up">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
          Question {questionIndex + 1} of {totalQuestions}
        </span>
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-bold">
          Vocabulary
        </span>
      </div>

      {question.audio_path && (
        <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-2xl p-4">
          <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-2 flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" /></svg>
            Listen carefully
          </p>
          <audio controls className="w-full h-9" src={question.audio_path} />
        </div>
      )}

      {question.image_path && (
        <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img src={question.image_path} alt="Question visual" className="w-full max-h-56 object-contain bg-gray-50 dark:bg-gray-800" />
        </div>
      )}

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/60 dark:to-gray-900/60 rounded-2xl p-5 border border-gray-200/60 dark:border-gray-700/60">
        <p className="text-lg font-semibold text-gray-900 dark:text-white leading-relaxed">{question.question}</p>
      </div>

      <div className="space-y-2.5">
        {question.options.map((opt, idx) => {
          const isSelected = selectedAnswer === opt.key;
          return (
            <button key={opt.key} onClick={() => onAnswer({ questionId: question.id, questionType: 'VOCABULARY', selectedAnswer: opt.key, questionText: question.question })}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-150 active:scale-[0.99]
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 shadow-lg shadow-blue-500/10'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
            >
              <span className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 transition-all
                ${isSelected ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                {labels[idx]}
              </span>
              <span className={`font-medium text-sm leading-relaxed ${isSelected ? 'text-blue-900 dark:text-blue-100' : 'text-gray-800 dark:text-gray-200'}`}>
                {opt.value}
              </span>
              {isSelected && (
                <span className="ml-auto flex-shrink-0 text-blue-500">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}