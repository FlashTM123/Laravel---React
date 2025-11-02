import React from "react";
import { createRoot } from "react-dom/client";
import Header from "../views/Admins/Layouts/Header.jsx";
import Sidebar from "../views/Admins/Layouts/Sidebar.jsx";

// Mount header to its own root so Blade content is preserved
const headerEl = document.getElementById('header-root');
if (headerEl) {
    createRoot(headerEl).render(<Header />);
}

// Mount sidebar to its own root so it does not replace Blade content
const sidebarEl = document.getElementById('sidebar-root');
if (sidebarEl) {
    createRoot(sidebarEl).render(<Sidebar />);
}

