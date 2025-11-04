import React from "react";
import UserTable from "./Table/userTable";

const TableApp = ({ tableType, ...props}) => {
    const renderTable = () => {
        switch (tableType) {
            case "users":
                return <UserTable {...props} />;
        }
    };

    return (
        <div className="p-4">
            {renderTable()}
        </div>
    );
};
export default TableApp;
