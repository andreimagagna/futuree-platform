import { createRoot } from "react-dom/client";
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
