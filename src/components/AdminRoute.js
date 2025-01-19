import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { currentUser, userRole, loading } = useAuth();
  const { user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-primary font-semibold">
          Duke ngarkuar...
        </p>
      </div>
    );
  }
  if (!currentUser || userRole !== "admin") {
    return <Navigate to="/kycu" />;
  }

  if (!user) {
    return <Navigate to="/kycu" replace />;
  }

  if (!user.emailVerified) {
    return <Navigate to="/konfirmo-email" replace />;
  }

  return children;
};

export default AdminRoute;
