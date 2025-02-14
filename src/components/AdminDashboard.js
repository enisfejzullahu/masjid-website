import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Firebase auth
import { getFirestore, doc, getDoc } from "firebase/firestore"; // Firebase Firestore
import axios from "axios";

import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons from react-icons
import { FaMosque, FaUsers, FaUserCircle } from "react-icons/fa";
import {
  FaUsers as FaUsersActive,
  FaMosque as FaMosqueActive,
} from "react-icons/fa";

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
  const currentUser = auth.currentUser;

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
      if (currentUser) {
        currentUser
          .getIdToken()
          .then((token) => {
            console.log("Firebase ID Token:", token);
          })
          .catch((error) => {
            console.error("Error getting ID token:", error);
          });
      } else {
        console.error("No user is currently logged in.");
      }

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
        <div className="flex flex-col lg:flex-row my-16 lg:border-r-0 lg:border-l-0 lg:border-primary lg:border-2 shadow-lg ">
          {/* Navigation Section with Primary Background */}
          <div className="">
            <div
              className={`bg-primary text-white py-3 px-4 cursor-pointer flex justify-between items-center rounded-t-lg`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <h2 className="text-lg font-bold">Paneli i Administrimit</h2>
              {isMobileMenuOpen ? (
                <FaChevronUp className="w-6 h-6" />
              ) : (
                <FaChevronDown className="w-6 h-6" />
              )}
            </div>
            {isMobileMenuOpen && (
              <nav className="bg-white shadow-md transition-all duration-300 overflow-hidden border border-primary rounded-b-lg">
                <ul className="space-y-2 p-4">
                  <li
                    onClick={() => {
                      setActiveSection("mosques");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "mosques" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "mosques" ? (
                      <FaMosqueActive className="mr-2" />
                    ) : (
                      <FaMosque className="mr-2 text-gray-600" />
                    )}
                    Xhamitë
                  </li>
                  <li
                    onClick={() => {
                      setActiveSection("users");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "users" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "users" ? (
                      <FaUsersActive className="mr-2" />
                    ) : (
                      <FaUsers className="mr-2 text-gray-600" />
                    )}
                    Përdoruesit
                  </li>
                  <li
                    onClick={() => setShowProfileCard(!showProfileCard)}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "" &&
                      showProfileCard &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    <FaUserCircle className="mr-2" />
                    Profili
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
          <aside
            className={`hidden lg:block w-64 border-r-2 border-primary text-black flex flex-col justify-between p-4 h-[calc(100vh-100px)] fixed lg:static bg-white z-40 lg:w-64 transition-transform duration-300`}
          >
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
              className="mt-12 flex items-center justify-between bg-primary py-3 px-2 rounded-lg cursor-pointer shadow-lg"
              onClick={() => setShowProfileCard(!showProfileCard)}
            >
              <div className="flex items-center space-x-1">
                <img
                  src={userInfo.photoURL || DefaultPic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full bg-white p-1"
                />
                <div>
                  <p className="font-semibold text-white px-2">
                    {userInfo.name || "Administrator"}
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
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfileCard(false); // Close modal when clicking outside
            }
          }}
        >
          <div
            className="bg-white shadow-lg rounded-lg p-6 w-full sm:w-80 max-w-sm border border-gray-200 transition-all transform-gpu relative"
            style={{ zIndex: 1000 }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">Profili</h3>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setShowProfileCard(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* User Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={userInfo?.photoURL || DefaultPic}
                  alt="Profile"
                  className="w-16 h-16 rounded-full bg-gray-200"
                />
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    {userInfo.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">
                    {userInfo.role || "N/A"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-gray-700 font-medium">
                  Email: {userInfo.email || "N/A"}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              className="mt-6 w-full px-4 py-2 text-red-600 font-medium bg-red-100 border border-red-200 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              onClick={handleLogout}
            >
              Dil
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
