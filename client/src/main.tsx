import { createRoot } from 'react-dom/client';
import "./index.css";
import App from './App.tsx';
import { connectWS, disconnectWS } from "@/ws-client";

connectWS();
window.addEventListener("beforeunload", () => disconnectWS());

createRoot(document.getElementById('root')!).render(
  <App />
)
