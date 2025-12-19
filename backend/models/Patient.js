const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema(
  {
    // ===== Patient Identity =====
    Id: {
      type: Number,
      required: true,
      unique: true,
      index: true
    },

    Name: {
      type: String,
      required: true,
      trim: true
    },

    // ===== Stage Completion Flags =====
    stages: {
      preOpCompleted: { type: Boolean, default: false },
      intraOpCompleted: { type: Boolean, default: false },
      postOpCompleted: { type: Boolean, default: false }
    },

    // ===== Pre-Operative =====
    preOp: {
      Age: Number,
      BMI: Number,
      Diabetes: String,
      Hypertension: String,
      Heart_Disease: String,
      Chronic_Kidney_Disease: String,
      COPD: String,
      Tumor_Size_cm: Number,
      Tumor_Stage: String,
      Metastasis: String,
      ASA_Score: Number,
      ECOG_Score: Number,
      Preop_Hb: Number,
      Preop_WBC: Number,
      Platelets: Number,
      Bilirubin: Number,
      Creatinine: Number,
      INR: Number,
      Albumin: Number,
      CRP: Number,
      Glucose: Number,

      // Model output
      Surgery_Success_Probability: Number
    },

    // ===== Intra-Operative =====
    intraOp: {
      PreOp_Risk_Score: Number,
      Surgery_Type: String,
      Surgery_Approach: String,
      Surgery_Duration_Min: Number,
      Anesthesia_Duration_Min: Number,
      Blood_Loss_ml: Number,
      Transfusion_Units: Number,
      IntraOp_Hypotension: String,
      IntraOp_Tachycardia: String,
      Vasopressor_Use: String,
      IntraOp_Lactate: Number,

      // Model output
      IntraOp_Complication_Risk_Percent: Number
    },

    // ===== Post-Operative =====
    postOp: {
      IntraOp_Complication_Risk_Percent: Number,
      Complication_Severity_Score: Number,
      ICU_LOS_Days: Number,
      Ventilation_Hours: Number,
      Postop_Hb: Number,
      Postop_WBC: Number,
      Postop_CRP: Number,
      Postop_Glucose: Number,
      Drain_Amylase: Number,
      POPF: String,
      Reoperation: String,
      LOS_Hospital_Days: Number,
      PostOp_Risk_Score: Number,

      // Model output
      Recovery_Duration_Days: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", PatientSchema);
