import React, { createContext, useContext, useEffect, useState } from 'react'

const AccessibilityContext = createContext(null)

export const AccessibilityProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'auto')
  const [largeText, setLargeText] = useState(() => JSON.parse(localStorage.getItem('largeText')) || false)
  const [highContrast, setHighContrast] = useState(() => JSON.parse(localStorage.getItem('highContrast')) || false)
  const [dyslexia, setDyslexia] = useState(() => JSON.parse(localStorage.getItem('dyslexia')) || false)
  const [reduceMotion, setReduceMotion] = useState(() => JSON.parse(localStorage.getItem('reduceMotion')) || false)
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en')

  useEffect(() => {
    localStorage.setItem('theme', theme)
    localStorage.setItem('largeText', JSON.stringify(largeText))
    localStorage.setItem('highContrast', JSON.stringify(highContrast))
    localStorage.setItem('dyslexia', JSON.stringify(dyslexia))
    localStorage.setItem('reduceMotion', JSON.stringify(reduceMotion))
    localStorage.setItem('language', language)

    const root = document.documentElement
    // theme
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
    // high contrast
    if (highContrast) root.classList.add('high-contrast')
    else root.classList.remove('high-contrast')
    // dyslexia font
    if (dyslexia) root.classList.add('dyslexic')
    else root.classList.remove('dyslexic')
    // large text
    if (largeText) root.style.fontSize = '18px'
    else root.style.fontSize = ''
    // reduced motion
    if (reduceMotion) root.classList.add('reduced-motion')
    else root.classList.remove('reduced-motion')

  }, [theme, largeText, highContrast, dyslexia, reduceMotion, language])

  const value = {
    theme,
    setTheme,
    largeText,
    setLargeText,
    highContrast,
    setHighContrast,
    dyslexia,
    setDyslexia,
    reduceMotion,
    setReduceMotion,
    language,
    setLanguage
  }

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useA11y = () => useContext(AccessibilityContext)
