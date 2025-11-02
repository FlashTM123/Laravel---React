import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'


function App() {
  const [count, setCount] = useState(0)

  return (
   <>
   <div>
    <div className="navbar bg-base-100 shadow-sm">
  <a className="btn btn-ghost text-xl">daisyUI</a>
</div>
   </div>
   </>
  )
}

export default App
