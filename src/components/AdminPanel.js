import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AdminPanel = () => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const pending = usersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.role === "pending");
      setPendingUsers(pending);
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (userId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { role: "admin" }); // Example: Assign admin role
    setPendingUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Panel</h1>
      <p className="text-gray-600 italic pt-2">Manage pending user approvals</p>
      <div className="mt-6">
        {pendingUsers.length > 0 ? (
          pendingUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center bg-gray-100 p-4 mb-4 rounded"
            >
              <div>
                <p className="font-bold">{user.fullName}</p>
                <p>{user.email}</p>
                <p>{user.phoneNumber}</p>
              </div>
              <button
                onClick={() => approveUser(user.id)}
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-light transition"
              >
                Approve
              </button>
            </div>
          ))
        ) : (
          <p>No pending users</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
