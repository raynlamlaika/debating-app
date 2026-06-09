import { useEffect, useState } from 'react'
import './App.css'


export function AuthBox({ authType })
{
    const [googleStatus, setGoogleStatus] = useState('idle')
    const [googleUser, setGoogleUser] = useState(null)

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

    useEffect(() => {
        if (authType !== 'google') {
            return
        }

        if (!clientId) {
            return
        }

        let cancelled = false

        const loadGoogleScript = () => new Promise((resolve, reject) => {
            if (window.google?.accounts?.oauth2) {
                resolve()
                return
            }

            const existingScript = document.querySelector('script[data-google-identity-services]')
            if (existingScript) {
                existingScript.addEventListener('load', resolve, { once: true })
                existingScript.addEventListener('error', reject, { once: true })
                return
            }

            const script = document.createElement('script')
            script.src = 'https://accounts.google.com/gsi/client'
            script.async = true
            script.defer = true
            script.dataset.googleIdentityServices = 'true'
            script.addEventListener('load', resolve, { once: true })
            script.addEventListener('error', reject, { once: true })
            document.head.appendChild(script)
        })

        const fetchGoogleProfile = async (accessToken) => {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })

            if (!response.ok) {
                throw new Error('Unable to load Google profile')
            }

            return response.json()
        }

        const setupGoogleAuth = async () => {
            try {
                setGoogleStatus('loading')
                await loadGoogleScript()

                if (cancelled) {
                    return
                }

                const tokenClient = window.google.accounts.oauth2.initTokenClient({
                    client_id: clientId,
                    scope: 'openid email profile',
                    callback: async (response) => {
                        try {
                            setGoogleStatus('loading-profile')
                            const profile = await fetchGoogleProfile(response.access_token)

                            if (cancelled) {
                                return
                            }

                            setGoogleUser(profile)
                            setGoogleStatus('ready')
                        } catch {
                            if (!cancelled) {
                                setGoogleStatus('error')
                                setGoogleUser(null)
                            }
                        }
                    },
                })

                if (!cancelled) {
                    setGoogleStatus('ready')
                }

                return tokenClient
            } catch {
                if (!cancelled) {
                    setGoogleStatus('error')
                    setGoogleUser(null)
                }
                return null
            }
        }

        const initPromise = setupGoogleAuth()

        return () => {
            cancelled = true
            initPromise.catch(() => {})
        }
    }, [authType, clientId])

    const handleGoogleSignIn = () => {
        if (!window.google?.accounts?.oauth2) {
            setGoogleStatus('error')
            return
        }

        try {
            setGoogleStatus('requesting')
            const tokenClient = window.google.accounts.oauth2.initTokenClient({
                client_id: clientId,
                scope: 'openid email profile',
                callback: async (response) => {
                    try {
                        setGoogleStatus('loading-profile')
                        const profileResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                            headers: {
                                Authorization: `Bearer ${response.access_token}`,
                            },
                        })

                        if (!profileResponse.ok) {
                            throw new Error('Unable to load Google profile')
                        }

                        const profile = await profileResponse.json()
                        setGoogleUser(profile)
                        setGoogleStatus('ready')
                    } catch {
                        setGoogleUser(null)
                        setGoogleStatus('error')
                    }
                },
            })

            tokenClient.requestAccessToken()
        } catch {
            setGoogleUser(null)
            setGoogleStatus('error')
        }
    }

    if (authType === 'google')
        {return(
        <section className="auth-box auth-box--provider">
            <div className="provider-copy">
                <p className="eyebrow">Google access</p>
                <h2>Continue with Google</h2>
                <p>
                    Sign in with your Google account to get into the debate platform quickly and securely.
                </p>
            </div>
            <div className="google-auth">
                <button className="google-btn" type="button" onClick={handleGoogleSignIn} disabled={googleStatus === 'loading' || googleStatus === 'requesting' || googleStatus === 'loading-profile' || !clientId}>
                    <span className="google-logo" aria-hidden="true">
                        <svg viewBox="0 0 24 24" role="img" focusable="false">
                            <path fill="#EA4335" d="M12 10.2v3.95h5.62c-.25 1.31-1 2.42-2.12 3.17v2.64h3.42c2-1.84 3.15-4.55 3.15-7.76 0-.75-.07-1.48-.2-2.2H12z" />
                            <path fill="#34A853" d="M5.74 14.18A7.46 7.46 0 0 1 5.35 12c0-.76.13-1.5.39-2.18V7.18H2.32A11.98 11.98 0 0 0 0 12c0 1.92.46 3.73 1.28 5.33l4.46-3.15z" />
                            <path fill="#FBBC05" d="M12 4.75c1.47 0 2.79.5 3.83 1.47l2.88-2.88A11.58 11.58 0 0 0 12 0C7.69 0 3.96 2.46 2.32 6.02l3.42 2.64C6.53 6.45 8.97 4.75 12 4.75z" />
                            <path fill="#4285F4" d="M12 24c3.22 0 5.94-1.06 7.93-2.89l-3.42-2.64c-.95.63-2.17 1-4.51 1-3.03 0-5.47-1.7-6.26-4.21l-3.42 2.64C3.96 21.54 7.69 24 12 24z" />
                        </svg>
                    </span>
                    <span>{googleStatus === 'loading' || googleStatus === 'requesting' || googleStatus === 'loading-profile' ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
            </div>
            <p className="supporting-text">
                {clientId ? 'Using the Google client ID from your .env file.' : 'Missing VITE_GOOGLE_CLIENT_ID in .env.'}
            </p>
            {googleStatus === 'ready' && googleUser && (
                <div className="auth-success">
                    <strong>Signed in as {googleUser.name || googleUser.email}</strong>
                    <span>{googleUser.email}</span>
                </div>
            )}
            {googleStatus === 'error' && (
                <p className="auth-error">Google sign-in could not be started. Check the client ID and browser console.</p>
            )}
            {!clientId && (
                <p className="auth-error">Set VITE_GOOGLE_CLIENT_ID in .env, then restart the dev server.</p>
            )}
        </section>)}
    if (authType === 'email')
        {return(<>
            <input type="email" placeholder="Email" className="email-input" />
            <input type="password" placeholder="Password" className="password-input" />
            <button className="email-btn">Sign in with Email</button>
        </>)}
    if (authType === 'github')
        {return(<h1>GitHub OAuth coming soon...</h1> )}
    if (authType === 'number')
        {return(<>
            <input type="tel" placeholder="Phone Number" className="phone-input" />
            <input type="password" placeholder="Password" className="password-input" />
            <button className="phone-btn">Sign in with Phone</button>
        </>)}
     return(<h1>Invalid auth type</h1> )
}


