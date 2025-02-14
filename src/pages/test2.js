import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const Njoftimet = ({ mosqueId }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const auth = getAuth();
  const storage = getStorage();

  useEffect(() => {
    fetchAnnouncements();
  }, [mosqueId]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const token = await auth.currentUser.getIdToken();
      console.log(token);
      const response = await axios.get(
        `http://localhost:3001/mosques/${mosqueId}/njoftimet`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAnnouncements(response.data);
      setError(null);
    } catch (err) {
      setAnnouncements([]);
      setError("Failed to fetch announcements.");
    } finally {
      setLoading(false);
    }
  };

  const handlePostAnnouncement = async () => {
    if (!title || !text) {
      alert("Ju lutem plotësoni të gjitha fushat!");
      return;
    }

    const formData = new FormData();
    console.log(formData);

    formData.append("title", title);
    formData.append("text", text);
    if (image) formData.append("image", image);

    try {
      const token = await auth.currentUser.getIdToken();
      await axios.post(
        `http://localhost:3001/mosques/${mosqueId}/njoftimet`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Njoftimi u shtua me sukses!");
      setShowModal(false);
      fetchAnnouncements(); // Refresh the announcement list
    } catch (error) {
      alert("Ndodhi një gabim gjatë postimit të njoftimit.");
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
  if (error) return <p>{error}</p>;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Njoftimet</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          onClick={() => setShowModal(true)}
        >
          Shto Njoftim
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-gray-600">Nuk keni bërë asnjë njoftim.</p>
          <button
            className="bg-blue-600 text-white mt-4 px-4 py-2 rounded-md hover:bg-blue-700"
            onClick={() => setShowModal(true)}
          >
            Bëni njoftimin e parë tuajin
          </button>
        </div>
      ) : (
        announcements.map(({ id, Text, text, datePosted, imageUrl }) => (
          <div key={id} className="p-4 mb-4 bg-white shadow-md rounded-md">
            <h3 className="font-semibold text-lg">{Text}</h3>
            {imageUrl && (
              <img
                src={imageUrl}
                alt={Text}
                className="w-full h-40 object-cover rounded-md my-2"
              />
            )}
            <p>{text}</p>
          </div>
        ))
      )}

      {/* Modal for Adding Announcement */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Shto Njoftim</h2>
            <input
              type="text"
              placeholder="Titulli i njoftimit"
              className="border w-full p-2 mb-4 rounded-md"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Teksti i njoftimit"
              className="border w-full p-2 mb-4 rounded-md"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <input
              type="file"
              className="mb-4"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                onClick={() => setShowModal(false)}
              >
                Anulo
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                onClick={handlePostAnnouncement}
              >
                Posto Njoftimin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Njoftimet;
