const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect("mongodb://localhost:27017/testdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => console.log("Connected to MongoDB"));

// Create upload directory if not exists
const doctorUploadDir = "./uploads/doctors";
if (!fs.existsSync(doctorUploadDir)) {
  fs.mkdirSync(doctorUploadDir, { recursive: true });
}

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, doctorUploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Static folder to serve photos
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// Doctor schema
const doctorSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  experience: String,
  fees: String,
  speciality: String,
  degree: String,
  address1: String,
  address2: String,
  about: String,
  photo: String,
});
const Doctor = mongoose.model("Doctor", doctorSchema);

// Doctor registration route
app.post("/api/add-doctor", upload.single("photo"), async (req, res) => {
  console.log("Add doctor route hit"); // ← Check this shows in console
  try {
    const {
      name,
      email,
      password,
      experience,
      fees,
      speciality,
      degree,
      address1,
      address2,
      about,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      experience,
      fees,
      speciality,
      degree,
      address1,
      address2,
      about,
      photo: req.file ? req.file.path : null,
    });
    console.log("Body:", req.body);
    console.log("File:", req.file);
    await newDoctor.save();
    res.status(201).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    res.status(500).json({ message: "Failed to add doctor" });
  }
});

// ✅ Register Route
app.post("/api/create", async (req, res) => {
  try {
    console.log("Receve Data:", req.body);
    const { full_name, email, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Hash password and save new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ full_name, email, password: hashedPassword });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});
app.get("/api/doctors", async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch doctors" });
  }
});

app.put("/api/update-doctor/:id", upload.single("photo"), async (req, res) => {
  try {
    const doctorId = req.params.id;

    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.path;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(doctorId, updateData, {
      new: true,
    });

    if (!updatedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor updated successfully", updatedDoctor });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ message: "Failed to update doctor" });
  }
});
app.delete("/api/delete-doctor/:id", async (req, res) => {
  try {
    const doctorId = req.params.id;
    const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

    if (!deletedDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
});

// ✅ Login Route
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: "Server error. Try again later." });
  }
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
