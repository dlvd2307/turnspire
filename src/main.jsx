import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import LandingPage from "./LandingPage"; // You'll create this component next
import { CombatProvider } from "./context/CombatContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/app"
          element={
            <CombatProvider>
              <App />
            </CombatProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
