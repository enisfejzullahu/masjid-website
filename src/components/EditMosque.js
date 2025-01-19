import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const EditMosque = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mosque, setMosque] = useState(null);

  useEffect(() => {
    const fetchMosqueDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/mosques/${id}`);
        setMosque(response.data);
      } catch (error) {
        console.error("Error fetching mosque details:", error);
      }
    };
    fetchMosqueDetails();
  }, [id]);

  const handleEditSubmit = async (updatedData) => {
    try {
      await axios.put(`http://localhost:3001/mosques/${id}`, updatedData);
      alert("Mosque updated successfully!");
      navigate(`/dashboard/mosque/${id}`);
    } catch (error) {
      console.error("Error updating mosque:", error);
      alert("Failed to update mosque.");
    }
  };

  if (!mosque) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Edit Mosque</h1>
    </div>
  );
};

export default EditMosque;
