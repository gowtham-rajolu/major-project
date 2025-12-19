"use client";
import { useState } from "react";

export default function PreOpForm() {
  const [formData, setFormData] = useState({
    Id: "",
    Name: "",
    Age: "",
    BMI: "",
    Diabetes: "No",
    Hypertension: "No",
    Heart_Disease: "No",
    Chronic_Kidney_Disease: "No",
    COPD: "No",
    Tumor_Size_cm: "",
    Tumor_Stage: "I",
    Metastasis: "No",
    ASA_Score: "",
    ECOG_Score: "",
    Preop_Hb: "",
    Preop_WBC: "",
    Platelets: "",
    Bilirubin: "",
    Creatinine: "",
    INR: "",
    Albumin: "",
    CRP: "",
    Glucose: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const resp = await fetch("http://localhost:5000/api/preop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!resp.ok) {
        throw new Error("Server error");
      }

      const data = await resp.json();   // 🔑 IMPORTANT
      setResult(data);

    } catch (err) {
      setError("Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800">
          Pre-Operative Assessment
        </h1>

        {/* Patient Info */}
        <Section title="Patient Information">
          <Input label="Patient ID" name="Id" onChange={handleChange} />
          <Input label="Patient Name" name="Name" onChange={handleChange} />
          <Input label="Age" name="Age" type="number" onChange={handleChange} />
          <Input label="BMI" name="BMI" type="number" step="0.1" onChange={handleChange} />
        </Section>

        {/* Comorbidities */}
        <Section title="Comorbidities">
          <Select label="Diabetes" name="Diabetes" onChange={handleChange} />
          <Select label="Hypertension" name="Hypertension" onChange={handleChange} />
          <Select label="Heart Disease" name="Heart_Disease" onChange={handleChange} />
          <Select label="Chronic Kidney Disease" name="Chronic_Kidney_Disease" onChange={handleChange} />
          <Select label="COPD" name="COPD" onChange={handleChange} />
        </Section>

        {/* Tumor Details */}
        <Section title="Tumor Characteristics">
          <Input label="Tumor Size (cm)" name="Tumor_Size_cm" type="number" step="0.1" onChange={handleChange} />
          <Select label="Tumor Stage" name="Tumor_Stage" options={["I", "II", "III", "IV"]} onChange={handleChange} />
          <Select label="Metastasis" name="Metastasis" onChange={handleChange} />
          <Input label="ASA Score" name="ASA_Score" type="number" onChange={handleChange} />
          <Input label="ECOG Score" name="ECOG_Score" type="number" onChange={handleChange} />
        </Section>

        {/* Lab Values */}
        <Section title="Laboratory Values">
          <Input label="Hemoglobin (g/dL)" name="Preop_Hb" type="number" step="0.1" onChange={handleChange} />
          <Input label="WBC (×10⁹/L)" name="Preop_WBC" type="number" step="0.1" onChange={handleChange} />
          <Input label="Platelets" name="Platelets" type="number" onChange={handleChange} />
          <Input label="Bilirubin" name="Bilirubin" type="number" step="0.1" onChange={handleChange} />
          <Input label="Creatinine" name="Creatinine" type="number" step="0.1" onChange={handleChange} />
          <Input label="INR" name="INR" type="number" step="0.1" onChange={handleChange} />
          <Input label="Albumin" name="Albumin" type="number" step="0.1" onChange={handleChange} />
          <Input label="CRP" name="CRP" type="number" step="0.1" onChange={handleChange} />
          <Input label="Glucose" name="Glucose" type="number" onChange={handleChange} />
        </Section>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          {loading ? "Predicting..." : "Predict Surgery Risk"}
        </button>

        {/* RESULT */}
        {result && (
          <div className="mt-6 p-4 rounded-lg bg-green-50 border border-green-300">
            <h2 className="font-semibold text-green-700">
              Surgery Success Probability:
            </h2>
            <p className="text-2xl font-bold">
              {(result.Surgery_Success_Probability * 100).toFixed(1)}%
            </p>
          </div>
        )}

        {error && (
          <p className="text-red-600 font-semibold">{error}</p>
        )}
      </form>
    </div>
  );
}

/* ---------- Components ---------- */

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-700 mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
}

function Input({ label, name, type = "text", step, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        step={step}
        name={name}
        onChange={onChange}
        className="mt-1 w-full rounded-md border border-gray-300 p-2"
      />
    </div>
  );
}

function Select({ label, name, onChange, options = ["Yes", "No"] }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600">{label}</label>
      <select
        name={name}
        onChange={onChange}
        className="mt-1 w-full rounded-md border border-gray-300 p-2"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
