import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {GoogleOAuthProvider} from '@react-oauth/google'
import clientSecrets from '/home/lamlaika/debating-app/auth/src/front-end/secrets/client_secret_500173486764-o29h657sr1jk10asj5fgg4kho77ldi43.apps.googleusercontent.com.json'

const CLIENT_ID = clientSecrets.web.client_id

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
    <App />
    </GoogleOAuthProvider>

  </StrictMode>,
)
