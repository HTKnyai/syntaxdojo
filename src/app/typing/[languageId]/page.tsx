'use client';

import { useEffect, useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTypingSession } from '@/hooks/useTypingSession';
import { getRandomProblems } from '@/lib/data/mockProblems';
import { LANGUAGES, type LanguageId } from '@/types/problem';
import { sessionService } from '@/services/sessionService';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProblemDisplay } from '@/components/typing/ProblemDisplay';
import { Timer } from '@/components/typing/Timer';
import { PerformanceTracker } from '@/components/typing/PerformanceTracker';

export default function TypingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const {
    state,
    currentProblem,
    progress,
    elapsedTime,
    startSession,
    handleKeyPress,
    resetSession,
  } = useTypingSession();

  const languageId = params.languageId as string;
  const language = LANGUAGES.find((l) => l.id === languageId);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Start session on mount
  useEffect(() => {
    if (languageId && state.status === 'idle') {
      const problems = getRandomProblems(languageId, 5);
      if (problems.length > 0) {
        startSession(problems);
      }
    }
  }, [languageId, state.status, startSession]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state.status !== 'typing') return;

      // Prevent default for certain keys
      if (e.key === 'Backspace' || e.key.length === 1) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.status, handleKeyPress]);

  const [isSaving, setIsSaving] = useState(false);

  const handleFinish = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);

    // Calculate final results
    const totalProblems = state.results.length;
    const averageWPM =
      state.results.reduce((sum, r) => sum + r.wpm, 0) / totalProblems || 0;
    const averageAccuracy =
      state.results.reduce((sum, r) => sum + r.accuracy, 0) / totalProblems || 0;

    const sessionResults = {
      totalProblems,
      averageWPM: Math.round(averageWPM),
      averageAccuracy: Math.round(averageAccuracy),
      totalTimeSeconds: elapsedTime,
      problemResults: state.results,
    };

    // Save to Firestore
    const result = await sessionService.saveResults(
      user.uid,
      languageId as LanguageId,
      sessionResults
    );

    setIsSaving(false);

    if (result.success) {
      // Navigate to results page with session ID
      router.push(`/results?sessionId=${result.data.id}`);
    } else {
      // On error, still navigate but without session ID
      console.error('Failed to save session:', result.error);
      router.push(
        `/results?` +
          new URLSearchParams({
            languageId,
            totalProblems: totalProblems.toString(),
            averageWPM: Math.round(averageWPM).toString(),
            averageAccuracy: Math.round(averageAccuracy).toString(),
            totalTime: elapsedTime.toString(),
          }).toString()
      );
    }
  }, [state.results, elapsedTime, languageId, router, user]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!user || !language) {
    return null;
  }

  if (state.status === 'completed') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>セッション完了！</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">お疲れ様でした。結果を確認しましょう。</p>
            <div className="flex space-x-4">
              <Button onClick={handleFinish} className="flex-1" disabled={isSaving}>
                {isSaving ? '保存中...' : '結果を見る'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  resetSession();
                  router.push('/');
                }}
              >
                ホームに戻る
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>問題が見つかりません</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/')}>ホームに戻る</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => {
                if (confirm('セッションを終了しますか？進行状況は保存されません。')) {
                  resetSession();
                  router.push('/');
                }
              }}
            >
              ← 戻る
            </Button>
            <div>
              <h1 className="text-xl font-bold text-blue-600">{language.displayName}</h1>
              <p className="text-sm text-gray-600">タイピング練習</p>
            </div>
          </div>
          <Timer startTime={state.startTime} isActive={state.status === 'typing'} />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* Progress */}
          <PerformanceTracker
            currentProblemIndex={state.currentProblemIndex}
            totalProblems={state.problems.length}
            progress={progress}
          />

          {/* Problem Display */}
          <ProblemDisplay
            problem={currentProblem}
            currentInput={state.currentInput}
            incorrectIndices={state.incorrectIndices}
          />

          {/* Instructions */}
          <Card className="bg-blue-50">
            <CardContent className="p-4">
              <p className="text-sm text-blue-900">
                💡 上に表示されているコードを入力してください。正しく入力すると
                <span className="font-semibold text-green-600">緑色</span>
                、間違えると
                <span className="font-semibold text-red-600">赤色</span>
                でハイライトされます。
              </p>
            </CardContent>
          </Card>

          {/* Hidden input for mobile (optional) */}
          <input
            type="text"
            className="sr-only"
            autoFocus
            value={state.currentInput}
            readOnly
            aria-label="Typing input"
          />
        </div>
      </main>
    </div>
  );
}
