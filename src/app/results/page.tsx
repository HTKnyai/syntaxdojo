'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { sessionService } from '@/services/sessionService';
import { SessionRecord } from '@/types/session';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LANGUAGES, type LanguageId } from '@/types/problem';
import { formatTime } from '@/lib/utils/calculations';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [session, setSession] = useState<SessionRecord | null>(null);
  const [bestRecord, setBestRecord] = useState<SessionRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const sessionId = searchParams.get('sessionId');
  const languageId = searchParams.get('languageId') || '';
  const totalProblems = parseInt(searchParams.get('totalProblems') || '0');
  const averageWPM = parseInt(searchParams.get('averageWPM') || '0');
  const averageAccuracy = parseInt(searchParams.get('averageAccuracy') || '0');
  const totalTime = parseInt(searchParams.get('totalTime') || '0');

  const language = LANGUAGES.find((l) => l.id === languageId);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Fetch session and best record
  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      setIsLoading(true);

      // Fetch session if sessionId is provided
      if (sessionId) {
        const sessionResult = await sessionService.getSessionById(sessionId);
        if (sessionResult.success) {
          setSession(sessionResult.data);
        }
      }

      // Fetch best record
      const effectiveLanguageId = session?.languageId || (languageId as LanguageId);
      if (effectiveLanguageId) {
        const bestResult = await sessionService.getBestRecord(user.uid, effectiveLanguageId);
        if (bestResult.success && bestResult.data) {
          setBestRecord(bestResult.data);
        }
      }

      setIsLoading(false);
    }

    fetchData();
  }, [user, sessionId, languageId, session?.languageId]);

  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Use session data if available, otherwise use URL params
  const displayData = session
    ? {
        languageId: session.languageId,
        totalProblems: session.results.totalProblems,
        averageWPM: session.results.averageWPM,
        averageAccuracy: session.results.averageAccuracy,
        totalTime: session.results.totalTimeSeconds,
      }
    : {
        languageId,
        totalProblems,
        averageWPM,
        averageAccuracy,
        totalTime,
      };

  const displayLanguage = LANGUAGES.find((l) => l.id === displayData.languageId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Syntax Dojo</h1>
            <p className="text-sm text-gray-600">結果</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="space-y-6">
          {/* Result Summary */}
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl">お疲れ様でした！</CardTitle>
              <CardDescription>
                {displayLanguage?.displayName || displayData.languageId}のタイピング練習が完了しました
              </CardDescription>
              {bestRecord && displayData.averageWPM > bestRecord.results.averageWPM && (
                <div className="mt-2 inline-block rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-800">
                  🎉 新記録達成！
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">平均タイピング速度</p>
                  <p className="text-4xl font-bold text-blue-600">{displayData.averageWPM}</p>
                  <p className="text-sm text-gray-500">WPM</p>
                  {bestRecord && (
                    <p className="mt-2 text-xs text-gray-400">
                      過去最高: {bestRecord.results.averageWPM} WPM
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">平均正確率</p>
                  <p className="text-4xl font-bold text-green-600">{displayData.averageAccuracy}%</p>
                  <p className="text-sm text-gray-500">正確率</p>
                  {bestRecord && (
                    <p className="mt-2 text-xs text-gray-400">
                      過去最高: {bestRecord.results.averageAccuracy}%
                    </p>
                  )}
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">完了した問題数</p>
                  <p className="text-4xl font-bold text-purple-600">{displayData.totalProblems}</p>
                  <p className="text-sm text-gray-500">問題</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">合計時間</p>
                  <p className="text-4xl font-bold text-orange-600">{formatTime(displayData.totalTime)}</p>
                  <p className="text-sm text-gray-500">経過時間</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Evaluation */}
          <Card>
            <CardHeader>
              <CardTitle>評価</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayData.averageWPM < 30 && (
                  <p className="text-gray-600">
                    タイピング速度はまだまだ伸びしろがあります！継続して練習しましょう。
                  </p>
                )}
                {displayData.averageWPM >= 30 && displayData.averageWPM < 50 && (
                  <p className="text-gray-600">
                    良いペースです！このまま練習を続けて、さらにスピードアップを目指しましょう。
                  </p>
                )}
                {displayData.averageWPM >= 50 && displayData.averageWPM < 70 && (
                  <p className="text-gray-600">
                    素晴らしいタイピング速度です！上級者レベルまであと少しです。
                  </p>
                )}
                {displayData.averageWPM >= 70 && (
                  <p className="text-gray-600">
                    驚異的なタイピング速度です！プロフェッショナルレベルに達しています。
                  </p>
                )}

                {displayData.averageAccuracy < 90 && (
                  <p className="text-gray-600">
                    正確性を意識して、ゆっくりでも正しく入力する練習をしましょう。
                  </p>
                )}
                {displayData.averageAccuracy >= 90 && displayData.averageAccuracy < 95 && (
                  <p className="text-gray-600">高い正確率です！このバランスを保ちながら速度を上げていきましょう。</p>
                )}
                {displayData.averageAccuracy >= 95 && (
                  <p className="text-gray-600">
                    完璧に近い正確率です！素晴らしいタイピングスキルです。
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <Button
              className="flex-1"
              onClick={() => router.push(`/typing/${displayData.languageId}`)}
            >
              もう一度練習する
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => router.push('/')}>
              ホームに戻る
            </Button>
          </div>

          {/* Coming Soon */}
          <Card className="border-dashed opacity-60">
            <CardHeader>
              <CardTitle className="text-center">今後の機能</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc space-y-2 text-sm text-gray-600">
                <li>詳細な問題ごとの結果表示</li>
                <li>復習機能（間違えた問題をマーク）</li>
                <li>学習履歴の保存と確認</li>
                <li>WPMと正確率の推移グラフ</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">読み込み中...</div>
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
