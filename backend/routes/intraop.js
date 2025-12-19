const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");

const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    const patientId = Number(req.params.id);

    // 1️⃣ Fetch patient by custom Id
    const patient = await Patient.findOne({ Id: patientId });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // 2️⃣ Get Pre-Op output (mandatory dependency)
    const preOpRisk =
      patient.preOp?.Surgery_Success_Probability;

    if (preOpRisk === undefined) {
      return res.status(400).json({
        error: "Pre-operative data missing. Cannot run Intra-Op."
      });
    }

    // 3️⃣ Combine Pre-Op output with Intra-Op inputs
    const intraInput = {
      PreOp_Risk_Score: preOpRisk,
      ...req.body
    };
console.log(intraInput)
    // 4️⃣ Call FastAPI Intra-Op model
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/intra-operative",
      intraInput
    );

    // 5️⃣ Attach ML output
    const intraOpData = {
      ...intraInput,
      IntraOp_Complication_Risk_Percent:
        mlResponse.data.IntraOp_Complication_Risk_Percent
    };

    // 6️⃣ Update Intra-Op data by custom Id
    const updatedPatient = await Patient.findOneAndUpdate(
      { Id: patientId },
      { intraOp: intraOpData },
      { new: true }
    );

    res.status(200).json({
      message: "Intra-operative data updated with prediction",
      patient: updatedPatient
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Intra-Op prediction failed" });
  }
});

module.exports = router;
