import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import "./index.css";
import App from "./App";

console.log("🚀 [DEBUG] Drilling Calculator Starting...");

const container = document.getElementById("root");
if (!container) {
  console.error("❌ [DEBUG] Root container not found!");
} else {
  console.log("✅ [DEBUG] Root container found, rendering...");
  createRoot(container).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
}
