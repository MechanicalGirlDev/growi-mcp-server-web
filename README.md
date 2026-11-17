# GROWI MCP Server

GROWI WikiにAIモデルを接続するためのModel Context Protocol (MCP) HTTPサーバー。Bearer認証に対応。

## 機能

### ページ操作

- `getPage` - ページ内容の取得
- `getPageInfo` - ページ情報の取得
- `createPage` - ページの作成
- `updatePage` - ページの更新
- `deletePage` - ページの削除
- `duplicatePage` - ページの複製
- `renamePage` - ページの移動/リネーム
- `searchPages` - ページの検索
- `getRecentPages` - 最近更新されたページの取得
- `getPageListingRoot` - ルートページ一覧の取得
- `getPageListingChildren` - 子ページ一覧の取得
- `publishPage` / `unpublishPage` - ページの公開/非公開

### タグ操作

- `getTagList` - タグ一覧の取得
- `searchTags` - タグの検索
- `updateTag` - タグの更新
- `getPageTag` - ページのタグ取得

### リビジョン操作

- `listRevisions` - リビジョン一覧の取得
- `getRevision` - リビジョンの取得

### 共有リンク操作

- `getShareLinks` - 共有リンク一覧の取得
- `createShareLink` - 共有リンクの作成
- `deleteShareLink` - 共有リンクの削除

### コメント操作

- `getComments` - コメントの取得

### ユーザー操作

- `getUserRecentPages` - ユーザーの最近のページ取得

## セットアップ

### 環境変数

`.env.example`をコピーして`.env`を作成：

```bash
cp .env.example .env
```

| 変数名                   | 説明                                                  | 例                      |
| ------------------------ | ----------------------------------------------------- | ----------------------- |
| `MCP_HTTP_PORT`          | サーバーポート                                        | `3001`                  |
| `MCP_HTTP_HOST`          | リッスンホスト                                        | `0.0.0.0`               |
| `MCP_AUTH_TOKENS`        | Bearer認証トークン (32文字以上、カンマ区切りで複数可) | `your-secure-token...`  |
| `GROWI_DEFAULT_APP_NAME` | デフォルトのGROWIアプリ名                             | `app-1`                 |
| `GROWI_APP_NAME_N`       | GROWIアプリ名 (N=1,2,3...)                            | `app-1`                 |
| `GROWI_API_TOKEN_N`      | GROWI APIトークン                                     | `8991502f6dfec...`      |
| `GROWI_BASE_URL_N`       | GROWI URL                                             | `http://localhost:3000` |

## 起動方法

### Docker Compose (Cloudflare Tunnel)

Cloudflare Tunnelを使用して、自己署名証明書なしでHTTPSアクセスを実現します。

1. Cloudflare Tunnelを作成：
   - [Cloudflare Zero Trust](https://one.dash.cloudflare.com/) にアクセス
   - Networks > Tunnels > Create a tunnel
   - トンネル名を入力して作成
   - トークンをコピー

2. トンネルの Public Hostname を設定：
   - Subdomain: 任意（例: `growi-mcp`）
   - Domain: Cloudflareに登録済みのドメイン
   - Service Type: `HTTP`
   - URL: `growi-mcp:3001`

3. `.env`を設定：

   ```bash
   cp .env.example .env
   # CLOUDFLARE_TUNNEL_TOKEN にトークンを設定
   ```

4. 起動：

   ```bash
   docker compose up -d
   ```

5. アクセス：
   - `https://growi-mcp.your-domain.com/mcp`

### ローカル開発

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番起動
pnpm start
```

## API

### エンドポイント

- `GET /health` - ヘルスチェック
- `POST /mcp` - MCPリクエスト

### 認証

リクエストヘッダーにBearerトークンを含める：

```
Authorization: Bearer your-secure-token-at-least-32-characters-long
```

## ライセンス

MIT
