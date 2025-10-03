import { Problem } from '@/types/problem';

interface ProblemDisplayProps {
  problem: Problem;
  currentInput: string;
  incorrectIndices: number[];
}

export function ProblemDisplay({ problem, currentInput, incorrectIndices }: ProblemDisplayProps) {
  return (
    <div className="space-y-4">
      {/* Problem Info */}
      <div className="flex items-center justify-between">
        <div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            {problem.category}
          </span>
          <span className="ml-2 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
            {problem.difficulty === 'beginner' && '初級'}
            {problem.difficulty === 'intermediate' && '中級'}
            {problem.difficulty === 'advanced' && '上級'}
          </span>
        </div>
      </div>

      {/* Code Display with Real-time Feedback */}
      <div className="rounded-lg bg-gray-900 p-6">
        <pre className="font-mono text-2xl leading-relaxed">
          {problem.code.split('').map((char, index) => {
            let className = 'text-gray-400';

            if (index < currentInput.length) {
              if (incorrectIndices.includes(index)) {
                className = 'bg-red-500 text-white'; // Incorrect
              } else {
                className = 'text-green-400'; // Correct
              }
            } else if (index === currentInput.length) {
              className = 'text-gray-400 bg-gray-700'; // Current cursor position
            }

            return (
              <span key={index} className={className}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            );
          })}
        </pre>
      </div>

      {/* Explanation */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h3 className="mb-2 font-semibold text-gray-900">解説</h3>
        <p className="text-sm text-gray-600">{problem.explanation}</p>
      </div>
    </div>
  );
}
