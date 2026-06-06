# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Google Sign-in (development)

This project includes a simple "Continue with Google" flow using Google Identity Services (client-side token request). To enable it locally:

1. Create OAuth credentials in the Google Cloud Console (OAuth 2.0 Client IDs). Set the application type to "Web application" and add your development origin to the Authorized JavaScript origins, for example `http://localhost:5173`.
2. Add the client ID to a Vite env file in the front-end project root as `VITE_GOOGLE_CLIENT_ID`:

```bash
# in /home/rlamlaik/goinfre/debating-app/auth/src/front-end/auth-front/.env
VITE_GOOGLE_CLIENT_ID=YOUR_CLIENT_ID.apps.googleusercontent.com
```

3. Restart the dev server (`npm run dev`). The app will load Google's client library at runtime and request an access token when you click "Continue with Google".

Notes:
- The front-end uses `import.meta.env.VITE_GOOGLE_CLIENT_ID` (Vite requires `VITE_` prefix for exposed env vars). Do not commit secrets to source control.
- For production you should use a secure server-side OAuth flow (authorization code + PKCE) and exchange codes on the backend. The current implementation is suitable only for quick dev/testing.
