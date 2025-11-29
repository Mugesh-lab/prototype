import React from 'react'

export default function MicrophoneButton({onToggle, active}){
  return (
    <button onClick={onToggle} aria-pressed={!!active} className={`p-3 rounded-full focus-ring ${active ? 'bg-accent text-white' : 'bg-surface'}`}>
      {active ? 'Recording' : 'Start'}
    </button>
  )
}
