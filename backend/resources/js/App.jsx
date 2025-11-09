import React from "react";
import { createRoot } from "react-dom/client";
import Header from "./Layouts/Header.jsx";
import Sidebar from "./Layouts/Sidebar.jsx";
import UserTable from "./Table/userTable.jsx";
import TableApp from "./tableApp.jsx";

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

const userTableContainer = document.getElementById('users-table-container');
if (userTableContainer) {
    const initialData = userTableContainer.getAttribute('data-initial-data');
    const statsData = userTableContainer.getAttribute('data-stats-data');

    // Keep backward compatibility for users table container
    createRoot(userTableContainer).render(
        <UserTable initialData={initialData} statsData={statsData} />
    );
}

const tableContainers = document.querySelectorAll('[data-table-type]');
tableContainers.forEach(container => {
    if (container.id === 'users-table-container') return; // Skip if already handled

    const tableType = container.getAttribute('data-table-type');
    const initialData = container.getAttribute('data-initial-data');
    const statsData = container.getAttribute('data-stats-data');

    if (tableType) {
        const root = createRoot(container);
        // Use TableApp which will pick the correct table component by tableType
        root.render(
           <TableApp tableType={tableType} initialData={initialData} statsData={statsData} />
        );
    }
})

