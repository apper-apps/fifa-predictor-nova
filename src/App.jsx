import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AccessKeyPrompt from "@/components/AccessKeyPrompt";
import Layout from "@/components/pages/Layout";
import HomePage from "@/components/pages/HomePage";

const App = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const ACCESS_KEY = "1989";

  const handleAccessKeySubmit = (key) => {
    if (key === ACCESS_KEY) {
      setHasAccess(true);
      return true;
    }
    return false;
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background text-white">
        <AccessKeyPrompt onSubmit={handleAccessKeySubmit} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </BrowserRouter>
  );
};

export default App;