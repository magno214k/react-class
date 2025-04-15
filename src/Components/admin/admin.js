import React, { useState, useEffect } from "react";
import "./admin.css";
import aplogo from "../assets/admin-logo.svg";
import dash from "../assets/dash.svg";
import appoint from "../assets/appoint.svg";
import adddoc from "../assets/adddoc.svg";
import doclist from "../assets/doclist.svg";
import healthmate from "../assets/healthmate.png";
import Adddoctor from "./adddoctor.js";
import { Link } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [isDashVisible, setIsDashVisible] = useState(false);
  const [isAppoVisible, setIsAppoVisible] = useState(false);
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [isDlistVisible, setIsDlistVisible] = useState(false);

  const [dashButtonClicked, setDashButtonClicked] = useState(false);
  const [appoButtonClicked, setAppoButtonClicked] = useState(false);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [dlistButtonClicked, setDlistButtonClicked] = useState(false);

  const [doctors, setDoctors] = useState([]);
  const [editDoctorId, setEditDoctorId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editPhoto, setEditPhoto] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/doctors`)
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  };

  const handleDashClicked = () => {
    setIsDashVisible(true);
    setDashButtonClicked(true);
    setIsAppoVisible(false);
    setAppoButtonClicked(false);
    setIsAddVisible(false);
    setAddButtonClicked(false);
    setIsDlistVisible(false);
    setDlistButtonClicked(false);
  };

  const handleAppoClicked = () => {
    setIsAppoVisible(true);
    setAppoButtonClicked(true);
    setIsDashVisible(false);
    setDashButtonClicked(false);
    setIsAddVisible(false);
    setAddButtonClicked(false);
    setIsDlistVisible(false);
    setDlistButtonClicked(false);
  };

  const handleAddClicked = () => {
    setIsAddVisible(true);
    setAddButtonClicked(true);
    setIsAppoVisible(false);
    setAppoButtonClicked(false);
    setIsDashVisible(false);
    setDashButtonClicked(false);
    setIsDlistVisible(false);
    setDlistButtonClicked(false);
  };

  const handleDlistClicked = () => {
    setIsDlistVisible(true);
    setDlistButtonClicked(true);
    setIsAppoVisible(false);
    setAppoButtonClicked(false);
    setIsDashVisible(false);
    setDashButtonClicked(false);
    setIsAddVisible(false);
    setAddButtonClicked(false);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditFileChange = (e) => {
    setEditPhoto(e.target.files[0]);
  };

  const handleUpdateDoctor = async () => {
    const formData = new FormData();
    Object.entries(editFormData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    if (editPhoto) formData.append("photo", editPhoto);

    try {
      await axios.put(
        `${process.env.REACT_APP_API_BASE_URL}/update-doctor/${editDoctorId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Doctor updated successfully");
      setEditDoctorId(null);
      fetchDoctors();
    } catch (err) {
      alert("Error updating doctor: " + err.message);
    }
  };

  const handleDeleteDoctor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_BASE_URL}/delete-doctor/${id}`
      );
      alert("Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      alert("Error deleting doctor: " + err.message);
    }
  };

  return (
    <header>
      <div className="ap-nav">
        <div>
          <img src={healthmate} alt="Logo" />
          <p>Admin</p>
        </div>
        <Link to="/adminlogin">
          <button>Logout</button>
        </Link>
      </div>

      <div className="ap-main">
        <div className="ap-left">
          <ul>
            <div
              onClick={handleDashClicked}
              className={`board ${dashButtonClicked ? "button-clicked1" : ""}`}
            >
              <img src={dash} alt="" />
              <p>Dashboard</p>
            </div>
            <div
              onClick={handleAppoClicked}
              className={`board ${appoButtonClicked ? "button-clicked1" : ""}`}
            >
              <img src={appoint} alt="" />
              <p>Appointments</p>
            </div>
            <div
              onClick={handleAddClicked}
              className={`board ${addButtonClicked ? "button-clicked1" : ""}`}
            >
              <img src={adddoc} alt="" />
              <p>Add Doctors</p>
            </div>
            <div
              onClick={handleDlistClicked}
              className={`board ${dlistButtonClicked ? "button-clicked1" : ""}`}
            >
              <img src={doclist} alt="" />
              <p>Doctors List</p>
            </div>
          </ul>
        </div>

        <div
          className={`ap-blank ${
            isDashVisible || isAppoVisible || isAddVisible || isDlistVisible
              ? "hidden"
              : ""
          }`}
        ></div>

        {isDashVisible && <div className="ap-dash"></div>}

        {isAppoVisible && (
          <div className="ap-dash">
            <div>
              <h3>All Appointments</h3>
              <div className="appoint">
                <p className="a-hash">#</p>
                <p className="a-pat">Patient</p>
                <p className="a-age">Age</p>
                <p className="a-time">Date & Time</p>
                <p className="a-doc">Doctor</p>
                <p className="a-fee">Fees</p>
                <p className="a-act">Action</p>
              </div>
            </div>
          </div>
        )}

        {isAddVisible && <Adddoctor />}

        {isDlistVisible && (
          <div className="ap-dash">
            <div className="ap-rowdoc">
              <div className="ap-rowdoc2">
                <h3>All Doctors</h3>
                <div className="ap-row">
                  {doctors.map((doctor) => (
                    <div key={doctor._id} className="ap-row-1">
                      <img
                        src={`http://localhost:5000/${doctor.photo.replace(
                          /\\/g,
                          "/"
                        )}`}
                        alt={doctor.name}
                      />
                      <div>
                        <h3>Dr. {doctor.name}</h3>
                        <p>{doctor.speciality}</p>
                        <input type="checkbox" defaultChecked />
                        <label>Available</label>

                        <div className="doctor-actions">
                          <button
                            onClick={() => {
                              setEditDoctorId(doctor._id);
                              setEditFormData(doctor);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteDoctor(doctor._id)}
                          >
                            Delete
                          </button>
                        </div>

                        {editDoctorId === doctor._id && (
                          <div className="edit-form">
                            <input
                              type="text"
                              name="name"
                              placeholder="Name"
                              value={editFormData.name || ""}
                              onChange={handleEditChange}
                            />
                            <input
                              type="text"
                              name="email"
                              placeholder="Email"
                              value={editFormData.email || ""}
                              onChange={handleEditChange}
                            />
                            <input
                              type="text"
                              name="experience"
                              placeholder="Experience"
                              value={editFormData.experience || ""}
                              onChange={handleEditChange}
                            />
                            <input
                              type="text"
                              name="fees"
                              placeholder="Fees"
                              value={editFormData.fees || ""}
                              onChange={handleEditChange}
                            />
                            <input
                              type="file"
                              onChange={handleEditFileChange}
                            />
                            <div>
                              <button onClick={handleUpdateDoctor}>Save</button>
                              <button onClick={() => setEditDoctorId(null)}>
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Admin;
