import React from 'react'
import { Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'
import { User } from 'lucide-react'
import { useA11y } from '../context/AccessibilityContext'

export default function Navbar(){
  const { language } = useA11y()

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-surface" role="banner">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-lg font-semibold">Accessibility Suite</Link>
        <nav aria-label="Main navigation" className="hidden md:flex gap-3">
          <Link to="/dashboard" className="text-sm text-muted">Dashboard</Link>
          <Link to="/speech" className="text-sm text-muted">Speech</Link>
          <Link to="/sign" className="text-sm text-muted">Sign</Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <LanguageSelector />
        <Link to="/profile" aria-label="Open profile" className="p-2 rounded-md hover:bg-white/5 focus-ring">
          <User size={18} />
        </Link>
      </div>
    </header>
  )
}
