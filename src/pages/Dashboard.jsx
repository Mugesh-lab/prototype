import React, { useState } from 'react'
import SpeechTool from './SpeechTool'
import SignLanguageTool from './SignLanguageTool'
import BrailleTool from './BrailleTool'
import TranslationTool from './TranslationTool'

const tabs = [
  {key: 'speech', label: 'Speech'},
  {key: 'sign', label: 'Sign'},
  {key: 'braille', label: 'Braille'},
  {key: 'translate', label: 'Translation'},
]

export default function Dashboard(){
  const [active, setActive] = useState('speech')

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-xl font-semibold">Live Conversion Dashboard</h2>
      <div className="mt-4 flex gap-3" role="tablist" aria-label="Conversion tools">
        {tabs.map(t => (
          <button key={t.key} role="tab" aria-selected={active===t.key} onClick={() => setActive(t.key)} className={`px-3 py-2 rounded-md focus-ring ${active===t.key ? 'bg-primary text-white' : 'bg-surface'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-4 rounded-md bg-surface">
          {active === 'speech' && <SpeechTool compact />}
          {active === 'sign' && <SignLanguageTool compact />}
          {active === 'braille' && <BrailleTool compact />}
          {active === 'translate' && <TranslationTool compact />}
        </div>
        <aside className="p-4 rounded-md bg-surface">
          <h3 className="font-semibold">Live Preview</h3>
          <div className="mt-3 h-48 bg-white rounded p-3 overflow-auto">Preview panel — live transcript or output will appear here.</div>
          <div className="mt-4">
            <label className="flex items-center gap-2">Device: <select className="ml-2 p-2 rounded bg-transparent"><option>Default</option></select></label>
          </div>
        </aside>
      </div>
    </div>
  )
}
