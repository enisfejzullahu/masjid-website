import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { logout } from "../services/authService";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import {
  FaChevronDown,
  FaChevronUp,
  FaChevronRight,
  FaChevronLeft,
} from "react-icons/fa"; // Updated icons

import {
  FaHome,
  FaBell,
  FaCalendarAlt,
  FaHistory,
  FaDonate,
  FaMosque,
} from "react-icons/fa";
import {
  FaHome as FaHomeActive,
  FaBell as FaBellActive,
  FaCalendarAlt as FaCalendarAltActive,
  FaHistory as FaHistoryActive,
  FaDonate as FaDonateActive,
  FaMosque as FaMosqueActive,
} from "react-icons/fa";

import Header from "./reusable/Header";
import Footer from "./reusable/Footer";
import DefaultPic from "../assets/DefaultPic.webp";

import axios from "axios";
import Paneli from "./Paneli";
import Njoftimet from "./Njoftimet";
import Eventet from "./Eventet";
import Historiku from "./Historiku";
import Donacione from "./Donacione";
import ProfiliXhamise from "./ProfiliXhamise";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [mosqueId, setMosqueId] = useState("");
  const [mosqueData, setMosqueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("njoftimet"); // Track active section
  const [showProfileCard, setShowProfileCard] = useState(false); // Toggle profile card visibility
  const [role, setRole] = useState(null); // State for role
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility

  const navigate = useNavigate();
  const auth = getAuth();
  const firestore = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            const userInfo = userDoc.data();
            setUserInfo({
              fullName: userInfo.fullName || "No name",
              email: userInfo.email,
              role: userInfo.role || "User",
              phoneNumber: userInfo.phoneNumber,
              mosqueId: userInfo.mosqueId || "N/A",
            });
            setMosqueId(userInfo.mosqueId || "N/A");

            // Fetch the role from Firestore or custom claims
            const currentUserRole = userInfo.role;
            setRole(currentUserRole);
          } else {
            console.error("No user data found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/kycu"); // Redirect to login if no user
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/kycu");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderSection = () => {
    if (role === "mosque-admin") {
      // If user is an admin, show all sections
      switch (activeSection) {
        case "njoftimet":
          return <Njoftimet mosqueId={mosqueId} />;
        case "eventet":
          return <Eventet />;
        case "historiku":
          return <Historiku mosqueId={mosqueId} />;
        case "donacione":
          return <Donacione />;
        case "profiliXhamise":
          return <ProfiliXhamise />;
        default:
          return null;
      }
    } else {
      // If user is not an admin, show restricted message
      return (
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-red-500">
            You do not have admin access.
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Contact your administrator for more information.
          </p>
        </div>
      );
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-4 text-lg text-primary font-semibold">
          Duke ngarkuar...
        </p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-col lg:flex-row my-16 lg:border-r-0 lg:border-l-0 lg:border-primary lg:border-2 shadow-lg ">
        {/* NEW CODE */}
        <div className="lg:hidden">
          <div
            className={`bg-primary text-white py-3 px-4 cursor-pointer flex justify-between items-center ${isSidebarOpen ? "rounded-t-lg" : "rounded-lg"}`}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <h2 className="text-lg font-bold">Paneli i Administrimit</h2>
            {isSidebarOpen ? (
              <FaChevronUp className="w-6 h-6" />
            ) : (
              <FaChevronDown className="w-6 h-6" />
            )}
          </div>

          <nav
            className={`bg-white shadow-md transition-all duration-300 overflow-hidden ${
              isSidebarOpen
                ? "max-h-[350px] border border-primary rounded-b-lg"
                : "max-h-0"
            }`}
          >
            <ul className="space-y-2 p-4">
              {role === "mosque-admin" && (
                <>
                  <li
                    onClick={() => setActiveSection("njoftimet")}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "njoftimet" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "njoftimet" ? (
                      <FaBellActive className="mr-2" />
                    ) : (
                      <FaBell className="mr-2 text-gray-600" />
                    )}
                    Njoftimet
                  </li>
                  <li
                    onClick={() => setActiveSection("eventet")}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "eventet" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "eventet" ? (
                      <FaCalendarAltActive className="mr-2" />
                    ) : (
                      <FaCalendarAlt className="mr-2 text-gray-600" />
                    )}
                    Eventet
                  </li>
                  <li
                    onClick={() => setActiveSection("historiku")}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "historiku" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "historiku" ? (
                      <FaHistoryActive className="mr-2" />
                    ) : (
                      <FaHistory className="mr-2 text-gray-600" />
                    )}
                    Historiku
                  </li>
                  <li
                    onClick={() => setActiveSection("donacione")}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "donacione" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "donacione" ? (
                      <FaDonateActive className="mr-2" />
                    ) : (
                      <FaDonate className="mr-2 text-gray-600" />
                    )}
                    Donacione
                  </li>
                  <li
                    onClick={() => setActiveSection("profiliXhamise")}
                    className={`cursor-pointer flex items-center p-1 ${
                      activeSection === "profiliXhamise" &&
                      "bg-primary text-white rounded-lg p-1"
                    }`}
                  >
                    {activeSection === "profiliXhamise" ? (
                      <FaMosqueActive className="mr-2" />
                    ) : (
                      <FaMosque className="mr-2 text-gray-600" />
                    )}
                    Profili i Xhamisë
                  </li>
                </>
              )}
            </ul>

            {/* Profile Card Toggle Button (Added at the bottom) */}
            <div
              className="mt-4 flex items-center justify-between bg-primary py-3 px-2 rounded-lg cursor-pointer"
              onClick={() => setShowProfileCard(!showProfileCard)}
            >
              <div className="flex items-center space-x-1">
                <img
                  src={user?.photoURL || DefaultPic}
                  alt="Profile"
                  className="w-8 h-8 rounded-full bg-white p-1"
                />
                <div>
                  <p className="font-semibold text-white px-2">
                    {userInfo.fullName || "User"}
                  </p>
                </div>
              </div>
              <FaChevronDown className="text-white" />
            </div>
          </nav>
        </div>

        {/* NEW CODE */}

        {/* Sidebar */}
        {/* Sidebar for Larger Screens */}
        <aside
          className={`hidden lg:block w-64 border-r-2 border-primary text-black flex flex-col justify-between p-4 h-[calc(100vh-100px)] fixed lg:static bg-white z-40 lg:w-64 transition-transform duration-300`}
        >
          <div>
            <h2 className="text-2xl font-bold">Paneli i Administrimit</h2>
            <nav className="mt-6 text-black font-semibold">
              <ul>
                {role === "mosque-admin" && (
                  <>
                    <li
                      onClick={() => setActiveSection("njoftimet")}
                      className={`p-2 cursor-pointer flex items-center ${
                        activeSection === "njoftimet" &&
                        "bg-primary rounded-xl text-white"
                      }`}
                    >
                      {activeSection === "njoftimet" ? (
                        <FaBellActive className="mr-2" />
                      ) : (
                        <FaBell className="mr-2" />
                      )}
                      Njoftimet
                    </li>
                    <li
                      onClick={() => setActiveSection("eventet")}
                      className={`p-2 cursor-pointer flex items-center ${
                        activeSection === "eventet" &&
                        "bg-primary rounded-xl text-white"
                      }`}
                    >
                      {activeSection === "eventet" ? (
                        <FaCalendarAltActive className="mr-2" />
                      ) : (
                        <FaCalendarAlt className="mr-2" />
                      )}
                      Eventet
                    </li>
                    <li
                      onClick={() => setActiveSection("historiku")}
                      className={`p-2 cursor-pointer flex items-center ${
                        activeSection === "historiku" &&
                        "bg-primary rounded-xl text-white"
                      }`}
                    >
                      {activeSection === "historiku" ? (
                        <FaHistoryActive className="mr-2" />
                      ) : (
                        <FaHistory className="mr-2" />
                      )}
                      Historiku
                    </li>
                    <li
                      onClick={() => setActiveSection("donacione")}
                      className={`p-2 cursor-pointer flex items-center ${
                        activeSection === "donacione" &&
                        "bg-primary rounded-xl text-white"
                      }`}
                    >
                      {activeSection === "donacione" ? (
                        <FaDonateActive className="mr-2" />
                      ) : (
                        <FaDonate className="mr-2" />
                      )}
                      Donacione
                    </li>
                    <li
                      onClick={() => setActiveSection("profiliXhamise")}
                      className={`p-2 cursor-pointer flex items-center ${
                        activeSection === "profiliXhamise" &&
                        "bg-primary rounded-xl text-white"
                      }`}
                    >
                      {activeSection === "profiliXhamise" ? (
                        <FaMosqueActive className="mr-2" />
                      ) : (
                        <FaMosque className="mr-2" />
                      )}
                      Profili i Xhamisë
                    </li>
                  </>
                )}
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
                src={user?.photoURL || DefaultPic}
                alt="Profile"
                className="w-10 h-10 rounded-full bg-white p-2"
              />
              <div>
                <p className="font-semibold text-white px-2">
                  {userInfo.fullName || "User"}
                </p>
              </div>
            </div>
            <FaChevronDown className="text-white" />
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-3xl font-bold">
            Mirë se vini, {userInfo.fullName}.
          </h1>
          <p className="text-lg text-gray-600">
            Ky është paneli i administrimit të xhamise suaj.
          </p>
          <div className="mt-8">{renderSection()}</div>
        </div>
      </div>

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
                    {userInfo.fullName || "N/A"}
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

export default Dashboard;
