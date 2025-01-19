import React, { useState, useEffect } from "react";
import { query, collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const UsersSection = () => {
  const [admins, setAdmins] = useState([]);
  const [mosques, setMosques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMosques, setSelectedMosques] = useState({});
  const [modalData, setModalData] = useState(null); // Modal state for confirmation
  const [actionType, setActionType] = useState(""); // Assign or Revoke action
  const [searchQuery, setSearchQuery] = useState(""); // Search state

  // Function to fetch admins
  const fetchAdmins = async () => {
    try {
      const adminsQuery = query(collection(db, "users"));
      const adminsSnapshot = await getDocs(adminsQuery);
      const adminsList = adminsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAdmins(adminsList);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  // Function to fetch mosques from the API
  const fetchMosques = async () => {
    try {
      const response = await fetch(
        "https://masjid-app-7f88783a8532.herokuapp.com/mosques"
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const mosquesList = await response.json();
      setMosques(mosquesList);
    } catch (error) {
      console.error("Error fetching mosques from API:", error);
    }
  };

  // Fetch admins and mosques on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchAdmins(), fetchMosques()]);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle assigning mosque to user
  const handleAssign = async (userId) => {
    const mosqueId = selectedMosques[userId];
    if (!mosqueId) {
      alert("Please select a mosque before assigning.");
      return;
    }

    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { mosqueId });

      setAdmins((prevAdmins) =>
        prevAdmins.map((user) =>
          user.id === userId ? { ...user, mosqueId } : user
        )
      );

      alert("Mosque assigned successfully!");
      setModalData(null); // Close modal
    } catch (error) {
      console.error("Error assigning mosque:", error);
    }
  };

  // Handle revoking mosque from user
  const handleRevoke = async (userId) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { mosqueId: null });

      setAdmins((prevAdmins) =>
        prevAdmins.map((user) =>
          user.id === userId ? { ...user, mosqueId: null } : user
        )
      );

      alert("Mosque revoked successfully!");
      setModalData(null); // Close modal
    } catch (error) {
      console.error("Error revoking mosque:", error);
    }
  };

  // Handle modal actions
  const handleModalConfirm = () => {
    if (actionType === "assign") {
      handleAssign(modalData.userId);
    } else if (actionType === "revoke") {
      handleRevoke(modalData.userId);
    }
  };

  const handleModalCancel = () => {
    setModalData(null); // Close modal
  };

  // Handle change in select dropdown
  const handleSelectChange = (userId, mosqueId) => {
    setSelectedMosques((prev) => ({
      ...prev,
      [userId]: mosqueId,
    }));
  };

  // Filter admins based on search query
  const filteredAdmins = admins.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mb-4">
      <h1 className="text-2xl font-semibold mb-6">Users Section</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Kerko per emer ose email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAdmins.map((user) => (
            <div
              key={user.id}
              className="border rounded p-4 shadow"
            >
              <div>
                <h2 className="text-lg font-bold">{user.fullName}</h2>
                <p className="text-gray-600">Email: {user.email}</p>
                <p className="text-gray-600">Phone: {user.phoneNumber}</p>
                <p className="text-gray-600">
                  Assigned Mosque:{" "}
                  {user.mosqueId
                    ? mosques.find((mosque) => mosque.id === user.mosqueId)
                        ?.emri || "Not found"
                    : "None"}
                </p>
              </div>

              <div className="mt-4">
                <select
                  style={{ color: "black", backgroundColor: "white" }}
                  onChange={(e) => handleSelectChange(user.id, e.target.value)}
                  value={selectedMosques[user.id] || ""}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Mosque</option>
                  {mosques.map((mosque) => (
                    <option key={mosque.id} value={mosque.id}>
                      {mosque.emri}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setModalData({ userId: user.id });
                    setActionType("assign");
                  }}
                  className="bg-green-500 text-white py-2 px-4 mt-2 rounded w-full hover:bg-green-700"
                >
                  Assign
                </button>

                {user.mosqueId && (
                  <button
                    onClick={() => {
                      setModalData({ userId: user.id });
                      setActionType("revoke");
                    }}
                    className="bg-red-500 text-white py-2 px-4 mt-2 rounded w-full hover:bg-red-700"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {modalData && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Are you sure you want to{" "}
              {actionType === "assign"
                ? "assign this mosque?"
                : "revoke this mosque?"}
            </h3>
            <div className="flex justify-between">
              <button
                onClick={handleModalConfirm}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Yes, Confirm
              </button>
              <button
                onClick={handleModalCancel}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersSection;
