import React from 'react'
import AccessibilityPanel from '../components/AccessibilityPanel'

export default function Profile(){
  const [profile, setProfile] = React.useState(null)

  React.useEffect(()=>{
    fetch('/api/profile').then(r=>r.json()).then(setProfile).catch(()=>{})
  }, [])

  const save = async (prefs)=>{
    const res = await fetch('/api/profile', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({preferences: prefs})})
    const json = await res.json()
    setProfile(json)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold">User Profile</h2>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 p-4 bg-surface rounded">
          <div className="w-32 h-32 bg-white rounded-full mx-auto flex items-center justify-center">Avatar</div>
          <div className="mt-3 text-center">{profile ? profile.name : 'Loading...'}</div>
        </div>
        <div className="md:col-span-2 p-4 bg-surface rounded">
          <h3 className="font-semibold">Preferences</h3>
          <AccessibilityPanel />
          <div className="mt-4">
            <button onClick={()=>save({})} className="px-3 py-2 rounded bg-primary text-white">Save Preferences</button>
          </div>
          <div className="mt-4">
            <h4 className="font-semibold">Modules History</h4>
            <div className="mt-2 text-sm text-muted">No history yet.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
