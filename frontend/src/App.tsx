import React, { type JSX } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/NavBar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactDetailsPage from "./pages/ContactDetailsPage";
import { useAuth } from "./contexts/AuthContext";
import ContactListPage from "./pages/ContactListPage";
import ContactEditPage from "./pages/ContactEditPage";

const PrivateRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="p-4">
        <Routes>
          <Route path="/" element={<ContactListPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contacts/:id" element={<ContactDetailsPage />} />
          
          <Route
            path="/contacts/:id/edit"
            element={
              <PrivateRoute>
                <ContactEditPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/new"
            element={
              <PrivateRoute>
                <ContactEditPage isNew />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
