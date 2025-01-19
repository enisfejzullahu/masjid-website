import React, { useState, useEffect } from "react";
import { db } from "../firebaseConfig"; // Import Firebase configuration if required
import axios from "axios";

import AddMosqueForm from "./forms/AddMosqueForm";

const MosquesSection = () => {
  const [mosques, setMosques] = useState([]);
  const [filteredMosques, setFilteredMosques] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(null); // Pagination
  const [showAddMosqueForm, setShowAddMosqueForm] = useState(false);

  // Fetch mosques from the backend
  const fetchMosques = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://masjid-app-7f88783a8532.herokuapp.com/mosques"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mosques");
      }
      const data = await response.json();
      setMosques(data);
      setFilteredMosques(data); // Set initial filtered mosques
    } catch (error) {
      console.error("Error fetching mosques:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter mosques based on the search query
  useEffect(() => {
    const filtered = mosques.filter((mosque) =>
      mosque.emri?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMosques(filtered);
  }, [searchQuery, mosques]);

  useEffect(() => {
    fetchMosques(); // Fetch mosques on mount
  }, []);

  const handleAddMosqueSubmit = async (data) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/mosques/add-mosque",
        data
      );
      alert("Mosque added successfully");
      setShowAddMosqueForm(false);
    } catch (error) {
      console.error("Error adding mosque:", error);
      alert("Error adding mosque");
    }
  };

  // Handle loading more mosques if needed
  const loadMoreMosques = async () => {
    if (lastVisible) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://masjid-app-7f88783a8532.herokuapp.com/mosques"
        );
        const data = await response.json();
        setMosques((prevMosques) => [...prevMosques, ...data]);
        setLastVisible(data[data.length - 1]);
      } catch (error) {
        console.error("Error fetching mosques:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <AddMosqueForm
          isOpen={showAddMosqueForm}
          onClose={() => setShowAddMosqueForm(false)}
          onSubmit={handleAddMosqueSubmit}
        />
        <h2 className="text-2xl font-semibold">Xhamitë</h2>
        <button
          className="bg-primary text-white font-semibold py-2 px-6 rounded-md"
          onClick={() => setShowAddMosqueForm(true)}
        >
          Shto Xhami
        </button>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Kerko Xhamitë..."
        className="w-full p-2 border rounded mb-4"
      />
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMosques.map((mosque) => (
          <li key={mosque.id} className="border rounded p-4 shadow">
            <img
              src={mosque.imageUrl}
              alt={mosque.name}
              className="w-full h-32 object-cover rounded mb-2"
            />
            <h3 className="font-bold">{mosque.emri}</h3>
            <p className="text-sm text-gray-600">{mosque.location}</p>
            <a
              href={`/dashboard/mosque/${mosque.id}`}
              className="text-primary mt-2 inline-block"
            >
              Shiko Detajet
            </a>
          </li>
        ))}
      </ul>

      {loading && (
        <div>
          <div className="flex items-center justify-center min-h-screen">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="ml-4 text-lg text-primary font-semibold">
              Duke ngarkuar...
            </p>
          </div>
        </div>
      )}

      <button
        onClick={loadMoreMosques}
        disabled={loading}
        className="mt-4 bg-green-500 text-white py-2 px-4 rounded-lg"
      >
        Load More
      </button>
    </div>
  );
};

export default MosquesSection;
