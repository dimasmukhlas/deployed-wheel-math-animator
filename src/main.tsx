import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./firebase";
import "katex/dist/katex.min.css";
import "./index.css";

/**
 * Some browser extensions (and embedded IDE previews) post messages like
 * `tabs:outgoing.message.ready` and reject when no listener exists — not from this app.
 * Swallow only that pattern so the console stays usable.
 */
function isExtensionTabMessageNoise(reason: unknown): boolean {
  const msg =
    reason instanceof Error
      ? reason.message
      : typeof reason === "string"
        ? reason
        : reason && typeof reason === "object" && "message" in reason
          ? String((reason as { message: unknown }).message)
          : "";
  return msg.includes("tabs:outgoing.message.ready");
}

window.addEventListener("unhandledrejection", (event) => {
  if (isExtensionTabMessageNoise(event.reason)) {
    event.preventDefault();
  }
});

createRoot(document.getElementById("root")!).render(<App />);
