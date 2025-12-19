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

    // 2️⃣ Get Intra-Op risk (mandatory dependency)
    const intraRisk =
      patient.intraOp?.IntraOp_Complication_Risk_Percent;

    if (intraRisk === undefined) {
      return res.status(400).json({
        error: "Intra-operative data missing. Cannot run Post-Op."
      });
    }

    // 3️⃣ Combine Intra-Op output with Post-Op inputs
    const postInput = {
      IntraOp_Complication_Risk_Percent: intraRisk,
      ...req.body
    };

    // 4️⃣ Call FastAPI Post-Op model
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/post-operative",
      postInput
    );

    // 5️⃣ Attach ML output
    const postOpData = {
      ...postInput,
      Recovery_Duration_Days:
        mlResponse.data.Recovery_Duration_Days
    };

    // 6️⃣ Update Post-Op data by custom Id
    const updatedPatient = await Patient.findOneAndUpdate(
      { Id: patientId },
      { postOp: postOpData },
      { new: true }
    );

    res.status(200).json({
      message: "Post-operative data updated with prediction",
      patient: updatedPatient
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Post-Op prediction failed" });
  }
});

module.exports = router;
