import React from "react";
import ReactDOM from "react-dom/client"; // Import `createRoot` from React 18
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { CurrentUserProvider } from "contexts/CurrentUserContext";

// Create the root for rendering
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the app using the new API
root.render(
  <React.StrictMode>
    <Router>
      <CurrentUserProvider>
        <App />
      </CurrentUserProvider>
    </Router>
  </React.StrictMode>
);
reportWebVitals();
