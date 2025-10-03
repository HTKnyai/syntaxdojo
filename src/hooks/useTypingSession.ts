import { useReducer, useEffect, useCallback } from 'react';
import { Problem } from '@/types/problem';
import { ProblemResult, TypingSessionStatus } from '@/types/session';
import { calculateWPM, calculateAccuracy } from '@/lib/utils/calculations';

interface TypingSessionState {
  problems: Problem[];
  currentProblemIndex: number;
  currentInput: string;
  startTime: number | null;
  problemStartTime: number | null;
  results: ProblemResult[];
  status: TypingSessionStatus;
  incorrectIndices: number[];
}

type TypingSessionAction =
  | { type: 'START_SESSION'; problems: Problem[] }
  | { type: 'KEY_PRESSED'; key: string }
  | { type: 'BACKSPACE' }
  | { type: 'PROBLEM_COMPLETED' }
  | { type: 'SESSION_COMPLETED' }
  | { type: 'RESET' };

function typingSessionReducer(
  state: TypingSessionState,
  action: TypingSessionAction
): TypingSessionState {
  switch (action.type) {
    case 'START_SESSION':
      return {
        ...state,
        problems: action.problems,
        currentProblemIndex: 0,
        currentInput: '',
        startTime: Date.now(),
        problemStartTime: Date.now(),
        results: [],
        status: 'typing',
        incorrectIndices: [],
      };

    case 'KEY_PRESSED': {
      if (state.status !== 'typing') return state;

      const currentProblem = state.problems[state.currentProblemIndex];
      if (!currentProblem) return state;

      const newInput = state.currentInput + action.key;
      const expectedChar = currentProblem.code[state.currentInput.length];

      // Check if the character is correct
      const isCorrect = action.key === expectedChar;
      const newIncorrectIndices = isCorrect
        ? state.incorrectIndices
        : [...state.incorrectIndices, state.currentInput.length];

      return {
        ...state,
        currentInput: newInput,
        incorrectIndices: newIncorrectIndices,
      };
    }

    case 'BACKSPACE': {
      if (state.status !== 'typing' || state.currentInput.length === 0) return state;

      const newInput = state.currentInput.slice(0, -1);
      const newIncorrectIndices = state.incorrectIndices.filter((idx) => idx < newInput.length);

      return {
        ...state,
        currentInput: newInput,
        incorrectIndices: newIncorrectIndices,
      };
    }

    case 'PROBLEM_COMPLETED': {
      if (state.status !== 'typing') return state;

      const currentProblem = state.problems[state.currentProblemIndex];
      if (!currentProblem || !state.problemStartTime) return state;

      const timeSeconds = (Date.now() - state.problemStartTime) / 1000;
      const wpm = calculateWPM(currentProblem.code.length, timeSeconds);
      const accuracy = calculateAccuracy(
        currentProblem.code.length - state.incorrectIndices.length,
        currentProblem.code.length
      );

      const result: ProblemResult = {
        problemId: currentProblem.id,
        timeSeconds: Math.round(timeSeconds * 10) / 10,
        wpm,
        accuracy,
        incorrectCharIndices: state.incorrectIndices,
      };

      const newResults = [...state.results, result];
      const isLastProblem = state.currentProblemIndex >= state.problems.length - 1;

      if (isLastProblem) {
        return {
          ...state,
          results: newResults,
          status: 'completed',
          currentInput: '',
          incorrectIndices: [],
        };
      }

      return {
        ...state,
        currentProblemIndex: state.currentProblemIndex + 1,
        currentInput: '',
        problemStartTime: Date.now(),
        results: newResults,
        incorrectIndices: [],
      };
    }

    case 'SESSION_COMPLETED':
      return {
        ...state,
        status: 'completed',
      };

    case 'RESET':
      return {
        problems: [],
        currentProblemIndex: 0,
        currentInput: '',
        startTime: null,
        problemStartTime: null,
        results: [],
        status: 'idle',
        incorrectIndices: [],
      };

    default:
      return state;
  }
}

const initialState: TypingSessionState = {
  problems: [],
  currentProblemIndex: 0,
  currentInput: '',
  startTime: null,
  problemStartTime: null,
  results: [],
  status: 'idle',
  incorrectIndices: [],
};

export function useTypingSession() {
  const [state, dispatch] = useReducer(typingSessionReducer, initialState);

  const startSession = useCallback((problems: Problem[]) => {
    dispatch({ type: 'START_SESSION', problems });
  }, []);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (key === 'Backspace') {
        dispatch({ type: 'BACKSPACE' });
        return;
      }

      // Only accept printable characters
      if (key.length === 1) {
        dispatch({ type: 'KEY_PRESSED', key });
      }
    },
    []
  );

  const resetSession = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  // Auto-complete problem when input matches
  useEffect(() => {
    if (state.status !== 'typing') return;

    const currentProblem = state.problems[state.currentProblemIndex];
    if (!currentProblem) return;

    if (state.currentInput === currentProblem.code) {
      dispatch({ type: 'PROBLEM_COMPLETED' });
    }
  }, [state.currentInput, state.currentProblemIndex, state.problems, state.status]);

  const currentProblem = state.problems[state.currentProblemIndex] || null;
  const progress = state.problems.length > 0
    ? ((state.currentProblemIndex + 1) / state.problems.length) * 100
    : 0;

  const elapsedTime = state.startTime ? Math.floor((Date.now() - state.startTime) / 1000) : 0;

  return {
    state,
    currentProblem,
    progress,
    elapsedTime,
    startSession,
    handleKeyPress,
    resetSession,
  };
}
