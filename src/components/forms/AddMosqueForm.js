import React, { useState } from "react";
import { storage } from "../../firebaseConfig"; // Import storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Firebase storage methods

const AddMosqueForm = ({ isOpen, onClose, onSubmit }) => {
  const [mosqueData, setMosqueData] = useState({
    emri: "",
    adresa: "",
    kontakti: "",
    website: "",
    disponueshmeria: "",
    customId: "",
    image: null, // Store the selected image file
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setMosqueData((prevState) => ({ ...prevState, [id]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    setMosqueData((prevState) => ({ ...prevState, image: file }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const { image, ...restData } = mosqueData;

    if (image) {
      try {
        const imageRef = ref(storage, `mosque-images/${image.name}`); // Storage reference for the image
        const uploadTask = uploadBytesResumable(imageRef, image);

        // Wait for the upload to finish
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can track progress here if necessary
          },
          (error) => {
            console.error("Image upload failed:", error);
            alert("Failed to upload image");
          },
          async () => {
            // Get the download URL of the uploaded image
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const mosqueDataWithImage = { ...restData, imageUrl: downloadURL }; // Add the download URL to the mosque data
            onSubmit(mosqueDataWithImage); // Submit the mosque data with image URL
          }
        );
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image");
      }
    } else {
      // If no image, submit the form without it
      onSubmit(mosqueData);
    }

    // Reset the form
    setMosqueData({
      emri: "",
      adresa: "",
      kontakti: "",
      website: "",
      disponueshmeria: "",
      customId: "",
      image: null,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Shto Xhami</h2>
        <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="emri" className="block text-sm font-semibold mb-1">
              Emri i Xhamisë
            </label>
            <input
              type="text"
              id="emri"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={mosqueData.emri}
              onChange={handleChange}
              required
              placeholder="Shkruani emrin e xhamisë"
            />
          </div>
          <div>
            <label
              htmlFor="adresa"
              className="block text-sm font-semibold mb-1"
            >
              Adresa
            </label>
            <input
              type="text"
              id="adresa"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={mosqueData.adresa}
              onChange={handleChange}
              required
              placeholder="Shkruani adresën e xhamisë"
            />
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-semibold mb-1">
              Imazhi i Xhamisë
            </label>
            <input
              type="file"
              id="image"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleFileChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor="kontakti"
              className="block text-sm font-semibold mb-1"
            >
              Kontakti
            </label>
            <input
              type="text"
              id="kontakti"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 "
              value={mosqueData.kontakti}
              onChange={handleChange}
              placeholder="Shkruani numrin e telefonit ose emailin"
            />
          </div>
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-semibold mb-1"
            >
              Website
            </label>
            <input
              type="url"
              id="website"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={mosqueData.website}
              onChange={handleChange}
              placeholder="Shkruani faqen zyrtare të xhamisë"
            />
          </div>
          <div>
            <label htmlFor="hapur" className="block text-sm font-semibold mb-1">
              Disponueshmeria
            </label>
            <input
              type="text"
              id="hapur"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={mosqueData.hapur}
              onChange={handleChange}
              placeholder="Shkruani orarin (p.sh., 24/7)"
            />
          </div>

          <div>
            <label
              htmlFor="customId"
              className="block text-sm font-semibold mb-1"
            >
              ID Xhamisë
            </label>
            <input
              type="text"
              id="customId"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={mosqueData.customId}
              onChange={handleChange}
              placeholder="p.sh., xhamia-e-madhe"
            />
          </div>

          <div className="col-span-2 flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600"
            >
              Mbyll
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600"
            >
              Shto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMosqueForm;
