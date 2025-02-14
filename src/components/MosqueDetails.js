import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth"; // Firebase auth
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { auth, db } from "../firebaseConfig"; // Adjust the path to match your project structure
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import axios from "axios";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";

const MosqueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mosque, setMosque] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to manage confirmation dialog

  const auth = getAuth();
  const db = getFirestore();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchMosqueDetails = async () => {
      try {
        const response = await axios.get(
          `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${id}`
        );
        setMosque(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        console.error("Error fetching mosque details:", error);
      }
    };
    fetchMosqueDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await axios.put(`http://localhost:3001/mosques/${id}`, updatedData);
  //     alert("Mosque updated successfully!");
  //     setIsEditing(false);
  //     setMosque(updatedData);
  //   } catch (error) {
  //     console.error("Error updating mosque:", error);
  //     alert("Failed to update mosque.");
  //   }
  // };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get the user's Firebase ID token
          const token = await user.getIdToken();
          // console.log("Firebase ID Token:", token);
          localStorage.setItem("token", token); // Save the token

          // Fetch additional user information from Firestore
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
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      } else {
        setUserInfo(null);
        console.error("No user is currently logged in.");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error("You must be signed in to edit this mosque.");
      return;
    }

    try {
      // Retrieve token and log it for debugging
      const token = await auth.currentUser.getIdToken();
      // console.log("Retrieved Token:", token);

      // Fetch user role and assigned mosque
      const userResponse = await axios.get("http://localhost:3001/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Make sure the response structure matches the backend
      // console.log("Full User Info Response:", userResponse.data);

      const { role, mosqueId: assignedMosqueId } = userResponse.data.user; // Destructure from 'user'

      // console.log("Role from response:", role);
      // console.log("Assigned Mosque ID from response:", assignedMosqueId);

      // Logic for super-admin
      if (role === "super-admin") {
        await axios.put(`http://localhost:3001/mosques/${id}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Xhamia u përditësua me sukses!");
        setIsEditing(false);
        setMosque(updatedData);
        return;
      }

      // Logic for mosque-admin
      if (role === "mosque-admin") {
        if (assignedMosqueId !== id) {
          toast.error(
            "You are not authorized to edit this mosque. Please contact the super-admin."
          );
          return;
        }

        await axios.put(`http://localhost:3001/mosques/${id}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        toast.success("Mosque updated successfully by Mosque Admin!");
        setIsEditing(false);
        setMosque(updatedData);
        return;
      }

      // Default fallback
      toast.error("Ju nuk keni leje të mjaftueshme për të redaktuar këtë xhami.");
    } catch (error) {
      console.error(
        "Error updating mosque:",
        error.response || error.message || error
      );
      toast.error("Dështoi përditësimi i xhamisë.");
    }
  };

  const handleDelete = async () => {
    try {
      // Get the token (from wherever you store it, e.g., in localStorage or a context)
      const token = await getAuth().currentUser.getIdToken();

      // Make the DELETE request with the token in the Authorization header
      await axios.delete(`http://localhost:3001/mosques/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Send the Firebase ID token in the Authorization header
        },
      });

      toast.success("Xhamia u fshi me sukses!");
      navigate("/dashboard"); // Redirect to main dashboard after deletion
    } catch (error) {
      console.error("Gabim gjatë fshirjes së xhamisë:", error);
      toast.error("Dështoi fshirja e xhamisë.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false); // Close the confirmation dialog without deleting
  };

  if (!mosque) {
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
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-6">
              <h2 className="text-3xl font-semibold text-primary">
                Edit Mosque
              </h2>
              <div className="space-y-4">
                {/* Mosque Name */}
                <div>
                  <label
                    htmlFor="emri"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Emri
                  </label>
                  <input
                    type="text"
                    id="emri"
                    name="emri"
                    value={updatedData.emri || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="adresa"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresa
                  </label>
                  <input
                    type="text"
                    id="adresa"
                    name="adresa"
                    value={updatedData.adresa || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Contact */}
                <div>
                  <label
                    htmlFor="kontakti"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Kontakti
                  </label>
                  <input
                    type="text"
                    id="kontakti"
                    name="kontakti"
                    value={updatedData.kontakti || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Website */}
                <div>
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    value={updatedData.website || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                {/* Disponueshmeria */}
                <div>
                  <label
                    htmlFor="disponueshmeria"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Disponueshmeria
                  </label>
                  <input
                    type="text"
                    id="disponueshmeria"
                    name="disponueshmeria"
                    value={updatedData.disponueshmeria || ""}
                    onChange={handleInputChange}
                    className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div>
              <img
                src={mosque.imageUrl}
                alt={mosque.emri}
                className="w-64 h-64 object-cover rounded-lg mb-4"
              />
              <h1 className="text-3xl font-semibold text-primary mb-4">
                {mosque.emri}
              </h1>
              <p className="text-lg mb-2">Adresa: {mosque.adresa}</p>
              <p className="text-lg mb-2">Kontakti: {mosque.kontakti}</p>
              <p className="text-lg mb-4">Website: {mosque.website}</p>
              <p className="text-lg mb-4">
                Disponueshmeria: {mosque.disponueshmeria}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark transition duration-300"
              >
                Edit Mosque
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(true)} // Show confirmation dialog
                className="w-full bg-red-500 text-white py-3 rounded-lg mt-4 hover:bg-red-700 transition duration-300"
              >
                Delete Mosque
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to delete this mosque?
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default MosqueDetails;
