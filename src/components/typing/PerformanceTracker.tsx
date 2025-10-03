interface PerformanceTrackerProps {
  currentProblemIndex: number;
  totalProblems: number;
  progress: number;
}

export function PerformanceTracker({
  currentProblemIndex,
  totalProblems,
  progress,
}: PerformanceTrackerProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          問題 {currentProblemIndex + 1} / {totalProblems}
        </span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full bg-blue-600 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
