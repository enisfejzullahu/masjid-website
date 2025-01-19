import React, { useState, useEffect } from "react";
import { assignMosqueToAdmin } from "../services/authService"; // Use the function created earlier
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AssignMosque = () => {
  const [admins, setAdmins] = useState([]);
  const [mosques, setMosques] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState("");
  const [selectedMosque, setSelectedMosque] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdmins = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const admins = querySnapshot.docs
        .filter(
          (doc) => doc.data().role === "mosque-admin" && !doc.data().mosqueId
        )
        .map((doc) => ({ id: doc.id, ...doc.data() }));
      setAdmins(admins);
    };

    const fetchMosques = async () => {
      const querySnapshot = await getDocs(collection(db, "mosques"));
      setMosques(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchAdmins();
    fetchMosques();
  }, []);

  const handleAssign = async () => {
    try {
      await assignMosqueToAdmin(selectedAdmin, selectedMosque);
      setMessage("Mosque assigned successfully!");
    } catch (error) {
      setMessage("Failed to assign mosque.");
    }
  };

  return (
    <div>
      <h1>Assign Mosque to Admin</h1>
      <select
        onChange={(e) => setSelectedAdmin(e.target.value)}
        value={selectedAdmin}
      >
        <option value="">Select Admin</option>
        {admins.map((admin) => (
          <option key={admin.id} value={admin.id}>
            {admin.fullName}
          </option>
        ))}
      </select>
      <select
        onChange={(e) => setSelectedMosque(e.target.value)}
        value={selectedMosque}
      >
        <option value="">Select Mosque</option>
        {mosques.map((mosque) => (
          <option key={mosque.id} value={mosque.id}>
            {mosque.name}
          </option>
        ))}
      </select>
      <button onClick={handleAssign}>Assign</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AssignMosque;
