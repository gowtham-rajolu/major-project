const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");

const router = express.Router();

// UPDATE Pre-op + ML Prediction (by Patient Id)
router.put("/:id", async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    const preOpInput = req.body;

    // 1️⃣ Check patient exists
    const patientExists = await Patient.findOne({ Id: patientId });
    if (!patientExists) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2️⃣ Send ONLY preOp data to ML
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/pre-operative",
      preOpInput
    );

    // 3️⃣ Attach ML output
    const enrichedPreOp = {
      ...preOpInput,
      Surgery_Success_Probability:
        mlResponse.data.Surgery_Success_Probability
    };

    // 4️⃣ Update patient by custom Id
    const updatedPatient = await Patient.findOneAndUpdate(
      { Id: patientId },
      { preOp: enrichedPreOp },
      { new: true }
    );

    res.status(200).json({
      message: "Pre-operative data updated with prediction",
      patient: updatedPatient
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Prediction or DB error" });
  }
});

module.exports = router;
