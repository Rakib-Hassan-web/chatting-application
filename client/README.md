# Chat Client

React + Vite client for the chat app.

Quick start:

```bash
cd client
npm install
npm run dev
```

If your server runs on a different port or host, set `VITE_SERVER_URL` before running:

Linux / macOS:

```bash
VITE_SERVER_URL=http://localhost:5000 npm run dev
```

Windows (PowerShell):

```powershell
$env:VITE_SERVER_URL = "http://localhost:5000"
npm run dev
```

The minimal app includes `src/components/Chat.jsx`, `MessageList.jsx`, and `MessageInput.jsx` and connects to the backend via Socket.IO.
