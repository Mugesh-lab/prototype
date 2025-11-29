import React, { useState } from 'react'

const speakText = (text) => {
  if (!window.speechSynthesis || !text) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = 'en-US'  // Force Google US English
  utt.rate = 0.85
  utt.pitch = 1.0
  utt.volume = 1.0
  
  // Try to select Google US English voice
  const voices = window.speechSynthesis.getVoices()
  const googleVoice = voices.find(v => 
    v.name.includes('Google US English') || 
    (v.name.includes('Google') && v.lang === 'en-US')
  )
  if (googleVoice) utt.voice = googleVoice
  
  window.speechSynthesis.speak(utt)
}

const BRAILLE_MAP = {
  a: '⠁', b: '⠃', c: '⠉', d: '⠙', e: '⠑', f: '⠋', g: '⠛', h: '⠓', i: '⠊', j: '⠚',
  k: '⠅', l: '⠇', m: '⠍', n: '⠝', o: '⠕', p: '⠏', q: '⠟', r: '⠗', s: '⠎', t: '⠞',
  u: '⠥', v: '⠧', w: '⠺', x: '⠭', y: '⠽', z: '⠵', ' ': ' ',
  '.': '⠲', ',': '⠂', '?': '⠿', '!': '⠮', "'": '⠄', '"': '⠐'
}

// Create reverse map for Braille to Text conversion
const BRAILLE_REVERSE_MAP = Object.entries(BRAILLE_MAP).reduce((acc, [char, braille]) => {
  acc[braille] = char
  return acc
}, {})

function toBraille(text){
  return text.toLowerCase().split('').map(c => BRAILLE_MAP[c] || '?').join('')
}

function fromBraille(brailleText){
  return brailleText.split('').map(c => BRAILLE_REVERSE_MAP[c] || '?').join('')
}

export default function BrailleTool({compact}){
  const [text, setText] = useState('')
  const [braille, setBraille] = useState('')
  const [reverseText, setReverseText] = useState('')
  const [convertMode, setConvertMode] = useState('toBraille') // 'toBraille' or 'fromBraille'

  const convert = ()=> setBraille(toBraille(text))
  
  const convertFromBraille = () => setReverseText(fromBraille(braille))

  const download = ()=>{
    const blob = new Blob([braille], {type:'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'braille.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadText = ()=>{
    const blob = new Blob([reverseText], {type:'text/plain'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'text_from_braille.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const upload = (e)=>{
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setText(reader.result)
    reader.readAsText(f)
  }

  const uploadBraille = (e)=>{
    const f = e.target.files && e.target.files[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => setBraille(reader.result)
    reader.readAsText(f)
  }

  return (
    <section aria-labelledby="braille-heading">
      <h3 id="braille-heading" className="font-semibold">Braille Converter</h3>
      
      {/* Mode Selector */}
      <div className="mt-3 flex gap-2 border-b">
        <button 
          onClick={() => setConvertMode('toBraille')}
          className={`px-4 py-2 font-semibold ${convertMode === 'toBraille' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
        >
          Text → Braille
        </button>
        <button 
          onClick={() => setConvertMode('fromBraille')}
          className={`px-4 py-2 font-semibold ${convertMode === 'fromBraille' ? 'border-b-2 border-primary text-primary' : 'text-muted'}`}
        >
          Braille → Text
        </button>
      </div>

      <div className="mt-4 space-y-3">
        
        {/* Text to Braille */}
        {convertMode === 'toBraille' && (
          <>
            <div>
              <label htmlFor="text-input" className="text-sm font-semibold">Enter Text</label>
              <textarea 
                id="text-input"
                className="w-full p-3 rounded border mt-2" 
                rows={4} 
                value={text} 
                onChange={e=>setText(e.target.value)} 
                aria-label="Input text for braille conversion" 
                placeholder="Type or paste text here..."
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={async ()=>{
                  try{
                    const res = await fetch('/api/braille',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({text})})
                    const json = await res.json()
                    setBraille(json.braille)
                  }catch(e){ setBraille(toBraille(text)) }
                }} 
                className="px-3 py-2 rounded bg-primary text-white"
              >
                Convert to Braille
              </button>
              <button onClick={download} disabled={!braille} className="px-3 py-2 rounded bg-surface disabled:opacity-50">
                Download Braille
              </button>
              <label className="px-3 py-2 rounded bg-surface cursor-pointer">
                Upload Text File
                <input type="file" accept=".txt" onChange={upload} className="hidden" />
              </label>
            </div>
            
            <div>
              <label htmlFor="braille-output" className="text-sm font-semibold">Braille Output</label>
              <div 
                id="braille-output"
                className="w-full p-3 rounded border font-mono text-lg mt-2 bg-white min-h-24" 
                aria-live="polite"
              >
                {braille || <span className="text-muted">Braille preview will appear here</span>}
              </div>
              <button onClick={()=>speakText(text)} disabled={!text} className="mt-2 px-3 py-2 rounded bg-blue-500 text-white text-sm" aria-label="Speak original text">🔊 Speak Original</button>
            </div>
          </>
        )}

        {/* Braille to Text */}
        {convertMode === 'fromBraille' && (
          <>
            <div>
              <label htmlFor="braille-input" className="text-sm font-semibold">Enter Braille</label>
              <textarea 
                id="braille-input"
                className="w-full p-3 rounded border mt-2" 
                rows={4} 
                value={braille} 
                onChange={e=>setBraille(e.target.value)} 
                aria-label="Input braille for text conversion" 
                placeholder="Paste braille characters here..."
              />
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={convertFromBraille}
                className="px-3 py-2 rounded bg-primary text-white"
              >
                Convert to Text
              </button>
              <button onClick={downloadText} disabled={!reverseText} className="px-3 py-2 rounded bg-surface disabled:opacity-50">
                Download Text
              </button>
              <label className="px-3 py-2 rounded bg-surface cursor-pointer">
                Upload Braille File
                <input type="file" accept=".txt" onChange={uploadBraille} className="hidden" />
              </label>
            </div>
            
            <div>
              <label htmlFor="text-output" className="text-sm font-semibold">Text Output</label>
              <div 
                id="text-output"
                className="w-full p-3 rounded border font-mono mt-2 bg-white min-h-24" 
                aria-live="polite"
              >
                {reverseText || <span className="text-muted">Text preview will appear here</span>}
              </div>
              <button onClick={()=>speakText(reverseText)} disabled={!reverseText} className="mt-2 px-3 py-2 rounded bg-blue-500 text-white text-sm" aria-label="Speak converted text">🔊 Speak Text</button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
