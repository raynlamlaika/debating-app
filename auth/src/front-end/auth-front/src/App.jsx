// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import './App.css'


function AuthBox({ authType })
{
  return (
    <div className="auth-box">
      {authType === "email" && <input type="text" placeholder="Email" />}
      {authType === "google" && <button>Continue with Google</button>}
      {authType === "github" && <button>Continue with GitHub</button>}
      {authType === "number" && <input type="text" placeholder="Phone Number" />}
    </div>
  );
}


function App()
{

  return(
    <>
      <div>hello lizami</div>
    </>
  )
}

export default App
