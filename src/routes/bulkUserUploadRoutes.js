const express = require("express");
const multer = require("multer");
const User = require("../models/User");
const XLSX = require("xlsx");
const bcrypt = require("bcrypt");

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const workbook = XLSX.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[sheetName];
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(sheet);
    console.log(data);

    const users = data.map((row) => ({
      name: row.name,
      email: row.email,
      username: row.username,
      phone: row.phone,
      password: bcrypt.hashSync("Abcd@1234", 12),
    }));

    // insert many users at once

    const insertedUsers = await User.insertMany(users, { ordered: false });

    // return inserted user with default password info

    const response = insertedUsers.map((user) => ({
      name: user.name,
      email: user.email,
      username: user.username,
      phone: user.phone,
    }));

    res.json({ message: "User created successfully", users: response });
  } catch (error) {
    console.error("Bulk registration failed");

    if (error.code === 11000) {
      let duplicateField = error.keyPattern
        ? Object.keys(error.keyPattern)[0]
        : "field";
      let duplicateValue =error.keyValue? error.keyValue[duplicateField]:"value";
      return res.status(400).json({
        error: "Duplicate Entry",
        message: `${duplicateField} ${duplicateValue} already exists`,
      });
    }
    res
      .status(500)
      .json({ error: "Bulk registration failed", details: error.message });
  }
});

module.exports = router;
