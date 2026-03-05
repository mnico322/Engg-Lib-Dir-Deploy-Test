import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from "axios"; // 🔥 Import axios

// ✅ Auth context (local DB auth)
import { AuthProvider } from "./context/AuthContext";

// ✅ react-hot-toast (single toast system)
import { Toaster } from "react-hot-toast";

// 🔥 GLOBAL SETTING: This allows cookies to be sent with every request
// This is likely why you were getting 401s on refresh!
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </AuthProvider>
  </React.StrictMode>
);