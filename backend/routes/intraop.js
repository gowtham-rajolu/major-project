const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");

const router = express.Router();

// UPDATE Intra-op + ML Prediction (by Patient Id)
router.put("/:id", async (req, res) => {
  try {
    const patientId = Number(req.params.id);
    const intraOpInput = req.body;

    console.log("IntraOp Input:", intraOpInput);

    // 1️⃣ Find patient
    const patient = await Patient.findOne({ Id: patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2️⃣ Prepare ML input (add PreOp risk score)
    const mlInput = {
      PreOp_Risk_Score:
        patient.preOp?.Surgery_Success_Probability || 0,
      ...intraOpInput
    };

    // 3️⃣ Call FastAPI ML
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/intra-operative",
      mlInput
    );

    // 4️⃣ Save IntraOp + ML output
    patient.intraOp = {
      ...mlInput,
      IntraOp_Complication_Risk_Percent:
        mlResponse.data.IntraOp_Complication_Risk_Percent
    };

    // 🔑 CRITICAL: UNLOCK NEXT STAGE
    patient.stages.intraOpCompleted = true;

    await patient.save();

    res.status(200).json({
      message: "Intra-operative data updated with prediction",
      patient
    });
  } catch (error) {
    console.error("IntraOp Error:", error.message);
    res.status(500).json({ error: "Intra-operative prediction failed" });
  }
});

module.exports = router;
