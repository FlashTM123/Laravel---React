import React from "react";
import { createRoot } from "react-dom/client";
import Login from "./Login/login.jsx";

// Mount login to its own root so Blade content is preserved
const loginEl = document.getElementById('login-root');
if (loginEl) {
    createRoot(loginEl).render(<Login />);
}
