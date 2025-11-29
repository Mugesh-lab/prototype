import React from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Layers, Mic, Video, BookOpen, Globe } from 'lucide-react'

const Item = ({to, icon: Icon, label}) => (
  <NavLink to={to} className={({isActive}) => `flex items-center gap-3 p-3 rounded-md focus-ring ${isActive ? 'bg-surface font-semibold' : 'hover:bg-surface'}`}>
    <Icon size={18} />
    <span>{label}</span>
  </NavLink>
)

export default function Sidebar(){
  return (
    <aside className="w-60 hidden md:block border-r p-4" aria-label="Sidebar">
      <div className="space-y-2">
        <Item to="/" icon={Home} label="Home" />
        <Item to="/dashboard" icon={Layers} label="Dashboard" />
        <Item to="/speech" icon={Mic} label="Speech" />
        <Item to="/sign" icon={Video} label="Sign Language" />
        <Item to="/braille" icon={BookOpen} label="Braille Converter" />
        <Item to="/translate" icon={Globe} label="Translation" />
      </div>
    </aside>
  )
}
