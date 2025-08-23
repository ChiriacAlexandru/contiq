import React, { useState } from "react";
import Sidebar from "./contabilitate/components/Sidebar";
import Dashboard from "./contabilitate/pages/dashboard/Dashboard";

const App = () => {
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const renderContent = () => {
    switch (currentPage) {
      case "Dashboard":
        return <Dashboard />;
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {currentPage}
            </h1>
            <p className="text-gray-600">
              Această pagină va fi implementată în curând.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <div className="flex-1 overflow-auto">{renderContent()}</div>
    </div>
  );
};

export default App;
