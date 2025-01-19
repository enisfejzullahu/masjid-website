import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Firebase auth
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firebase Firestore
import axios from "axios";

import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons from react-icons
import DefaultPic from "../assets/DefaultPic.webp";
import MosquesSection from "./MosquesSection";
import UsersSection from "./UsersSection";

import Header from "./reusable/Header";
import Footer from "./reusable/Footer";
import AddMosqueForm from "./forms/AddMosqueForm";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("mosques");
  const [userInfo, setUserInfo] = useState(null);
  const [showProfileCard, setShowProfileCard] = useState(false);
  const [showAddMosqueForm, setShowAddMosqueForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile menu toggle
  const [isMobile, setIsMobile] = useState(false); // To track screen size

  const auth = getAuth();
  const db = getFirestore();

  // Check screen size for responsiveness
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch logged-in user's info
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserInfo({
            name: userData.fullName || "No name",
            email: user.email,
            role: userData.role || "User",
            phoneNumber: userData.phoneNumber,
            profilePic: userData.profilePic || "",
          });
        } else {
          console.log("No such document!");
        }
      } else {
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully!");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleAddMosqueSubmit = async (data) => {
    try {
      const response = await axios.post("/add-mosque", data);
      alert("Mosque added successfully");
      setShowAddMosqueForm(false);
    } catch (error) {
      console.error("Error adding mosque:", error);
      alert("Error adding mosque");
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "mosques":
        return <MosquesSection />;
      case "users":
        return <UsersSection />;
      default:
        return <div>Select a section</div>;
    }
  };

  if (!userInfo) {
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
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header />

      {/* Responsive Menu */}
      {isMobile ? (
        <div className="my-16">
          {/* Navigation Section with Primary Background */}
          <div className="bg-primary text-white p-4">
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <h2 className="text-xl font-bold">Paneli i Administrimit</h2>
              {isMobileMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isMobileMenuOpen && (
              <nav className="mt-4 text-white font-semibold">
                <ul>
                  <li
                    onClick={() => {
                      setActiveSection("mosques");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2 cursor-pointer ${
                      activeSection === "mosques" &&
                      "bg-white text-primary rounded-xl"
                    }`}
                  >
                    Mosques
                  </li>
                  <li
                    onClick={() => {
                      setActiveSection("users");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`p-2 cursor-pointer ${
                      activeSection === "users" &&
                      "bg-white text-primary rounded-xl"
                    }`}
                  >
                    Users
                  </li>
                  <li
                    onClick={() => setShowProfileCard(!showProfileCard)}
                    className="p-2 cursor-pointer"
                  >
                    Profile
                  </li>
                </ul>
              </nav>
            )}
          </div>

          {/* Main Content Section with White Background */}
          <div className="flex-1 p-6 bg-white">
            <h1 className="text-3xl font-bold mb-4">
              Mirë se vini, {userInfo.name}.
            </h1>
            <p className="text-lg text-gray-600">
              Ky është paneli i administrimit të të gjitha xhamive dhe të gjithë
              përdoruesve.
            </p>
            <div className="mt-8">{renderSection()}</div>
          </div>
        </div>
      ) : (
        /* Sidebar for larger screens */
        <div className="flex my-16 border-r-0 border-l-0 border-primary border-2 shadow-lg">
          <aside className="w-64 border-r-2 border-primary text-black flex flex-col justify-between p-4 h-[calc(100vh-100px)]">
            <div>
              <h2 className="text-2xl font-bold">Paneli i Administrimit</h2>
              <nav className="mt-6 text-black font-semibold">
                <ul>
                  <li
                    onClick={() => setActiveSection("mosques")}
                    className={`p-2 cursor-pointer ${
                      activeSection === "mosques" &&
                      "bg-primary rounded-xl text-white"
                    }`}
                  >
                    Mosques
                  </li>
                  <li
                    onClick={() => setActiveSection("users")}
                    className={`p-2 cursor-pointer ${
                      activeSection === "users" &&
                      "bg-primary rounded-xl text-white"
                    }`}
                  >
                    Users
                  </li>
                </ul>
              </nav>
            </div>
            {/* User Info */}
            <div
              className="mt-auto flex items-center justify-between bg-primary py-3 px-2 rounded-lg cursor-pointer"
              onClick={() => setShowProfileCard(!showProfileCard)}
            >
              <div className="flex items-center space-x-1">
                <img
                  src={userInfo.profilePic || DefaultPic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full bg-white p-2"
                />
                <div>
                  <p className="font-semibold text-white px-2">
                    {userInfo.name}
                  </p>
                </div>
              </div>
              <FaChevronDown className="text-white" />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold">
              Mirë se vini, {userInfo.name}.
            </h1>
            <p className="text-lg text-gray-600">
              Ky është paneli i administrimit të të gjitha xhamive dhe të gjithë
              përdoruesve.
            </p>
            <div className="mt-8">{renderSection()}</div>
          </div>
        </div>
      )}

      <AddMosqueForm
        isOpen={showAddMosqueForm}
        onClose={() => setShowAddMosqueForm(false)}
        onSubmit={handleAddMosqueSubmit}
      />

      {showProfileCard && (
        <div
          className="absolute bottom-0 left-0 bg-white shadow-lg rounded-lg p-6 w-full sm:w-64 border border-gray-300 transition-all duration-300 ease-in-out"
          style={{ zIndex: 9999 }}
        >
          <button
            onClick={() => alert("Edit Profile clicked")}
            className="w-full py-2 text-center bg-blue-500 text-white rounded-lg mb-4"
          >
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2 text-center bg-red-500 text-white rounded-lg"
          >
            Logout
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
