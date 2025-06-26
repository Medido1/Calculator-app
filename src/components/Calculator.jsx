import { useEffect, useState } from "react";

function Calculator() {
  const [calcInput, setCalcInput] = useState("")
  const [themeIndex, setThemeIndex] = useState(0);

  const positions = ["left-1", "left-[37%]", "left-[68%]"]; // toggle btn position
  const themes = ["theme-1", "theme-2", "theme-3"]

  function handleToggle() {
    setThemeIndex((prev) => (prev + 1) % positions.length);
  }

  useEffect(() => {/* load last used them or preferd theme */
    const savedTheme = localStorage.getItem("theme"); 
    if (savedTheme && themes.includes(savedTheme)) {
      const themeIndex = themes.indexOf(savedTheme)
      setThemeIndex(themeIndex)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const defaultTheme = prefersDark ? 2: 0;
      setThemeIndex(defaultTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", themes[themeIndex])
  }, [themeIndex])

  const inputClass = `bg-[var(--bg-screen)] rounded-lg w-full text-right 
    h-20 text-[var(--text-header)] px-4 py-6 font-bold text-4xl outline-0`
  const buttonClass = `bg-[var(--key-neutral-bg)] font-bold text-[var(--text-primary)] 
  rounded-md text-3xl shadow-[0_4px_0_var(--key-neutral-shadow)] h-14 flex 
  justify-center items-center`
  const keyClass = `font-bold text-[var(--text-white)] text-lg
    rounded-md flex justify-center items-center`
  const toggleBtnClass = `absolute rounded-[50%] bg-[var(--key-accent-bg)] w-[20%] 
    aspect-square top-1 ${positions[themeIndex]} transition-all duration-300`

  return (
    <main className={`font_league px-6 py-8 bg-[var(--bg-main)] ${themes[themeIndex]}`} >
      <div className="flex justify-between items-center text-[var(--text-header)]">
        <h1 className="text-2xl font-bold">calc</h1>
        <div className="flex gap-4 text-xs">
          <p className="uppercase self-end mb-1">Theme</p>
          <div>
            <div className="ml-2 flex gap-5 mb-0.5">
              <p>1</p>
              <p>2</p>
              <p>3</p>
            </div>
            <div 
              onClick={handleToggle}
              className="bg-[var(--bg-toggle-keypad)] rounded-xl h-6 w-[80px] relative">
              <button  className={toggleBtnClass}></button>
            </div>
          </div>
        </div>
      </div>
      <div className="my-4">
        <label htmlFor="calc"></label>
        <input
          className={inputClass}
          type="text" 
          id="calc"
          value={calcInput}
          onChange={(e)=> setCalcInput(e.target.value)}
        />
      </div>
      <div className="bg-[var(--bg-screen)] p-6 rounded-lg grid grid-cols-4 grid-rows-5 gap-4">
        <button className={buttonClass}>7</button>
        <button className={buttonClass}>8</button>
        <button className={buttonClass}>9</button>
        <button 
          className={`${keyClass} bg-[var(--key-bg)] shadow-[0_4px_0_var(--key-shadow)]`}>
            DEL
          </button>
        <button className={buttonClass}>4</button>
        <button className={buttonClass}>5</button>
        <button className={buttonClass}>6</button>
        <button className={buttonClass}>+</button>
        <button className={buttonClass}>1</button>
        <button className={buttonClass}>2</button>
        <button className={buttonClass}>3</button>
        <button className={buttonClass}>-</button>
        <button className={buttonClass}>.</button>
        <button className={buttonClass}>0</button>
        <button className={buttonClass}>/</button>
        <button className={buttonClass}>x</button>
        <button 
          className={`${keyClass} uppercase col-span-2 bg-[var(--key-bg)]
           shadow-[0_4px_0_var(--key-shadow)]`}>
            Reset
          </button>
        <button 
          className={`${keyClass} 
          col-span-2 bg-[var(--key-accent-bg)] shadow-[0_4px_0_var(--key-accent-shadow)]
          ${themeIndex === 2 ? "text-black" : "text-white"}`}>
            =
        </button>
      </div>

    </main>
  )
}

export default Calculator;