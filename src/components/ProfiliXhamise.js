import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase Storage

const ProfiliXhamise = () => {
  const [userId, setUserId] = useState(null);
  const [mosqueId, setMosqueId] = useState(null);
  const [mosqueDetails, setMosqueDetails] = useState(null);
  const [updatedData, setUpdatedData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For image preview
  const [isUploading, setIsUploading] = useState(false); // Track image upload

  useEffect(() => {
    const fetchUserId = async () => {
      const currentUser = getAuth().currentUser;
      if (currentUser) setUserId(currentUser.uid);
      else setError("Përdoruesi nuk është i regjistruar.");
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchMosqueId = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, "users", userId);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const mosqueIdFromUser = userDocSnap.data().mosqueId;
          setMosqueId(mosqueIdFromUser);
          fetchMosqueDetails(mosqueIdFromUser);
        } else {
          setError("No user data found.");
        }
      } catch (err) {
        setError("Error fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMosqueId();
  }, [userId]);

  const fetchMosqueDetails = async (mosqueId) => {
    try {
      const response = await axios.get(
        `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${mosqueId}`
      );
      setMosqueDetails(response.data);
      setUpdatedData(response.data);
    } catch (error) {
      setError("Error fetching mosque details.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file)); // For preview
      setUpdatedData((prev) => ({ ...prev, image: file })); // Store the new file
    } else {
      // Keep the existing image if no new file is selected
      setSelectedImage(mosqueDetails.imageUrl); // Restore the old image
    }
  };

  const uploadImageToStorage = async (file) => {
    const storage = getStorage(); // Initialize Firebase Storage
    const storageRef = ref(storage, `mosque-images/${mosqueId}/${file.name}`); // Define storage path
    await uploadBytes(storageRef, file); // Upload the file
    return await getDownloadURL(storageRef); // Get the file's URL
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert("Duhet të jeni të regjistruar për të redaktuar këtë xhami.");
      return;
    }

    try {
      const token = await getAuth().currentUser.getIdToken();
      const userResponse = await axios.get("http://localhost:3001/user-info", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const { role, mosqueId: assignedMosqueId } = userResponse.data.user;

      if (
        role === "super-admin" ||
        (role === "mosque-admin" && assignedMosqueId === mosqueId)
      ) {
        setIsUploading(true);

        // Handle image upload if a new image is selected
        if (updatedData.image) {
          const imageUrl = await uploadImageToStorage(updatedData.image);
          updatedData.imageUrl = imageUrl; // Add uploaded image URL to updatedData
          delete updatedData.image; // Remove the file object
        } else {
          // If no new image is selected, retain the existing image URL
          updatedData.imageUrl = mosqueDetails.imageUrl;
        }

        // Update mosque details
        await axios.put(
          `http://localhost:3001/mosques/${mosqueId}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Xhamia u përditësua me sukses!");
        setIsEditing(false);
        setMosqueDetails(updatedData);
      } else {
        toast.error(
          "Ju nuk keni leje të mjaftueshme për të redaktuar këtë xhami."
        );
      }
    } catch (error) {
      console.error("Error updating mosque:", error);
      toast.error("Dështoi përditësimi i xhamisë.");
    } finally {
      setIsUploading(false);
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
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
        Profili i Xhamisë
      </h1>

      {mosqueDetails ? (
        <div className="bg-white shadow-md rounded-lg p-4 flex flex-col md:flex-row items-start space-x-0 md:space-x-6">
          {/* Image Section (Top on Mobile, Left on Larger Screens) */}
          <div className="mb-4 md:mb-0 w-full md:w-32 h-auto md:h-32 object-cover rounded-md overflow-hidden">
            <img
              src={
                selectedImage ||
                mosqueDetails.imageUrl ||
                "/placeholder-image.jpg"
              }
              alt={mosqueDetails.emri}
              className="w-full h-full object-cover rounded-md"
            />
          </div>

          {/* Details Section */}
          <div className="flex-1">
            {/* Title */}
            <h2 className="text-xl font-bold text-gray-800 text-center md:text-left mb-2">
              {mosqueDetails.emri || "Mosque Name"}
            </h2>

            {/* Address */}
            <p className="text-gray-600 text-center md:text-left">
              Adresa:{" "}
              <a
                href={`https://www.google.com/maps?q=${encodeURIComponent(
                  mosqueDetails.adresa || ""
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline break-all"
              >
                {mosqueDetails.adresa || "N/A"}
              </a>
            </p>

            {/* Contact Information */}
            {mosqueDetails.kontakti && (
              <p className="text-gray-600 mt-2 text-center md:text-left">
                Tel: {mosqueDetails.kontakti}
              </p>
            )}

            {/* Website */}
            {mosqueDetails.website && (
              <p className="text-gray-600 mt-2 text-center md:text-left">
                Website:{" "}
                <a
                  href={mosqueDetails.website}
                  className="text-blue-500 underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {mosqueDetails.website}
                </a>
              </p>
            )}

            {/* Availability */}
            {mosqueDetails.disponueshmeria && (
              <p className="text-gray-600 mt-2 text-center md:text-left">
                Disponueshmeria: {mosqueDetails.disponueshmeria}
              </p>
            )}

            {/* Edit Button (Full Width on Mobile, Auto Width on Larger Screens) */}
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-green-400 w-full md:w-auto md:px-6 md:ml-auto"
            >
              Redakto Xhaminë
            </button>
          </div>
        </div>
      ) : (
        <p>No mosque details available.</p>
      )}

      {isEditing && (
        <form
          onSubmit={handleEditSubmit}
          className="mt-6 bg-gray-100 p-6 rounded-lg shadow-md"
        >
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Edit Mosque Details
          </h3>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Emri i Xhamisë</label>
            <input
              type="text"
              name="emri"
              value={updatedData.emri || ""}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Shkruani emrin e xhamisë"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Adresa</label>
            <input
              type="text"
              name="adresa"
              value={updatedData.adresa || ""}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Shkruani adresën e xhamisë"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Kontakti</label>
            <input
              type="text"
              name="kontakti"
              value={updatedData.kontakti || ""}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Shkruani kontaktin e xhamisë"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Website</label>
            <input
              type="text"
              name="website"
              value={updatedData.website || ""}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Shkruani website-in e xhamisë"
            />
          </div>

          {/* New Disponueshmeria field */}
          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Disponueshmeria</label>
            <input
              type="text"
              name="disponueshmeria"
              value={updatedData.disponueshmeria || ""}
              onChange={handleInputChange}
              className="w-full border rounded-lg p-2"
              placeholder="Shkruani disponueshmërinë (p.sh. 24/7 ose vetëm gjatë kohëve të namazit)"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 mb-2">Ndrysho Foton</label>
            <input type="file" onChange={handleImageChange} />
            {selectedImage && (
              <img
                src={selectedImage}
                alt="Preview"
                className="mt-4 w-32 h-32 object-cover rounded-md"
              />
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-green-400"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <ToastContainer />
    </div>
  );
};

export default ProfiliXhamise;
