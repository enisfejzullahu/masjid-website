import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./reusable/Header";
import Footer from "./reusable/Footer";

const MosqueDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mosque, setMosque] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // State to manage confirmation dialog

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

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3001/mosques/${id}`, updatedData);
      alert("Mosque updated successfully!");
      setIsEditing(false);
      setMosque(updatedData);
    } catch (error) {
      console.error("Error updating mosque:", error);
      alert("Failed to update mosque.");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/mosques/${id}`);
      alert("Mosque deleted successfully!");
      navigate("/dashboard"); // Redirect to main dashboard after deletion
    } catch (error) {
      console.error("Error deleting mosque:", error);
      alert("Failed to delete mosque.");
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
              <p className="text-lg mb-4">Disponueshmeria: {mosque.disponueshmeria}</p>
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
