import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArrivalsDepartures } from "./pages/ArrivalsDepartures";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="arrdep" element={<div>arrdep</div>} />
          <Route path="fromto" element={<ArrivalsDepartures />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
