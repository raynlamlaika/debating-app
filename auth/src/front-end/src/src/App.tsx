import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const tokenClientRef = useRef<any>(null)

  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

  useEffect(() => {
    if (!CLIENT_ID) return

    // load Google Identity Services script
    const existing = document.querySelector('script[data-google-client]')
    if (!existing) {
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.setAttribute('data-google-client', 'loaded')
      script.onload = () => {
        try {
          tokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: 'openid email profile',
            callback: (tokenResponse: any) => {
              if (tokenResponse?.access_token) {
                fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                  headers: {
                    Authorization: `Bearer ${tokenResponse.access_token}`,
                  },
                })
                  .then((r) => r.json())
                  .then((data) => {
                    setStatus(`Signed in as ${data.email || data.name}`)
                  })
                  .catch(() => {
                    setStatus('Signed in, but failed to fetch profile')
                  })
              } else {
                setStatus('No access token received')
              }
            },
          })
        } catch (err) {
          // initialization failed
          setStatus('Google SDK init failed')
        }
      }
      document.head.appendChild(script)
    } else if ((window as any).google && !(tokenClientRef.current)) {
      try {
        tokenClientRef.current = (window as any).google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: 'openid email profile',
          callback: (tokenResponse: any) => {
            if (tokenResponse?.access_token) {
              fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
              })
                .then((r) => r.json())
                .then((data) => setStatus(`Signed in as ${data.email || data.name}`))
                .catch(() => setStatus('Signed in, but failed to fetch profile'))
            } else {
              setStatus('No access token received')
            }
          },
        })
      } catch (err) {
        setStatus('Google SDK init failed')
      }
    }
    // cleanup not needed for the script
  }, [CLIENT_ID])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus(`Logging in as ${email || 'your account'}...`)
  }

  const handleGoogleSignIn = () => {
    if (!CLIENT_ID) {
      setStatus('Google client ID not configured. Set VITE_GOOGLE_CLIENT_ID in .env')
      return
    }

    if (!tokenClientRef.current) {
      setStatus('Google SDK not loaded yet. Try again in a moment.')
      return
    }

    try {
      tokenClientRef.current.requestAccessToken({ prompt: 'consent' })
      setStatus('Opening Google sign-in...')
    } catch (err) {
      setStatus('Failed to open Google sign-in')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <div className="auth-copy">
          <span className="eyebrow">Debating app</span>
          <h1 id="auth-title">Log in to continue</h1>
          <p>
            Use your email and password, or continue with Google to access your
            account.
          </p>

          <div className="feature-list" aria-label="Highlights">
            <div>Fast access</div>
            <div>Secure login</div>
            <div>Google sign-in</div>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            <span>Email</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </label>

          <div className="auth-actions">
            <button type="submit" className="primary-button">
              Login
            </button>
            <button
              type="button"
              className="google-button"
              onClick={handleGoogleSignIn}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91c1.7-1.57 2.69-3.88 2.69-6.62Z"
                />
                <path
                  fill="#4285F4"
                  d="M9 18c2.43 0 4.47-.8 5.96-2.16l-2.91-2.26c-.8.54-1.82.86-3.05.86-2.35 0-4.35-1.58-5.06-3.71H.95v2.33A9 9 0 0 0 9 18Z"
                />
                <path
                  fill="#FBBC05"
                  d="M3.94 10.73A5.4 5.4 0 0 1 3.65 9c0-.6.1-1.18.29-1.73V4.94H.95A9 9 0 0 0 0 9c0 1.45.35 2.82.95 4.06l2.99-2.33Z"
                />
                <path
                  fill="#34A853"
                  d="M9 3.58c1.32 0 2.5.45 3.43 1.34l2.57-2.57A8.86 8.86 0 0 0 9 0 9 9 0 0 0 .95 4.94l2.99 2.33C4.65 5.16 6.65 3.58 9 3.58Z"
                />
              </svg>
              Sign in with Google
            </button>
          </div>

          <p className="status-message" aria-live="polite">
            {status || 'By signing in, you agree to continue to the app.'}
          </p>
        </form>
      </section>
    </main>
  )
}

export default App
