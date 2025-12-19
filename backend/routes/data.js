const express = require("express");
const Patient = require("../models/Patient");

const router = express.Router();

// GET patient data by Id (for dashboard)
router.get("/:id", async (req, res) => {
  try {
    const patientId = Number(req.params.id);

    if (Number.isNaN(patientId)) {
      return res.status(400).json({
        error: "Invalid patient Id"
      });
    }

    const patient = await Patient.findOne({ Id: patientId });

    if (!patient) {
      return res.status(404).json({
        error: "Patient not found"
      });
    }

    res.status(200).json({
      message: "Patient data fetched successfully",
      patient
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      error: "Failed to fetch patient data"
    });
  }
});

module.exports = router;
