const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");

const router = express.Router();

// UPDATE Post-op + ML Prediction (by Patient Id)
router.put("/:id", async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    const postOpInput = req.body;

    console.log("PostOp Input:", postOpInput);

    // 1️⃣ Find patient
    const patient = await Patient.findOne({ Id: patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2️⃣ Prepare ML input (add IntraOp risk)
    const mlInput = {
      IntraOp_Complication_Risk_Percent:
        patient.intraOp?.IntraOp_Complication_Risk_Percent || 0,
      ...postOpInput
    };

    // 3️⃣ Call FastAPI ML
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/post-operative",
      mlInput
    );

    // 4️⃣ Save PostOp + ML output
    patient.postOp = {
      ...mlInput,
      Recovery_Duration_Days:
        mlResponse.data.Recovery_Duration_Days
    };

    // 🔑 CRITICAL: FINAL STAGE COMPLETE
    patient.stages.postOpCompleted = true;

    await patient.save();

    res.status(200).json({
      message: "Post-operative data updated with prediction",
      patient
    });
  } catch (error) {
    console.error("PostOp Error:", error.message);
    res.status(500).json({ error: "Post-operative prediction failed" });
  }
});

module.exports = router;
