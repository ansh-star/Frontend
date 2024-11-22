import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { DarkModeContextProvider } from "./context/darkModeContext";
import { AdminContextProvider } from "./context/adminContext";

ReactDOM.render(
  <React.StrictMode>
    <AdminContextProvider>
      <DarkModeContextProvider>
        <App />
      </DarkModeContextProvider>
    </AdminContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
