'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LANGUAGES } from '@/types/problem';
import { formatTime } from '@/lib/utils/calculations';

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">読み込み中...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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
                {language?.displayName || languageId}のタイピング練習が完了しました
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">平均タイピング速度</p>
                  <p className="text-4xl font-bold text-blue-600">{averageWPM}</p>
                  <p className="text-sm text-gray-500">WPM</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">平均正確率</p>
                  <p className="text-4xl font-bold text-green-600">{averageAccuracy}%</p>
                  <p className="text-sm text-gray-500">正確率</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">完了した問題数</p>
                  <p className="text-4xl font-bold text-purple-600">{totalProblems}</p>
                  <p className="text-sm text-gray-500">問題</p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 text-center">
                  <p className="mb-2 text-sm text-gray-600">合計時間</p>
                  <p className="text-4xl font-bold text-orange-600">{formatTime(totalTime)}</p>
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
                {averageWPM < 30 && (
                  <p className="text-gray-600">
                    タイピング速度はまだまだ伸びしろがあります！継続して練習しましょう。
                  </p>
                )}
                {averageWPM >= 30 && averageWPM < 50 && (
                  <p className="text-gray-600">
                    良いペースです！このまま練習を続けて、さらにスピードアップを目指しましょう。
                  </p>
                )}
                {averageWPM >= 50 && averageWPM < 70 && (
                  <p className="text-gray-600">
                    素晴らしいタイピング速度です！上級者レベルまであと少しです。
                  </p>
                )}
                {averageWPM >= 70 && (
                  <p className="text-gray-600">
                    驚異的なタイピング速度です！プロフェッショナルレベルに達しています。
                  </p>
                )}

                {averageAccuracy < 90 && (
                  <p className="text-gray-600">
                    正確性を意識して、ゆっくりでも正しく入力する練習をしましょう。
                  </p>
                )}
                {averageAccuracy >= 90 && averageAccuracy < 95 && (
                  <p className="text-gray-600">高い正確率です！このバランスを保ちながら速度を上げていきましょう。</p>
                )}
                {averageAccuracy >= 95 && (
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
              onClick={() => router.push(`/typing/${languageId}`)}
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
