import React from "react";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";
import { auth } from "../firebaseConfig"; // Import Firebase auth
import { useNavigate } from "react-router-dom"; // For navigation

const NoMosqueAssigned = () => {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out from Firebase
      navigate("/kycu"); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-xl font-bold text-red-600 mb-4">
          Ju Ende Nuk Keni Marrë Administrimin e Xhamisë Suaj!
        </h1>
        <p className="text-gray-700 mb-6">
          Ju lutemi kontaktoni administratorin për të përfunduar procesin e caktimit.
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Dil nga Llogaria
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default NoMosqueAssigned;
