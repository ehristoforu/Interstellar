'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface SearchEngine {
  id: string
  name: string
  icon: string
  color: string
}

const searchEngines: SearchEngine[] = [
  { id: 'duckduckgo', name: 'DuckDuckGo', icon: '🦆', color: 'bg-orange-500' },
  { id: 'google', name: 'Google', icon: '🔍', color: 'bg-blue-500' },
  { id: 'yandex', name: 'Yandex', icon: '🔴', color: 'bg-red-500' },
  { id: 'bing', name: 'Bing', icon: '🟦', color: 'bg-blue-600' },
]

interface SearchEngineSelectorProps {
  selectedEngine: string
  onEngineChange: (engine: string) => void
}

export default function SearchEngineSelector({ selectedEngine, onEngineChange }: SearchEngineSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedEngineData = searchEngines.find(engine => engine.id === selectedEngine) || searchEngines[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-4 glass rounded-xl hover:bg-white/20 transition-all duration-200 min-w-[140px]"
      >
        <div className={`w-8 h-8 ${selectedEngineData.color} rounded-lg flex items-center justify-center text-white text-sm`}>
          {selectedEngineData.icon}
        </div>
        <span className="font-medium">{selectedEngineData.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full glass rounded-xl border border-white/20 overflow-hidden z-50">
          {searchEngines.map((engine) => (
            <button
              key={engine.id}
              onClick={() => {
                onEngineChange(engine.id)
                setIsOpen(false)
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors ${
                engine.id === selectedEngine ? 'bg-white/20' : ''
              }`}
            >
              <div className={`w-6 h-6 ${engine.color} rounded-md flex items-center justify-center text-white text-xs`}>
                {engine.icon}
              </div>
              <span className="font-medium">{engine.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}