import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutUs";
import ContactPage from "./pages/ContactUs";
import MosquesPage from "./pages/MosquesPage";
import Dashboard from "./components/Dashboard";
import LogIn from "./components/LogIn";
import Signup from "./components/SignUp";
import ConfirmEmail from "./components/ConfirmEmail";
import AdminRoute from "./components/AdminRoute";
import AdminPanel from "./components/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import Unauthorized from "./components/Unauthorized";
import MosqueDetailPage from "./pages/MosqueDetailPage";
import ResetPassword from "./components/ResetPassword";
import MosqueDetails from "./components/MosqueDetails";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthenticated(!!user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rrethnesh" element={<AboutPage />} />
        <Route path="/kontakti" element={<ContactPage />} />
        <Route path="/xhamite" element={<MosquesPage />} />
        <Route path="/xhamite/:id" element={<MosqueDetailPage />} />

        <Route path="/signup" element={<Signup />} />
        <Route path="/kycu" element={<LogIn />} />

        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              userRole === "super-admin" ? (
                <AdminDashboard /> // Super-admin dashboard
              ) : userRole === "mosque-admin" ? (
                <Dashboard /> // Mosque-admin dashboard
              ) : (
                <Navigate to="/unauthorized" /> // Unauthorized user
              )
            ) : (
              <Navigate to="/kycu" /> // Redirect unauthenticated users to login
            )
          }
        />
        <Route path="/dashboard/mosque/:id" element={<MosqueDetails/>} />

        <Route path="/konfirmo-email" element={<ConfirmEmail />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
