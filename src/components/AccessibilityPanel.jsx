import React from 'react'
import { useA11y } from '../context/AccessibilityContext'

export default function AccessibilityPanel(){
  const { largeText, setLargeText, highContrast, setHighContrast, dyslexia, setDyslexia, reduceMotion, setReduceMotion } = useA11y()

  return (
    <section aria-labelledby="accessibility-heading" className="p-4 rounded-md shadow-soft bg-surface">
      <h3 id="accessibility-heading" className="font-semibold">Accessibility Settings</h3>
      <div className="mt-3 space-y-2">
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={largeText} onChange={e => setLargeText(e.target.checked)} />
          <span>Large Text Mode</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={highContrast} onChange={e => setHighContrast(e.target.checked)} />
          <span>High Contrast Mode</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={dyslexia} onChange={e => setDyslexia(e.target.checked)} />
          <span>Dyslexia-Friendly Font</span>
        </label>
        <label className="flex items-center gap-3">
          <input type="checkbox" checked={reduceMotion} onChange={e => setReduceMotion(e.target.checked)} />
          <span>Reduce Animations</span>
        </label>
      </div>
    </section>
  )
}
