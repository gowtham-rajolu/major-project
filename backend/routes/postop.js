const express = require("express");
const axios = require("axios");
const Patient = require("../models/Patient");
const router = express.Router();

router.put("/:id", async (req, res) => {
  try {
    // 1️⃣ Fetch previous Intra-Op data from DB
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const IntraOp_Complication_Risk_Percent =
      patient.intraOp?.IntraOp_Complication_Risk_Percent || 0.0;

    // 2️⃣ Combine previous intra-op value with new post-op input
    const postInput = {
      IntraOp_Complication_Risk_Percent: IntraOp_Complication_Risk_Percent,
      ...req.body
    };

    // 3️⃣ Call FastAPI ML model
    const mlResponse = await axios.post(
      "http://127.0.0.1:8000/predict/post-operative",
      postInput
    );

    // 4️⃣ Add prediction to DB object
    const postOpData = {
      ...postInput,
      Recovery_Duration_Days: mlResponse.data.Recovery_Duration_Days
    };

    // 5️⃣ Update MongoDB document
    const updated = await Patient.findByIdAndUpdate(
      req.params.id,
      { postOp: postOpData },
      { new: true }
    );

    res.json({
      message: "Post-operative data updated with prediction",
      patient: updated
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Post-Op prediction failed" });
  }
});

module.exports = router;
