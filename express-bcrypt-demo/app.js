const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/db.js')
const bcrypt = require('bcrypt');
const User = require('./model/userModel.js');

const app = express();
app.use(express.json());
connectDB()

//register route
app.post("/api/users", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Generate a salt (a random value added to the hash to increase security)
      const salt = await bcrypt.genSalt(10); // 10 rounds of salt generation
      // Hash the password with the salt
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user with the hashed password
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

//login route

  app.post("/api/users/login", async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Find the user by username
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      // Compare the input password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }
  
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});