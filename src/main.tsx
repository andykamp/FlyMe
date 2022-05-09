import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ArrivalsDepartures } from "./pages/arrivals-departures";
import { FromTo } from "./pages/from-to";
import { Home } from "./pages/home";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="arrdep" element={<ArrivalsDepartures />} />
          <Route path="fromto" element={<FromTo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
