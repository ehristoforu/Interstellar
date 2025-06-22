'use client'

import { useState, useEffect } from 'react'
import { Search, Plus, X, Globe, ArrowLeft, ArrowRight, RotateCcw, Home } from 'lucide-react'
import SearchEngineSelector from './components/SearchEngineSelector'
import TabManager from './components/TabManager'
import ProxyFrame from './components/ProxyFrame'

interface Tab {
  id: string
  title: string
  url: string
  isActive: boolean
}

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedEngine, setSelectedEngine] = useState('duckduckgo')
  const [showBrowser, setShowBrowser] = useState(false)

  // Floating particles effect
  useEffect(() => {
    const particles = document.querySelectorAll('.particle')
    particles.forEach((particle, index) => {
      const randomTop = Math.random() * 100
      const randomDelay = Math.random() * 6
      ;(particle as HTMLElement).style.top = `${randomTop}%`
      ;(particle as HTMLElement).style.animationDelay = `${randomDelay}s`
    })
  }, [])

  const searchEngines = {
    duckduckgo: 'https://duckduckgo.com/?q=',
    google: 'https://www.google.com/search?q=',
    yandex: 'https://yandex.ru/search/?text=',
    bing: 'https://www.bing.com/search?q='
  }

  const isUrl = (text: string) => {
    try {
      new URL(text.startsWith('http') ? text : `https://${text}`)
      return text.includes('.') && !text.includes(' ')
    } catch {
      return false
    }
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return

    let url: string
    if (isUrl(searchQuery)) {
      url = searchQuery.startsWith('http') ? searchQuery : `https://${searchQuery}`
    } else {
      url = searchEngines[selectedEngine as keyof typeof searchEngines] + encodeURIComponent(searchQuery)
    }

    const newTab: Tab = {
      id: Date.now().toString(),
      title: isUrl(searchQuery) ? searchQuery : `Поиск: ${searchQuery}`,
      url: url,
      isActive: true
    }

    setTabs(prevTabs => [
      ...prevTabs.map(tab => ({ ...tab, isActive: false })),
      newTab
    ])
    setShowBrowser(true)
    setSearchQuery('')
  }

  const addNewTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: 'Новая вкладка',
      url: '',
      isActive: true
    }

    setTabs(prevTabs => [
      ...prevTabs.map(tab => ({ ...tab, isActive: false })),
      newTab
    ])
  }

  const closeTab = (tabId: string) => {
    setTabs(prevTabs => {
      const newTabs = prevTabs.filter(tab => tab.id !== tabId)
      if (newTabs.length === 0) {
        setShowBrowser(false)
        return []
      }
      
      const closedTab = prevTabs.find(tab => tab.id === tabId)
      if (closedTab?.isActive && newTabs.length > 0) {
        newTabs[newTabs.length - 1].isActive = true
      }
      
      return newTabs
    })
  }

  const switchTab = (tabId: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab => ({
        ...tab,
        isActive: tab.id === tabId
      }))
    )
  }

  const updateTabTitle = (tabId: string, title: string) => {
    setTabs(prevTabs =>
      prevTabs.map(tab =>
        tab.id === tabId ? { ...tab, title } : tab
      )
    )
  }

  const goHome = () => {
    setShowBrowser(false)
    setTabs([])
  }

  const activeTab = tabs.find(tab => tab.isActive)

  if (showBrowser && tabs.length > 0) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Floating particles */}
        <div className="floating-particles">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="particle"></div>
          ))}
        </div>

        {/* Browser Header */}
        <header className="glass-dark border-b border-white/20 p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={goHome}
                className="btn-secondary flex items-center gap-2"
              >
                <Home size={18} />
                Baikal Proxy
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeft size={18} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowRight size={18} />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <RotateCcw size={18} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <TabManager
            tabs={tabs}
            onSwitchTab={switchTab}
            onCloseTab={closeTab}
            onAddTab={addNewTab}
          />
        </header>

        {/* Browser Content */}
        <main className="flex-1">
          {activeTab && (
            <ProxyFrame
              url={activeTab.url}
              onTitleChange={(title) => updateTabTitle(activeTab.id, title)}
            />
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
      {/* Floating particles */}
      <div className="floating-particles">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto text-center animate-fade-in">
        {/* Logo and Title */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
              Baikal Proxy
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white/80 font-light">
            Прокси для каждого
          </p>
          <p className="text-white/60 mt-2 max-w-2xl mx-auto">
            Безопасный и анонимный доступ к любым веб-сайтам. Обходите блокировки и защищайте свою приватность.
          </p>
        </div>

        {/* Search Section */}
        <div className="glass rounded-2xl p-8 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search Engine Selector */}
            <SearchEngineSelector
              selectedEngine={selectedEngine}
              onEngineChange={setSelectedEngine}
            />

            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Введите URL или поисковый запрос..."
                className="w-full px-6 py-4 rounded-xl input-glass text-lg"
              />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="btn-primary px-6 py-4 rounded-xl flex items-center gap-2"
            >
              <Search size={20} />
              <span className="hidden md:inline">Поиск</span>
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Анонимность</h3>
            <p className="text-white/70 text-sm">
              Полная анонимность и защита личных данных при просмотре веб-сайтов
            </p>
          </div>

          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Быстрый поиск</h3>
            <p className="text-white/70 text-sm">
              Поддержка всех популярных поисковых систем для удобного поиска
            </p>
          </div>

          <div className="glass rounded-xl p-6 text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Многовкладочность</h3>
            <p className="text-white/70 text-sm">
              Работайте с несколькими сайтами одновременно в разных вкладках
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}