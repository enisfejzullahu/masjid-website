import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { logout } from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";

import { FaArrowRight, FaChevronDown, FaChevronUp } from "react-icons/fa"; // Icons from react-icons

import Header from "./reusable/Header";
import Footer from "./reusable/Footer";
import DefaultPic from "../assets/DefaultPic.webp";

import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [mosqueId, setMosqueId] = useState("");
  const [fullName, setFullName] = useState("");
  const [mosqueData, setMosqueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("paneli"); // Track active section
  const [showProfileCard, setShowProfileCard] = useState(false); // Toggle profile card visibility
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            const mosqueIdFromDb = userDoc.data().mosqueId || "N/A";
            // const fullNameFromDb = userDoc.data().fullName || "N/A";
            const userInfo = userDoc.data();
            setUserInfo({
              fullName: userInfo.fullName || "No name",
              email: userInfo.email,
              role: userInfo.role || "User",
              phoneNumber: userInfo.phoneNumber,
              mosqueId: userInfo.mosqueId || "N/A",
            })

            setMosqueId(mosqueIdFromDb);
            // setFullName(fullNameFromDb);

            if (mosqueIdFromDb !== "N/A") {
              const mosqueDoc = await getDoc(
                doc(db, "mosques", mosqueIdFromDb)
              );
              if (mosqueDoc.exists()) {
                setMosqueData(mosqueDoc.data());
              } else {
                console.error("No mosque data found in Firestore!");
              }
            }
          } else {
            console.error("No user data found in Firestore!");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/kycu");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchMosqueData = async (id) => {
    try {
      // Fetch directly from the API
      const response = await axios.get(
        `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${id}`
      );
      setMosqueData(response.data);
    } catch (error) {
      console.error("Error fetching mosque data:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/kycu");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case "paneli":
        return (
          <div>
            <h2>Welcome to the Mosque Management Panel</h2>
            {/* Render mosque details or other content */}
          </div>
        );
      case "njoftimet":
        return (
          <div>
            <h2>Njoftimet Section</h2>
            {/* Render users-related content */}
          </div>
        );
      case "eventet":
        return (
          <div>
            <h2>Evente Section</h2>
            {/* Render users-related content */}
          </div>
        );
      case "historiku":
        return (
          <div>
            <h2>Historiku Section</h2>
            {/* Render users-related content */}
          </div>
        );
      case "donacione":
        return (
          <div>
            <h2>Donactione Section</h2>
            {/* Render users-related content */}
          </div>
        );
      case "profiliXhamise":
        return (
          <div>
            <h2>Profili Section</h2>
            {/* Render users-related content */}
          </div>
        );
      // Add more cases as needed
      default:
        return null;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex my-16 border-r-0 border-l-0 border-primary border-2 shadow-lg">
        <aside className="w-64 border-r-2 border-primary text-black flex flex-col justify-between p-4 h-[calc(100vh-100px)]">
          <div>
            <h2 className="text-2xl font-bold">Paneli i Administrimit</h2>
            <nav className="mt-6 text-black font-semibold">
              <ul>
                <li
                  onClick={() => setActiveSection("paneli")}
                  className={`p-2 cursor-pointer ${
                    activeSection === "paneli" &&
                    "bg-primary rounded-xl text-white"
                  }`}
                >
                  Paneli Kryesor
                </li>
                <li
                  onClick={() => setActiveSection("njoftimet")}
                  className={`p-2 cursor-pointer ${
                    activeSection === "njoftimet" &&
                    "bg-primary rounded-xl text-white"
                  }`}
                >
                  Njoftimet
                </li>
                <li
                  onClick={() => setActiveSection("eventet")}
                  className={`p-2 cursor-pointer ${
                    activeSection === "eventet" &&
                    "bg-primary rounded-xl text-white"
                  }`}
                >
                  Eventet
                </li>
                <li
                  onClick={() => setActiveSection("historiku")}
                  className={`p-2 cursor-pointer ${
                    activeSection === "historiku" &&
                    "bg-primary rounded-xl text-white"
                  }`}
                >
                  Historiku
                </li>
                <li
                  onClick={() => setActiveSection("donacione")}
                  className={`p-2 cursor-pointer ${
                    activeSection === "donacione" &&
                    "bg-primary rounded-xl text-white"
                  }`}
                >
                  Donacione
                </li>
                <li
                  onClick={() => setActiveSection("profiliXhamise")}
                  className={`p-2 cursor-pointer ${
                    activeSection === "profiliXhamise" &&
                    "bg-primary rounded-xl text-white"
                  }`}
                >
                  Profili i Xhamisë
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
                src={user?.photoURL || DefaultPic} // Use the photoURL property
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
      <Footer />
    </div>
  );
};

export default Dashboard;
