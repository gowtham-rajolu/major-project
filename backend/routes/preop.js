const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");
const router = express.Router();

// CREATE Pre-op Document + Get ML Prediction
router.post("/", async (req, res) => {
  try {
    // 1. Send data to FastAPI ML endpoint
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/pre-operative",
      req.body
    );

    // 2. Add prediction to document
    const preOpData = {
      ...req.body,
      Surgery_Success_Probability: mlResponse.data.Surgery_Success_Probability
    };

    // 3. Save to MongoDB
    const patient = await Patient.create({ preOp: preOpData });

    res.status(201).json({
      message: "Pre-operative data saved and prediction added",
      patient
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Prediction or DB error" });
  }
});

module.exports = router;
