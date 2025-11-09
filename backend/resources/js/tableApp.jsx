import React from "react";
import UserTable from "./Table/userTable";
import CustomerTable from "./Table/customerTable";
import CategoriesTable from "./Table/categoriesTable";

const TableApp = ({ tableType, ...props}) => {
    const renderTable = () => {
        switch (tableType) {
            case "users":
                return <UserTable {...props} />;
            // case "customers":
            case "customers":
                return <CustomerTable {...props} />;
            case "categories":
                return <CategoriesTable {...props} />;
        }
    };

    return (
        <div className="p-4">
            {renderTable()}
        </div>
    );
};
export default TableApp;
