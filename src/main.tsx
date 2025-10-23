import { createRoot } from "react-dom/client";
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import App from "./App.tsx";
import "./index.css";

// Suprimir erros de removeChild que ocorrem durante unmount de portals
window.addEventListener('error', (event) => {
  if (
    event.error?.message?.includes('removeChild') ||
    event.error?.name === 'NotFoundError' ||
    event.message?.includes('removeChild')
  ) {
    console.warn('[Global Error Handler] Suprimindo erro de removeChild:', event.error?.message || event.message);
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
});

// Suprimir promise rejections de removeChild
window.addEventListener('unhandledrejection', (event) => {
  if (
    event.reason?.message?.includes('removeChild') ||
    event.reason?.name === 'NotFoundError'
  ) {
    console.warn('[Global Rejection Handler] Suprimindo erro de removeChild:', event.reason?.message);
    event.preventDefault();
    return false;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
