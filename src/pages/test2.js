import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { logout } from "../services/authService";
import { onAuthStateChanged } from "firebase/auth";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";

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

            // Fetch mosque details
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
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        navigate("/kycu");
      }
    });

    return () => unsubscribe(); // Clean up listener
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/kycu");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMosqueData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    if (!mosqueId || !mosqueData) return;

    try {
      const mosqueRef = doc(db, "mosques", mosqueId);
      await updateDoc(mosqueRef, mosqueData);
      alert("Mosque details updated successfully!");
    } catch (error) {
      console.error("Error updating mosque details:", error);
      alert("Failed to update mosque details.");
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
                <p>
                  Your Mosque ID: <strong>{mosqueId}</strong>
                </p>
                <p>
                  Welcome, <strong>{user.email}</strong>
                </p>

                {mosqueData && (
                  <div className="w-full max-w-md mt-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      Edit Mosque Details
                    </h2>
                    <form className="space-y-4">
                      <div>
                        <label className="block font-medium">Mosque Name</label>
                        <input
                          type="text"
                          name="name"
                          value={mosqueData.name || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={mosqueData.location || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <div>
                        <label className="block font-medium">
                          Contact Info
                        </label>
                        <input
                          type="text"
                          name="contactInfo"
                          value={mosqueData.contactInfo || ""}
                          onChange={handleInputChange}
                          className="w-full border border-gray-300 rounded-lg p-2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleSaveChanges}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </form>
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