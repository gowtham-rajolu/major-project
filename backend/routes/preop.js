const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");

const router = express.Router();

// UPDATE Pre-op + ML Prediction (by Patient Id)
router.put("/:id", async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    const preOpInput = req.body;

    console.log("PreOp Input:", preOpInput);

    // 1️⃣ Check patient exists
    const patient = await Patient.findOne({ Id: patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2️⃣ Call FastAPI ML
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/pre-operative",
      preOpInput
    );

    // 3️⃣ Attach ML output
    patient.preOp = {
      ...preOpInput,
      Surgery_Success_Probability:
        mlResponse.data.Surgery_Success_Probability
    };

    // 🔑 THIS IS THE MISSING LINE (CRITICAL)
    patient.stages.preOpCompleted = true;

    // 4️⃣ Save patient
    await patient.save();

    res.status(200).json({
      message: "Pre-operative data updated with prediction",
      patient
    });
  } catch (error) {
    console.error("PreOp Error:", error.message);
    res.status(500).json({ error: "Prediction or DB error" });
  }
});

module.exports = router;
