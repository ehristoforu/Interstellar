import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 })
  }

  try {
    // Проверяем, что URL валидный
    const targetUrl = new URL(url)
    
    // Делаем запрос к целевому сайту
    const response = await fetch(targetUrl.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'DNT': '1',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || ''
    
    // Если это HTML, модифицируем его для работы через прокси
    if (contentType.includes('text/html')) {
      let html = await response.text()
      
      // Базовая модификация HTML для работы через прокси
      html = html.replace(
        /<head>/i,
        `<head>
          <base href="${targetUrl.origin}/">
          <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
        `
      )
      
      // Заменяем относительные ссылки на абсолютные через наш прокси
      html = html.replace(
        /href="\/([^"]*)"/g,
        `href="/api/proxy?url=${encodeURIComponent(targetUrl.origin)}/$1"`
      )
      
      html = html.replace(
        /src="\/([^"]*)"/g,
        `src="/api/proxy?url=${encodeURIComponent(targetUrl.origin)}/$1"`
      )

      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Frame-Options': 'SAMEORIGIN',
          'Content-Security-Policy': "frame-ancestors 'self'",
        },
      })
    }

    // Для других типов контента просто проксируем как есть
    const arrayBuffer = await response.arrayBuffer()
    
    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    })

  } catch (error) {
    console.error('Proxy error:', error)
    
    // Возвращаем HTML страницу с ошибкой
    const errorHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Ошибка прокси</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
            }
            .error-container {
              text-align: center;
              background: rgba(255, 255, 255, 0.1);
              backdrop-filter: blur(10px);
              padding: 2rem;
              border-radius: 1rem;
              border: 1px solid rgba(255, 255, 255, 0.2);
            }
            .error-icon { font-size: 4rem; margin-bottom: 1rem; }
            h1 { margin-bottom: 1rem; }
            p { margin-bottom: 1.5rem; opacity: 0.8; }
            button {
              background: linear-gradient(45deg, #3b82f6, #8b5cf6);
              color: white;
              border: none;
              padding: 0.75rem 1.5rem;
              border-radius: 0.5rem;
              cursor: pointer;
              font-size: 1rem;
            }
            button:hover { transform: translateY(-2px); }
          </style>
        </head>
        <body>
          <div class="error-container">
            <div class="error-icon">⚠️</div>
            <h1>Не удалось загрузить страницу</h1>
            <p>Возможно, сайт недоступен или заблокирован</p>
            <button onclick="history.back()">Вернуться назад</button>
          </div>
        </body>
      </html>
    `
    
    return new NextResponse(errorHtml, {
      status: 500,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    })
  }
}