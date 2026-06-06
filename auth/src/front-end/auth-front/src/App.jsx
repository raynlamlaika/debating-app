// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'

import { useState, useRef } from 'react'
import './App.css'

function AuthBox({ authType }) {
  const [value, setValue] = useState('')
  const tokenClientRef = useRef(null)

  const handleChange = (e) => setValue(e.target.value)
  const handleSubmit = (e) => {
    e.preventDefault()
    // basic placeholder behavior — replace with real handlers as needed
    alert(`${authType} submitted: ${value || '(no value)'}`)
  }

  if (authType === 'google') {

    const handleGoogle = async () => {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
        console.log('VITE_GOOGLE_CLIENT_ID=', clientId)
        if (!clientId) {
          alert('VITE_GOOGLE_CLIENT_ID is not set. Add it to your front-end .env')
          return
        }

        if (!window.google) {
          await new Promise((resolve, reject) => {
            const s = document.createElement('script')
            s.src = 'https://accounts.google.com/gsi/client'
            s.onload = () => {
              console.log('gsi client loaded')
              resolve()
            }
            s.onerror = (err) => {
              console.error('Failed to load gsi client', err)
              reject(new Error('Failed to load Google Identity Services script'))
            }
            document.head.appendChild(s)
          })
        } else {
          console.log('window.google already present')
        }
      } catch (err) {
        console.error('Google lib load error:', err)
        alert('Google script load failed: ' + err.message)
        return
      }

      try {
        if (!tokenClientRef.current) {
          tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            scope: 'openid email profile',
            callback: (resp) => {
              console.log('token response', resp)
              if (resp.error) return alert('Google auth error: ' + resp.error)
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: 'Bearer ' + resp.access_token },
              })
                .then((r) => r.json())
                .then((profile) => alert(`Hello ${profile.name} (${profile.email})`))
                .catch((err) => alert('Failed to fetch profile: ' + err))
            },
          })
          console.log('token client created', tokenClientRef.current)
        }

        tokenClientRef.current.requestAccessToken()
      } catch (err) {
        console.error('Token request error', err)
        alert('Google token error: ' + (err.message || err))
      }
    }

    return (
      <div className="auth-box">
        <button className="provider" onClick={handleGoogle}>
          Continue with Google
        </button>
      </div>
    )
  }

  if (authType === 'github') {
    return (
      <div className="auth-box">
        <button className="provider" onClick={() => alert('Redirect to GitHub OAuth')}>
          Continue with GitHub
        </button>
      </div>
    )
  }

  // email or number
  const placeholder = authType === 'number' ? 'Phone number' : 'Email address'
  const inputType = authType === 'number' ? 'tel' : 'email'

  return (
    <form className="auth-box" onSubmit={handleSubmit}>
      <input
        type={inputType}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        required
      />
      <button type="submit">Continue</button>
    </form>
  )
}

function App() {
  const [method, setMethod] = useState('email')

  return (
    <div className="app">
      <header>
        <h1>Auth Demo</h1>
        <p className="subtitle">Choose a sign-in method</p>
      </header>

      <nav className="methods">
        {['email', 'google', 'github', 'number'].map((m) => (
          <button
            key={m}
            className={m === method ? 'active' : ''}
            onClick={() => setMethod(m)}
            aria-pressed={m === method}
          >
            {m === 'number' ? 'Phone' : m.charAt(0).toUpperCase() + m.slice(1)}
          </button>
        ))}
      </nav>

      <main>
        <AuthBox authType={method} />
      </main>
    </div>
  )
}

export default App
