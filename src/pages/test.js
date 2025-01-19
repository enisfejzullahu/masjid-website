import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { logout } from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [mosqueId, setMosqueId] = useState("");
  const [mosqueData, setMosqueData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setUser(currentUser);
            const mosqueIdFromDb = userDoc.data().mosqueId || "N/A";
            setMosqueId(mosqueIdFromDb);

            if (mosqueIdFromDb !== "N/A") {
              // Fetch mosque data from Firestore or API
              await fetchMosqueData(mosqueIdFromDb);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold text-primary mb-6 pt-8">
          Paneli Kryesor
        </h1>
        {user ? (
          <>
            {mosqueId === "N/A" || !mosqueId ? (
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 max-w-3xl">
                <p className="font-bold">Njoftim</p>
                <p>
                  Ju ende nuk jeni caktuar në një xhami. Ju lutem prisni ose
                  kontaktoni mbështetjen për ndihmë.
                </p>
              </div>
            ) : (
              <>
                {mosqueData && (
                  <div className="w-full max-w-md mt-6">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                      <img
                        src={mosqueData.imageUrl}
                        alt={mosqueData.emri}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h2 className="text-2xl font-semibold mb-2">
                          {mosqueData.emri}
                        </h2>
                        <p>
                          <strong>Adresa:</strong> {mosqueData.adresa}
                        </p>
                        <p>
                          <strong>Kontakti:</strong>{" "}
                          <a
                            href={`tel:${mosqueData.kontakti}`}
                            className="text-blue-600"
                          >
                            {mosqueData.kontakti}
                          </a>
                        </p>
                        <p>
                          <strong>Website:</strong>{" "}
                          <a
                            href={mosqueData.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600"
                          >
                            {mosqueData.website}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "red",
                color: "white",
                border: "none",
                padding: "10px 15px",
                borderRadius: "5px",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <p>Failed to load user data. Please try again later.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
