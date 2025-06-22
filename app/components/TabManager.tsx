'use client'

import { Plus, X } from 'lucide-react'

interface Tab {
  id: string
  title: string
  url: string
  isActive: boolean
}

interface TabManagerProps {
  tabs: Tab[]
  onSwitchTab: (tabId: string) => void
  onCloseTab: (tabId: string) => void
  onAddTab: () => void
}

export default function TabManager({ tabs, onSwitchTab, onCloseTab, onAddTab }: TabManagerProps) {
  const truncateTitle = (title: string, maxLength: number = 20) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title
  }

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`tab ${tab.isActive ? 'active' : ''}`}
          onClick={() => onSwitchTab(tab.id)}
        >
          <span className="flex-1 truncate text-sm">
            {truncateTitle(tab.title)}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onCloseTab(tab.id)
            }}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      
      <button
        onClick={onAddTab}
        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
        title="Новая вкладка"
      >
        <Plus size={18} />
      </button>
    </div>
  )
}