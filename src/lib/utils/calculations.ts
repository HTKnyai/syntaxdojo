/**
 * Calculate Words Per Minute (WPM)
 * Formula: (characters / 5) / (time in minutes)
 */
export function calculateWPM(characterCount: number, timeSeconds: number): number {
  if (timeSeconds === 0) return 0;
  const words = characterCount / 5;
  const minutes = timeSeconds / 60;
  return Math.round(words / minutes);
}

/**
 * Calculate typing accuracy
 * Formula: (correct characters / total characters) * 100
 */
export function calculateAccuracy(
  correctCharCount: number,
  totalCharCount: number
): number {
  if (totalCharCount === 0) return 100;
  return Math.round((correctCharCount / totalCharCount) * 100);
}

/**
 * Format time in seconds to MM:SS
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
