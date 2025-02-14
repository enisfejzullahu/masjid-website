import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/reusable/Header";
import Footer from "../components/reusable/Footer";
import SearchIcon from "../assets/SearchIcon.svg";

const MosquesPage = () => {
  const [mosques, setMosques] = useState([]);
  const [filteredMosques, setFilteredMosques] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch mosques from the backend
  useEffect(() => {
    const fetchMosques = async () => {
      try {
        const response = await fetch(
          "https://masjid-app-7f88783a8532.herokuapp.com/mosques"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch mosques");
        }
        const data = await response.json();
        setMosques(data);
        setFilteredMosques(data);
      } catch (error) {
        console.error("Error fetching mosques:", error);
      }
    };

    fetchMosques();
  }, []);

  // Filter mosques based on the search query
  useEffect(() => {
    const filtered = mosques.filter((mosque) =>
      mosque.emri?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMosques(filtered);
  }, [searchQuery, mosques]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-col items-center px-4 sm:px-6 py-8 sm:py-12">
        {/* Page Title */}
        <h1 className="text-3xl lg:text-4xl font-extrabold text-primary text-center mt-14 lg:mt-8 mb-10">
          Xhamitë
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-black text-center mb-8 mx-auto max-w-2xl">
          Shikoni oraret e namazit dhe informacionin bazë për xhamitë e
          regjistruara. Për funksionalitete të plota, shkarkoni aplikacionin{" "}
          <span className="font-semibold">Xhamia Ime</span>.
        </p>

        {/* Search Input */}
        <div className="flex items-center border-2 border-primary rounded-2xl px-4 py-2 w-full sm:w-3/4 max-w-lg">
          <input
            type="text"
            placeholder="Cilën xhami po kërkon?"
            className="flex-grow outline-none text-gray-700 text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            onClick={() => {
              // Optional search logic
            }}
            className="ml-3"
          >
            <img
              src={SearchIcon}
              alt="Search Icon"
              className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500"
            />
          </button>
        </div>

        {/* Suggested Mosques */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 pt-12">
          Sugjeruar për ju
        </h2>

        {/* Display Mosques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredMosques.map((mosque) => (
            <Link
              to={`/xhamite/${mosque.id}`}
              key={mosque.id}
              className="border rounded-lg p-4 shadow-md flex flex-col items-center hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={mosque.imageUrl}
                alt={mosque.emri}
                className="w-full h-32 sm:h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {mosque.emri}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {mosque.adresa}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MosquesPage;
