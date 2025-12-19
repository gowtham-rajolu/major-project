"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function Dashboard() {
  const { id } = useParams();

  const [preOpData, setPreOpData] = useState({
    Id: "",
    Name: "",
    Age: "",
    BMI: "",
    Diabetes: "",
    Hypertension: "",
    Heart_Disease: "",
    Chronic_Kidney_Disease: "",
    COPD: "",
    Tumor_Size_cm: "",
    Tumor_Stage: "",
    Metastasis: "",
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
    Glucose: "",
    Surgery_Success_Probability: ""
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchPatient = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/data/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.error);

        setPreOpData({
          Id: data.patient.Id,
          Name: data.patient.Name,
          ...data.patient.preOp
        });
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  if (loading)
    return <div className="p-10 text-lg font-semibold">Loading patient data…</div>;

  if (error)
    return <div className="p-10 text-red-600 font-semibold">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patient Dashboard</h1>
        <p className="text-gray-600">
          Patient ID: <span className="font-semibold">{preOpData.Id}</span>
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Name:</strong> {preOpData.Name}</p>
          <p><strong>Age:</strong> {preOpData.Age}</p>
          <p><strong>BMI:</strong> {preOpData.BMI}</p>
          <p><strong>Diabetes:</strong> {preOpData.Diabetes}</p>
          <p><strong>Hypertension:</strong> {preOpData.Hypertension}</p>
          <p><strong>COPD:</strong> {preOpData.COPD}</p>
        </div>
      </div>

      {/* Tumor Details */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Tumor Details</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-700">
          <p><strong>Size (cm):</strong> {preOpData.Tumor_Size_cm}</p>
          <p><strong>Stage:</strong> {preOpData.Tumor_Stage}</p>
          <p><strong>Metastasis:</strong> {preOpData.Metastasis}</p>
          <p><strong>ASA Score:</strong> {preOpData.ASA_Score}</p>
          <p><strong>ECOG Score:</strong> {preOpData.ECOG_Score}</p>
        </div>
      </div>

      {/* Lab Values */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Laboratory Values</h2>
        <div className="grid grid-cols-3 gap-4 text-gray-700">
          <p><strong>Hb:</strong> {preOpData.Preop_Hb}</p>
          <p><strong>WBC:</strong> {preOpData.Preop_WBC}</p>
          <p><strong>Platelets:</strong> {preOpData.Platelets}</p>
          <p><strong>Bilirubin:</strong> {preOpData.Bilirubin}</p>
          <p><strong>Creatinine:</strong> {preOpData.Creatinine}</p>
          <p><strong>INR:</strong> {preOpData.INR}</p>
          <p><strong>Albumin:</strong> {preOpData.Albumin}</p>
          <p><strong>CRP:</strong> {preOpData.CRP}</p>
          <p><strong>Glucose:</strong> {preOpData.Glucose}</p>
        </div>
      </div>

      {/* Risk Result */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-red-700 mb-2">
          Surgery Success Probability
        </h2>
        <p className="text-4xl font-bold text-red-600">
          {preOpData.Surgery_Success_Probability}
        </p>
      </div>
    </div>
  );
}
