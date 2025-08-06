import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
// Prevent Replit banner from loading
window.REPLIT_DEV_BANNER_DISABLED = true;
