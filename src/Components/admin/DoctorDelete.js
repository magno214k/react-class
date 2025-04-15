import React, { useState } from "react";
import axios from "axios";

const DoctorDelete = () => {
  const [id, setId] = useState("");

  const handleDelete = async () => {
    if (!id) return alert("Please enter doctor ID");
    if (!window.confirm("Are you sure to delete this doctor?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/delete-doctor/${id}`
      );
      alert("Doctor deleted successfully");
    } catch (err) {
      alert("Error deleting doctor: " + err.message);
    }
  };

  return (
    <div>
      <h3>Delete Doctor</h3>
      <input
        type="text"
        placeholder="Doctor ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DoctorDelete;
