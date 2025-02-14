import React, { useState, useEffect, useRef } from "react";
import "../styles/Njoftimet.css";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import moment from "moment";
import { FaEllipsisH, FaSort, FaFilter } from "react-icons/fa"; // For the three-dot icon
import Select from "react-select";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define sort options
const sortOptions = [
  { value: "dateDesc", label: "Data Zbritëse (Nga E Re Tek E Vjetra)" },
  { value: "dateAsc", label: "Data Ngritëse (Nga E Vjetra Tek E Re)" },
];

// Define filter options
const filterOptions = [
  { value: "month", label: "Sipas Muajit" },
  { value: "year", label: "Sipas Vitit" },
];

const Njoftimet = ({ mosqueId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [noAnnouncements, setNoAnnouncements] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null); // New state for image file
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [expandedId, setExpandedId] = useState(null); // Track which card is expanded
  const [showOptions, setShowOptions] = useState(null); // Track which card's options are visible
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const menuRef = useRef(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] = useState(null);

  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [filter, setFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [sortOption, setSortOption] = useState(sortOptions[0]);

  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption);
    applyFilters(selectedOption);
  };

  const handleFilterChange = (selectedOption) => {
    setFilter(selectedOption.value);
    applyFilters();
  };

  const handleYearFilterChange = (e) => {
    setYearFilter(e.target.value);
    applyFilters();
  };

  const handleMonthFilterChange = (e) => {
    setMonthFilter(e.target.value);
    applyFilters();
  };

  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    fetchAnnouncements();
  }, [mosqueId]);

  useEffect(() => {
    applyFilters();
  }, [announcements, filter, yearFilter, monthFilter]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${mosqueId}/njoftimet`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data && Array.isArray(response.data)) {
        const sortedAnnouncements = response.data.sort(
          (a, b) => new Date(b.datePosted) - new Date(a.datePosted)
        );
        setAnnouncements(sortedAnnouncements);
        setNoAnnouncements(sortedAnnouncements.length === 0);
        setError(null); // Clear any previous errors
      } else {
        setAnnouncements([]);
        setNoAnnouncements(true);
        setError(null); // Clear any previous errors
      }
    } catch (err) {
      setAnnouncements([]);
      setNoAnnouncements(true);
      setError("Failed to fetch announcements.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (selectedSortOption = sortOption) => {
    let filtered = announcements;

    if (filter === "withImages") {
      filtered = filtered.filter((announcement) => announcement.imageUrl);
    }

    if (yearFilter) {
      filtered = filtered.filter(
        (announcement) =>
          new Date(announcement.datePosted).getFullYear() ===
          parseInt(yearFilter)
      );
    }

    if (monthFilter) {
      filtered = filtered.filter(
        (announcement) =>
          new Date(announcement.datePosted).getMonth() + 1 ===
          parseInt(monthFilter)
      );
    }

    if (selectedSortOption.value === "dateAsc") {
      filtered.sort((a, b) => new Date(a.datePosted) - new Date(b.datePosted));
    } else {
      filtered.sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted));
    }

    setFilteredAnnouncements(filtered);
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      const storageRef = ref(
        storage,
        `njoftimet/${mosqueId}/${imageFile.name}`
      );
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      setImageUrl(url);
      return url;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setSuccess(false);

    // Upload image if there's a new one
    const uploadedImageUrl = await handleImageUpload();

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `http://localhost:3001/mosques/${mosqueId}/njoftimet`,
        {
          title,
          text,
          datePosted: moment().format(),
          imageUrl: uploadedImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      resetForm();
      fetchAnnouncements(); // Re-fetch the announcements to show the new one
      setShowModal(false); // Close modal
      toast.success("Njoftimi u dërgua me sukses!");
    } catch (err) {
      setError("Ndodhi një gabim gjatë postimit të njoftimit.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleEdit = async (announcementId) => {
    const announcement = announcements.find(
      (item) => item.id === announcementId
    );
    setEditingAnnouncement(announcement);
    setTitle(announcement.title);
    setText(announcement.text);
    setImageUrl(announcement.imageUrl);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    // Upload image if it's changed
    const uploadedImageUrl = await handleImageUpload();

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.put(
        `http://localhost:3001/mosques/${mosqueId}/njoftimet/${editingAnnouncement.id}`,
        {
          title,
          text,
          datePosted: moment().format(),
          imageUrl: uploadedImageUrl || imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(true);
      setShowEditModal(false);
      fetchAnnouncements(); // Refresh the list after updating
      toast.success("Njoftimi u përditësua me sukses!");
    } catch (err) {
      setError("Ndodhi një gabim gjatë përditësimit të njoftimit.");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const openDeleteModal = (announcementId) => {
    setAnnouncementToDelete(announcementId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setAnnouncementToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async () => {
    if (!announcementToDelete) return;

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.delete(
        `http://localhost:3001/mosques/${mosqueId}/njoftimet/${announcementToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchAnnouncements(); // Refresh after deletion
      toast.success("Njoftimi është fshirë me sukses!"); // Show success toast
      closeDeleteModal(); // Close the delete modal
    } catch (err) {
      setError("Ndodhi një gabim gjatë fshirjes së njoftimit.");
    }
  };

  const truncateText = (text, limit) => {
    if (!text) return ""; // Ensure text is not null or undefined
    const words = text.split(" ");
    if (words.length <= limit) {
      return text;
    }
    return words.slice(0, limit).join(" ") + "...";
  };

  const handleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id); // Toggle the expanded state for the card
  };

  const toggleOptions = (id) => {
    setShowOptions(showOptions === id ? null : id); // Toggle the options visibility
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
    document.body.classList.remove("overflow-hidden");
  };

  const toggleMenu = (announcementId) => {
    setOpenMenus((prev) => ({
      ...prev,
      [announcementId]: !prev[announcementId],
    }));
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpenMenus({});
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const resetForm = () => {
    setTitle("");
    setText("");
    setImageUrl("");
    setImageFile(null);
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

  if (error && !noAnnouncements) return <p>{error}</p>;

  return (
    <div className="mb-6">
      {/* Conditionally render filter options */}
      {announcements.length > 0 && (
        <>
          <div className="mb-4">
            {/* Title and Button (Stacked on Mobile) */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary mb-4 md:mb-0">
                Njoftimet
              </h2>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full md:w-auto"
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
              >
                Shto Njoftim
              </button>
            </div>

            {/* Filter Options (Stacked on Mobile) */}
            <div className="space-y-4 md:flex md:items-center md:justify-start md:space-x-4 md:space-y-0">
              {/* Sort By */}
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-2">
                  Rendit Njoftimet:
                </label>
                <div className="flex items-center border border-green-500 rounded-md p-2">
                  <FaSort className="mr-2 text-green-500" />
                  <Select
                    options={sortOptions}
                    value={sortOption}
                    onChange={handleSortChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Filter By */}
              <div className="w-full md:w-1/3">
                <label className="block text-sm font-medium mb-2">
                  Filtro Njoftimet:
                </label>
                <div className="flex items-center border border-green-500 rounded-md p-2">
                  <FaFilter className="mr-2 text-green-500" />
                  <Select
                    options={filterOptions}
                    value={{
                      value: filter,
                      label:
                        filter === "month" ? "Sipas Muajit" : "Sipas Vitit",
                    }}
                    onChange={handleFilterChange}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Month or Year Input (Conditional Rendering) */}
              {filter === "month" && (
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium mb-2">
                    Zgjedh Muajin:
                  </label>
                  <div className="flex items-center border border-green-500 rounded-md p-2">
                    <input
                      type="number"
                      className="w-full p-2 border-none outline-none"
                      placeholder="Muaji (1-12)"
                      value={monthFilter}
                      onChange={handleMonthFilterChange}
                    />
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-2"
                      onClick={applyFilters}
                    >
                      Filtro
                    </button>
                  </div>
                </div>
              )}
              {filter === "year" && (
                <div className="w-full md:w-1/3">
                  <label className="block text-sm font-medium mb-2">
                    Zgjedh Vitin:
                  </label>
                  <div className="flex items-center border border-green-500 rounded-md p-2">
                    <input
                      type="number"
                      className="w-full p-2 border-none outline-none"
                      placeholder="Viti (e.g., 2025)"
                      value={yearFilter}
                      onChange={handleYearFilterChange}
                    />
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 ml-2"
                      onClick={applyFilters}
                    >
                      Filtro
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Modal for submitting a new announcement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold mb-6 text-center">
              Shto Njoftim
            </h3>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-sm font-semibold mb-1"
                >
                  Titulli
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="text"
                  className="block text-sm font-semibold mb-1"
                >
                  Teksti
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="imageFile"
                  className="block text-sm font-semibold mb-1"
                >
                  Ngarko Imazhin
                </label>
                <input
                  type="file"
                  id="imageFile"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="col-span-2 flex justify-between mt-6">
                <button
                  type="button"
                  className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
                  onClick={() => setShowModal(false)}
                >
                  Mbyll
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-green-600"
                  disabled={loadingSubmit}
                >
                  {loadingSubmit ? "Duke ngarkuar..." : "Posto Njoftim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-4">Konfirmo Fshirjen</h3>
            <p className="mb-4">
              A jeni të sigurt që dëshironi të fshini këtë njoftim?
            </p>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
                onClick={closeDeleteModal}
              >
                Anulo
              </button>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md"
                onClick={handleDelete}
              >
                Fshi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement List */}
      <div>
        {announcements.length === 0 ? (
          <div className="relative w-full h-screen">
            <div className="absolute top-0 left-0 w-full flex items-center justify-center mt-4">
              <div className="text-center">
                <p className="text-gray-600 text-lg">
                  Nuk keni bërë asnjë njoftim.
                </p>
                <button
                  className="bg-primary text-white mt-4 px-4 py-2 rounded-md hover:bg-green-500"
                  onClick={() => {
                    setError(null);
                    setShowModal(true);
                  }}
                >
                  Bëni njoftimin e parë tuajin
                </button>
              </div>
            </div>
          </div>
        ) : (
          filteredAnnouncements.map((announcement) => (
            <div
              key={announcement.id}
              className="border rounded-md mb-4 p-4 bg-white shadow-sm"
            >
              {/* <div className="flex-1"> */}
              {/* This container holds text and buttons */}
              <div className="flex justify-between items-center mb-2">
                <h3 className="flex justify-between items-center mb-2">
                  {announcement.title}
                </h3>
                <div className="relative inline-block text-left">
                  <button
                    className="text-gray-600 hover:text-gray-800 focus:outline-none"
                    onClick={() => toggleMenu(announcement.id)}
                  >
                    <FaEllipsisH className="text-primary" />
                  </button>

                  {openMenus[announcement.id] && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <button
                        className="group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-900 hover:bg-primary hover:text-white"
                        onClick={() => {
                          handleEdit(announcement.id);
                          toggleMenu(announcement.id);
                        }}
                      >
                        Redakto
                      </button>
                      <button
                        className="group flex rounded-md items-center w-full px-4 py-2 text-sm text-gray-900 hover:bg-red-500 hover:text-white"
                        onClick={() => openDeleteModal(announcement.id)}
                      >
                        Fshi
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-gray-500 mb-2">
                {moment(announcement.datePosted).format("DD MMM YYYY, HH:mm")}
              </p>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <div className="flex-1">
                  {announcement.text &&
                    (expandedId === announcement.id ||
                    announcement.text.length <= 500
                      ? announcement.text
                          .split("\n")
                          .map((paragraph, index) => (
                            <p key={index} className="text-sm text-black mt-4">
                              {paragraph}
                            </p>
                          ))
                      : truncateText(announcement.text, 200)
                          .split("\n")
                          .map((paragraph, index) => (
                            <p key={index} className="text-sm text-black mt-4">
                              {paragraph}
                            </p>
                          )))}
                </div>
                {announcement.imageUrl && (
                  <img
                    src={announcement.imageUrl}
                    alt={announcement.title}
                    className="w-full md:w-48 h-auto md:h-48 object-cover rounded-md mt-4 md:mt-0"
                  />
                )}
              </div>
              {announcement.text.length > 200 && (
                <button
                  className="text-green-600 mt-2"
                  onClick={() => handleExpand(announcement.id)}
                >
                  {expandedId === announcement.id
                    ? "Lexo Më Pak"
                    : "Lexo Më Shumë"}
                </button>
              )}
              {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex justify-center items-center z-50">
                  <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
                    {/* Close Button */}
                    <button
                      onClick={() => setShowEditModal(false)}
                      className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
                    >
                      &times;
                    </button>
                    <h3 className="text-2xl font-bold mb-6 text-center">
                      Redakto Njoftimin
                    </h3>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <form onSubmit={handleUpdate}>
                      <div className="mb-4">
                        <label
                          htmlFor="title"
                          className="block text-sm font-semibold mb-1"
                        >
                          Titulli
                        </label>
                        <input
                          type="text"
                          id="title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="text"
                          className="block text-sm font-semibold mb-1"
                        >
                          Teksti
                        </label>
                        <textarea
                          id="text"
                          value={text}
                          onChange={(e) => setText(e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="imageFile"
                          className="block text-sm font-semibold mb-1"
                        >
                          Ngarko Imazhin
                        </label>
                        <input
                          type="file"
                          id="imageFile"
                          onChange={(e) => setImageFile(e.target.files[0])}
                          className="w-full p-2 border border-gray-300 rounded-md"
                        />
                      </div>

                      <div className="col-span-2 flex justify-between mt-6">
                        <button
                          type="button"
                          className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
                          onClick={() => setShowModal(false)}
                        >
                          Mbyll
                        </button>
                        <button
                          type="submit"
                          className="bg-primary text-white py-2 px-6 rounded-lg hover:bg-green-600"
                          disabled={loadingSubmit}
                        >
                          {loadingSubmit
                            ? "Duke ngarkuar..."
                            : "Përditëso Njoftimin"}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Njoftimet;
