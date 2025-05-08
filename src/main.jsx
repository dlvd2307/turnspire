import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CombatProvider } from "./context/CombatContext"; // ✅ Required!
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CombatProvider>
      <App />
    </CombatProvider>
  </React.StrictMode>
);
