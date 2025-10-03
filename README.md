# Syntax Dojo

プログラミング言語の基本文法を復習しながらタイピングスキルを向上できるWebアプリケーション

## 🎯 プロジェクト概要

Syntax Dojoは、Java、JavaScript、SQLなどの主要言語の文法をタイピングしながら学習できる教育アプリです。新人エンジニアや情報系学部の学生が、コードの構文を反復練習することで知識の定着とタイピング速度の向上を同時に実現します。

## ✨ 主な機能

- **言語選択**: Java, JavaScript, SQL から学習したい言語を選択
- **タイピング練習**: リアルタイム正誤判定とビジュアルフィードバック
- **パフォーマンス測定**: WPM（Words Per Minute）と正確率の計算・記録
- **復習機能**: セッション終了後の問題一覧と解説表示
- **学習履歴**: 過去のセッション記録と統計の確認
- **レスポンシブデザイン**: PC、タブレット、スマートフォン対応

## 🚀 技術スタック

### フロントエンド
- **Next.js 15** (App Router)
- **React 18** + **TypeScript**
- **Tailwind CSS** (スタイリング)
- **@tanstack/react-query** (サーバー状態管理)
- **React Hook Form** + **Zod** (フォーム&バリデーション)

### バックエンド / インフラ
- **Firebase Authentication** (ユーザー認証)
- **Cloud Firestore** (データベース)
- **Vercel** (ホスティング&デプロイ)

### テスト
- **Jest** + **Testing Library** (ユニット&統合テスト)
- **Playwright** (E2Eテスト)

## 📦 セットアップ

### 前提条件

- Node.js 18以上
- npm または yarn
- Firebaseアカウント
- Vercelアカウント（デプロイ時）

### 1. リポジトリのクローン

```bash
git clone https://github.com/HTKnyai/syntaxdojo.git
cd syntaxdojo
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 環境変数の設定

#### 3-1. Firebaseプロジェクト作成

1. [Firebase Console](https://console.firebase.google.com/) にアクセス
2. 新規プロジェクト作成
3. Authentication → メール/パスワード認証を有効化
4. Firestore Database → データベース作成（本番モード、ロケーション: asia-northeast1推奨）
5. プロジェクト設定 → Webアプリ追加 → 設定情報をコピー

#### 3-2. 環境変数ファイルの作成

`.env.local` に Firebase 設定を記入:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開く

## 🗂️ プロジェクト構造

```
syntax-dojo/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Reactコンポーネント
│   │   ├── auth/         # 認証関連
│   │   ├── typing/       # タイピング機能
│   │   ├── review/       # 復習機能
│   │   └── ui/           # 共通UIコンポーネント
│   ├── lib/              # ユーティリティとヘルパー
│   │   ├── firebase/     # Firebase設定
│   │   └── utils/        # 計算、バリデーション等
│   ├── hooks/            # カスタムフック
│   ├── contexts/         # Reactコンテキスト
│   ├── services/         # ビジネスロジック
│   └── types/            # TypeScript型定義
├── tests/                # テストファイル
└── public/               # 静的ファイル
```

## 🚀 デプロイ

### Vercelへのデプロイ

1. [Vercel](https://vercel.com/) でアカウント作成
2. GitHubアカウントと連携
3. "Import Git Repository" で本プロジェクトをインポート
4. 環境変数を設定（`.env.local` の内容をコピー）
5. Deploy をクリック

以降、`main` ブランチへのプッシュで自動デプロイされます。

## 📄 ライセンス

MIT License

---

Made with ❤️ for developers learning programming
