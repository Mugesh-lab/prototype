import React from 'react'
import { useA11y } from '../context/AccessibilityContext'

export default function LanguageSelector(){
  const { language, setLanguage } = useA11y()
  return (
    <label className="flex items-center gap-2" aria-label="Select language">
      <select value={language} onChange={e => setLanguage(e.target.value)} className="p-2 rounded-md bg-transparent focus-ring">
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </label>
  )
}
