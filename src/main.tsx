import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./providers/ThemeProvider.tsx";
import "./index.css";
// import App from "./App.tsx";

import { BrowserRouter } from "react-router-dom";

import RoutesNav from "./RoutesNav.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <RoutesNav />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
