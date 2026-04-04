import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./firebase";
import "katex/dist/katex.min.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);
