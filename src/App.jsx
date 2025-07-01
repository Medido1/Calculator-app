import './App.css'
import Calculator from './components/Calculator'
import { useState } from 'react';

function App() {
  const [themeIndex, setThemeIndex] = useState(0);
  const positions = ["left-1", "left-[37%]", "left-[68%]"]; // toggle btn position
  const themes = ["theme-1", "theme-2", "theme-3"]

  return (
    <div className={`min-h-screen bg-[var(--bg-main)] ${themes[themeIndex]}
      flex justify-center items-center`}>
      <Calculator 
        themeIndex = {themeIndex}
        setThemeIndex = {setThemeIndex}
        />
    </div>
    
  )
}

export default App
