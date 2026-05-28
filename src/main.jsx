import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />

    <Toaster
      position="top-center"
      closeButton
      expand={false}
      richColors={false}
      toastOptions={{
        duration: 4000,

        style: {
          borderRadius: "24px",
          padding: "14px 16px",

          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(14px) saturate(140%)",

          border: "1px solid rgba(255,255,255,0.5)",

          boxShadow:
            "0 10px 35px rgba(249,115,22,0.12)",

          color: "#ff5e00",
        },
      }}
    />
  </StrictMode>,
)
