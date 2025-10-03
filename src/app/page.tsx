'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LANGUAGES } from '@/types/problem';

export default function HomePage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();

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

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Syntax Dojo</h1>
            <p className="text-sm text-gray-600">
              ようこそ、{user.displayName || user.email || 'ゲスト'}さん
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            ログアウト
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold">言語を選択してください</h2>
          <p className="text-gray-600">
            学習したいプログラミング言語を選んでタイピング練習を始めましょう
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {LANGUAGES.map((language) => (
            <Card
              key={language.id}
              className="cursor-pointer transition-all hover:shadow-lg"
              onClick={() => router.push(`/typing/${language.id}`)}
            >
              <CardHeader>
                <div className="mb-4 flex h-20 items-center justify-center">
                  <div className="text-6xl">
                    {language.id === 'java' && '☕'}
                    {language.id === 'javascript' && '📜'}
                    {language.id === 'sql' && '🗃️'}
                  </div>
                </div>
                <CardTitle className="text-center">{language.displayName}</CardTitle>
                <CardDescription className="text-center">
                  {language.id === 'java' && 'オブジェクト指向プログラミングの基礎'}
                  {language.id === 'javascript' && 'Web開発の必須言語'}
                  {language.id === 'sql' && 'データベース操作の基本'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="outline">
                  練習を始める
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coming Soon Section */}
        <div className="mt-12">
          <h3 className="mb-4 text-xl font-semibold">準備中の機能</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>学習履歴</CardTitle>
                <CardDescription>過去のセッションと統計を確認</CardDescription>
              </CardHeader>
            </Card>
            <Card className="opacity-60">
              <CardHeader>
                <CardTitle>復習リスト</CardTitle>
                <CardDescription>苦手な問題を重点的に復習</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
