import React from 'react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useA11y } from '../context/AccessibilityContext'

export default function ThemeToggle(){
  const { theme, setTheme } = useA11y()

  const next = () => {
    if (theme === 'light') setTheme('dark')
    else if (theme === 'dark') setTheme('auto')
    else setTheme('light')
  }

  const getIcon = () => {
    if (theme === 'dark') return <Moon size={18} />
    if (theme === 'light') return <Sun size={18} />
    return <Monitor size={18} />
  }

  const getLabel = () => {
    if (theme === 'dark') return 'Dark'
    if (theme === 'light') return 'Light'
    return 'Auto'
  }

  return (
    <button 
      aria-label="Toggle theme" 
      onClick={next} 
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 focus-ring transition text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      title={`Current theme: ${getLabel()}`}
    >
      {getIcon()}
      <span className="text-xs font-medium">{getLabel()}</span>
    </button>
  )
}
