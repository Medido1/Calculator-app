import { useEffect, useRef, useState } from "react";

function Calculator({themeIndex, setThemeIndex}) {
  const [calcInput, setCalcInput] = useState("");
  const [startingNew, setStartingNew] = useState(false);
  const [storedValue, setStoredValue] = useState("");
  const [operator, setOperator] = useState("");

  const positions = ["left-1", "left-[37%]", "left-[68%]"]; // toggle btn position
  const themes = ["theme-1", "theme-2", "theme-3"]

  function handleToggle() {
    setThemeIndex((prev) => (prev + 1) % positions.length);
  }

  useEffect(() => {/* load last used them or preferd theme */
    const savedTheme = localStorage.getItem("theme"); 
    if (savedTheme && themes.includes(savedTheme)) {
      const savedIndex = themes.indexOf(savedTheme)
      setThemeIndex(savedIndex)
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const defaultTheme = prefersDark ? 2: 0;
      setThemeIndex(defaultTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("theme", themes[themeIndex])
  }, [themeIndex])

  /* clasess */
  const inputClass = `bg-[var(--bg-screen)] rounded-lg w-full text-right 
    h-20 text-[var(--text-header)] px-4 py-6 font-bold text-4xl outline-0 
    focus:border-[var(--focus)] focus:border-2`
  const buttonClass = `bg-[var(--key-neutral-bg)] font-bold text-[var(--text-primary)] 
  rounded-md text-3xl shadow-[0_4px_0_var(--key-neutral-shadow)] h-14 flex 
  justify-center items-center`
  const keyClass = `font-bold text-[var(--text-white)] text-lg
    rounded-md flex justify-center items-center`
  const toggleBtnClass = `absolute rounded-[50%] bg-[var(--key-accent-bg)] w-[20%] 
    aspect-square top-1 ${positions[themeIndex]} transition-all duration-300`

  function deleteNumber() {
    if (calcInput.trim() === "") return;
    setCalcInput(prev => prev.slice(0, -1));
  }

  function resetCalc() {
    setCalcInput("")
    setStoredValue("");
    setOperator(""); // Reset operator as well
    setStartingNew(false); // Reset startingNew
  }

  const btnValues = [
    7, 8, 9, "DEL",
    4, 5, 6, "+",
    1, 2, 3, "-",
    ".", 0, "/", "x",
  ];

  function handleInput(btn) {
    const num1 = parseFloat(storedValue)
    const num2 = parseFloat(calcInput)

    if (btn === "DEL") {
      deleteNumber();
      return;
    } 
    
    if (btn === "=") {
        displayResults();
        return;
    }

    if (!isNaN(btn) || btn === ".") {
      if (startingNew) {
        setCalcInput(btn.toString());
        setStartingNew(false);
      } else {
        if (btn === "." && calcInput.includes(".")) return; /* prevent multiple dots */
        if (btn === 0 && calcInput === "0") return; /* prevent multiple leading zeros */
        setCalcInput(prev => prev + btn);
      }
    }  
    else { // It's an operator
      if (!isNaN(num1) && !isNaN(num2) && operator) { // If there's a stored value, a current input, and an operator
        const result = computeResult(num1, num2, operator);
        setCalcInput(result.toString());
        setStoredValue(result);
        setStartingNew(true);
        setOperator(btn);
      } else if (!isNaN(num2)) { // If only a current input, store it and set operator
        setStoredValue(calcInput);
        setStartingNew(true);
        setOperator(btn);
      } else { // If nothing in input, but an operator is pressed, just set the operator
        setOperator(btn);
      }
    }
  }

  function computeResult(n1, n2, op) {
    if (op === "+") return n1 + n2;
    if (op === "-") return n1 - n2;
    if (op === "x") return n1 * n2;
    if (op === "/") return n2 !== 0 ? n1 / n2 : "error"
    return n2; // Should not happen if an operator is provided
  }

  function displayResults() {
    const num1 = parseFloat(storedValue)
    const num2 = parseFloat(calcInput)

    if (isNaN(num1) || isNaN(num2) || !operator) return; // Don't calculate if operands or operator are missing

    const result = computeResult(num1, num2, operator)
    setCalcInput(result.toString())
    setStoredValue("");
    setOperator("")
    setStartingNew(true); // Ready for a new calculation
  }

  function handleKeyDown(e) { 
    e.preventDefault(); // Prevent default browser behavior for all handled keys

    const key = e.key;

    if (key >= '0' && key <= '9') {
      handleInput(parseInt(key));
    } else if (key === '.') {
      handleInput('.');
    } else if (key === '+') {
      handleInput('+');
    } else if (key === '-') {
      handleInput('-');
    } else if (key === '*') { 
      handleInput('x');
    } else if (key === '/') {
      handleInput('/');
    } else if (key === 'Enter' || key === '=') {
      handleInput('=');
    } else if (key === 'Backspace') {
      handleInput('DEL');
    } else if (key === 'Escape') { // Common key for clearing
      resetCalc();
    }
  }

  /* focus on the input when keyboard is used */
  const inputRef = useRef(null)
  useEffect(() => {
    function handleGlobalKeyDown(e) {
      const active = document.activeElement;
      const isInput = active && active.tagName === "INPUT"
      if (!isInput) {
        inputRef.current?.focus();
      }
    }

    window.addEventListener("keydown", handleGlobalKeyDown)
    return () => window.removeEventListener("keydown", handleGlobalKeyDown)
  },[])
 
  return (
    <main className={`font_league px-6 py-8 bg-[var(--bg-main)] ${themes[themeIndex]}
      max-w-[500px]`} >
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
        <label htmlFor="calc" className="sr-only">Input field</label>
        <input
          ref={inputRef}
          className={inputClass}
          type="text" // Changed type to text
          id="calc"
          value={calcInput}
          readOnly // Make it read-only as input is managed by handleKeyDown
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="bg-[var(--bg-screen)] p-6 rounded-lg grid grid-cols-4 grid-rows-5 gap-4">
        {btnValues.map((btn, i) => (
          <button 
            key={i}
            className={btn === "DEL" 
              ? `bg-[var(--key-bg)] shadow-[0_4px_0_var(--key-shadow)] ${keyClass}` 
              :buttonClass
            }
            onClick={() =>handleInput(btn)}>
              {btn}
          </button>
        ))}
        <button 
          onClick={resetCalc}
          className={`${keyClass} uppercase col-span-2 bg-[var(--key-bg)]
           shadow-[0_4px_0_var(--key-shadow)]`}>
            Reset
          </button>
        <button 
          onClick={() => handleInput("=")}
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