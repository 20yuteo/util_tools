export function middleware(request: Request) {
  // cronエンドポイントの場合のみ処理
  if (request.url.startsWith('/api/cron')) {
    // Vercelからのリクエストかどうかを確認
    const isVercelCron = request.headers.get('x-vercel-cron') === '1'
    
    if (!isVercelCron) {
      return new Response('Unauthorized', { status: 401 })
    }
  }

  return null
}

// どのパスでミドルウェアを実行するか設定
export const config = {
  matcher: '/api/cron'
} 