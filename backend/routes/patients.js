const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// CREATE patient with Id and Name
router.post("/", async (req, res) => {
  try {
    const { Id, Name } = req.body;

    // 1️⃣ Validation
    if (!Id || !Name) {
      return res.status(400).json({
        error: "Id and Name are required"
      });
    }

    // 2️⃣ Check if patient already exists
    const existingPatient = await Patient.findOne({ Id });
    if (existingPatient) {
      return res.status(409).json({
        error: "Patient with this Id already exists"
      });
    }

    // 3️⃣ Create patient (no preOp / intraOp / postOp yet)
    const patient = await Patient.create({
      Id,
      Name,
    });
    console.log(patient)

    res.status(201).json({
      message: "Patient created successfully",
      patient
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to create patient" });
  }
});

module.exports = router;
