const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(
  "mongodb+srv://sukhbirmundlia:sachin123@cluster0.3b0qq.mongodb.net/test",
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.log(err));

// Schema & Model
const UserSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, unique: true }, // unique phone
  email: String,
  pincode: String,
  city: String,
  state: String,
});

const User = mongoose.model("User", UserSchema);

// ---------------- APIs ---------------- //

// ✅ Save or Update User (POST)
app.post("/api/users", async (req, res) => {
  try {
    const { phone, name, email, pincode, city, state } = req.body;

    if (!phone) {
      return res.status(400).json({ success: false, message: "❌ Phone is required" });
    }

    // find by phone and update, or insert if not exists
    const user = await User.findOneAndUpdate(
      { phone },
      { name, email, pincode, city, state },
      { new: true, upsert: true } // new = return updated, upsert = insert if not found
    );

    res.json({ success: true, message: "✅ User data saved/updated!", user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get All Users
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get Single User by Phone
app.get("/api/users/:phone", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone });
    if (!user) {
      return res.status(404).json({ success: false, message: "❌ User not found" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
