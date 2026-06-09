import { useState} from 'react'//, useRef 
import './App.css'
import { AuthBox } from './AuthBox'

function App() {
  const [method, setMethod] = useState('email')

  return (
    <div className="app">
      <div className="app-shell">
        <section className="description-panel">
          {/* <p className="eyebrow">About the app</p> */}
          <h2>debating app</h2>
          <p>
            use deriiction f the best light that it 
            can be used as a platform for debating and discussing various topics.

            It make use of the best light to provide a user-friendly interface for users to engage in debates and discussions. The app may include features such as creating and joining debate rooms, posting arguments and counterarguments, voting on the best arguments, and facilitating real-time discussions. The goal of the app is to foster healthy and constructive debates on a wide range of topics, allowing users to share their opinions and learn from others in a respectful environment.
          </p>
        </section>

        <section className="auth-panel">
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
        </section>
      </div>
    </div>
  )
}

export default App
