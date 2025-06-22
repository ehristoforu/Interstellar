'use client'

import { useEffect, useState } from 'react'

interface ProxyFrameProps {
  url: string
  onTitleChange: (title: string) => void
}

export default function ProxyFrame({ url, onTitleChange }: ProxyFrameProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (url) {
      setLoading(true)
      setError(null)
    }
  }, [url])

  const handleLoad = () => {
    setLoading(false)
    try {
      // Попытка получить заголовок страницы
      const iframe = document.querySelector('iframe') as HTMLIFrameElement
      if (iframe?.contentDocument?.title) {
        onTitleChange(iframe.contentDocument.title)
      }
    } catch (err) {
      // Игнорируем ошибки CORS
    }
  }

  const handleError = () => {
    setLoading(false)
    setError('Не удалось загрузить страницу')
  }

  if (!url) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900/50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Новая вкладка</h2>
          <p className="text-white/60">Введите URL или поисковый запрос для начала</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full relative bg-white">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
          <div className="glass rounded-lg p-6 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Загрузка...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
          <div className="glass rounded-lg p-6 text-center max-w-md">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-white mb-2">Ошибка загрузки</h3>
            <p className="text-white/70 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      )}

      <iframe
        src={`/api/proxy?url=${encodeURIComponent(url)}`}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox"
        title="Proxy Frame"
      />
    </div>
  )
}