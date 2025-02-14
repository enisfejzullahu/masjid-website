import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import axios from "axios";
import { toast } from "react-toastify";
import { Editor, EditorState } from "draft-js";
import "draft-js/dist/Draft.css"; // You need this import for basic styles

const Historiku = ({ mosqueId }) => {
  const [historiku, setHistoriku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    imageUrl: "",
    photos: [],
  });
  const [modalImage, setModalImage] = useState(null); // For modal image viewing
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploading2, setIsUploading2] = useState(false);

  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    fetchHistoriku();
  }, [mosqueId]);

  const fetchHistoriku = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      const response = await axios.get(
        `https://masjid-app-7f88783a8532.herokuapp.com/mosques/${mosqueId}/historiku`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setHistoriku(response.data[0] || null);
      setError(null);
    } catch (err) {
      setHistoriku(null);
      setError("Failed to fetch mosque data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading2(true); // Show loading indicator during upload
      const imageRef = ref(
        storage,
        `historiku-images/${mosqueId}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          setIsUploading2(false); // Hide loading on error
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevData) => ({
            ...prevData,
            photos: [...prevData.photos, downloadURL],
          }));
          setIsUploading2(false); // Hide loading after upload
        }
      );
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true); // Show loading indicator
      const imageRef = ref(storage, `historiku-images/${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);

      uploadTask.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading image:", error);
          setIsUploading(false); // Hide loading on error
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFormData((prevData) => ({
            ...prevData,
            imageUrl: downloadURL,
          }));
          setIsUploading(false); // Hide loading after successful upload
        }
      );
    }
  };

  const handleSaveHistoriku = async () => {
    if (!formData.title || !formData.text || !formData.imageUrl) {
      toast.error("All fields are required.");
      return;
    }

    try {
      const token = await auth.currentUser.getIdToken();
      if (historiku) {
        await axios.put(
          `http://localhost:3001/mosques/${mosqueId}/historiku`,
          { ...formData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      } else {
        await axios.post(
          `http://localhost:3001/mosques/${mosqueId}/historiku`,
          { ...formData },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      toast.success(
        historiku
          ? "Historiku u përditësua me sukses!"
          : "Historiku u shtua me sukses!"
      );
      fetchHistoriku();
      setIsEditing(false);
    } catch (err) {
      toast.error("Dështoi ruajtja e Historikut.");
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    try {
      // Decode the URL to get the actual path
      const decodedUrl = decodeURIComponent(imageUrl);

      // Extract file name from the decoded URL (the part after the last '/')
      const fileName = decodedUrl.split("/").pop().split("?")[0];

      // Get a reference to the storage location
      const storageRef = ref(
        storage,
        `historiku-images/${mosqueId}/${fileName}`
      );

      // Delete the image from Firebase Storage
      await deleteObject(storageRef);

      // Now, remove the image URL from Firestore
      const token = await auth.currentUser.getIdToken();
      const updatedPhotos = formData.photos.filter((url) => url !== imageUrl);

      // Update the photos array in Firestore
      await axios.put(
        `http://localhost:3001/mosques/${mosqueId}/historiku`,
        { ...formData, photos: updatedPhotos },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update local state to reflect the removed image
      setFormData((prevData) => ({
        ...prevData,
        photos: updatedPhotos,
      }));

      toast.success("Imazhi u fshi me sukses!");
    } catch (err) {
      console.error("Error removing image:", err);
      toast.error("Dështoi heqja e imazhit.");
    }
  };

  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
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
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-primary mb-4 md:mb-0">
        Historiku i Xhamisë
      </h1>

      {isEditing ? (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Text</label>
            <textarea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">
              Main Image
            </label>
            <input
              type="file"
              onChange={handleProfilePicChange}
              className="w-full border rounded px-3 py-2"
            />
            {isUploading ? (
              <div className="mt-4 flex items-center text-primary">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Duke ngarkuar foton...
              </div>
            ) : (
              formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Main Image"
                  className="mt-4 w-48 h-48 object-cover"
                />
              )
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">
              Additional Photos
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded px-3 py-2"
            />
            {isUploading2 && (
              <div className="mt-4 flex items-center text-primary">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="transparent"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Duke ngarkuar foton...
              </div>
            )}
            <div className="mt-4 flex space-x-4 overflow-x-auto">
              {formData.photos.map((url, index) => (
                <div key={index} className="relative w-32">
                  <img
                    src={url}
                    alt="Mosque Photo"
                    className="w-full h-32 object-cover rounded-lg cursor-pointer"
                    onClick={() => openModal(url)}
                  />
                  <button
                    className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-red-500 text-white rounded-full py-2 px-4"
                    onClick={() => handleRemoveImage(url)}
                  >
                    Fshij
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              onClick={() => {
                setIsEditing(false);
                setFormData({ title: "", text: "", imageUrl: "", photos: [] });
              }}
            >
              Cancel
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleSaveHistoriku}
            >
              Save
            </button>
          </div>
        </div>
      ) : historiku ? (
        <div className="bg-white shadow rounded-lg p-6">
          {/* Main Content */}
          <div className="flex flex-col md:flex-row items-center space-x-4 md:space-x-8">
            {/* Main Image (Below Text on Mobile) */}
            {historiku.imageUrl && (
              <img
                src={historiku.imageUrl}
                alt={historiku.title}
                className="w-full md:w-24 h-auto md:h-24 object-cover rounded-lg cursor-pointer mt-4 md:mt-0 order-2 md:order-1"
                onClick={() => openModal(historiku.imageUrl)} // Trigger modal on click
              />
            )}
            {/* Text Content (Above Image on Mobile) */}
            <div className="flex-1 order-1 md:order-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {historiku.title}
              </h3>
              {historiku.text &&
                historiku.text.split("\n").map((paragraph, index) => (
                  <p key={index} className="text-sm text-gray-700 mt-2">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>

          {/* Photos Section (Scrollable on Mobile) */}
          <div className="mt-4 flex flex-wrap md:overflow-x-auto md:flex-nowrap space-x-2 md:space-x-4 grid grid-cols-2 gap-2 md:flex md:flex-nowrap">
            {historiku.photos &&
              historiku.photos.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full md:w-32 h-32 md:h-32 rounded-lg overflow-hidden cursor-pointer shadow-md transition-transform transform hover:scale-105"
                  onClick={() => openModal(url)} // Open image in modal on click
                >
                  <img
                    src={url}
                    alt={`Historiku Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {/* Optional overlay with caption */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium">Kliko për të parë</p>
                  </div>
                </div>
              ))}
          </div>
          {historiku.photos.length > 4 && (
            <button className="bg-primary text-white px-4 py-2 mt-2">
              Shiko Të Gjitha
            </button>
          )}

          {/* Edit Button */}
          <button
            className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-green-400 w-full md:w-auto"
            onClick={() => {
              setIsEditing(true);
              setFormData({
                title: historiku.title,
                text: historiku.text,
                imageUrl: historiku.imageUrl,
                photos: historiku.photos || [],
              });
            }}
          >
            Edito Historikun
          </button>
        </div>
      ) : (
        <p>No historiku available for this mosque.</p>
      )}

      {/* Modal for viewing image */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div className="bg-white p-4 rounded-lg max-w-lg relative">
            <img
              src={modalImage}
              alt="View"
              className="w-full h-auto object-contain rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
              onClick={closeModal}
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Historiku;
