const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");
const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    // 1️⃣ Fetch previous Pre-Op data from DB
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const PreOp_Risk_Score =
      patient.preOp?.Surgery_Success_Probability || 0.0;

    // 2️⃣ Combine previous Pre-Op score with new intra-op input
    const intraInput = {
      PreOp_Risk_Score: PreOp_Risk_Score,
      ...req.body
    };

    // 3️⃣ Send to FastAPI ML model
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/intra-operative",
      intraInput
    );

    // 4️⃣ Add prediction to incoming data
    const intraOpData = {
      ...intraInput,
      IntraOp_Complication_Risk_Percent:
        mlResponse.data.IntraOp_Complication_Risk_Percent
    };

    // 5️⃣ Save to MongoDB
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { intraOp: intraOpData },
      { new: true }
    );

    res.json({
      message: "Intra-operative data updated with prediction",
      patient: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Intra-Op prediction failed" });
  }
});

module.exports = router;