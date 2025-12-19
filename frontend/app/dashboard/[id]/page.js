"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PreOpForm from "./forms/PreOpForm";
import IntraOpForm from "./forms/IntraOpForm";
import PostOpForm from "./forms/PostOpForm";

export default function DashboardPage() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("preop");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===============================
  // Fetch patient from backend
  // ===============================
  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`http://localhost:5000/data/${id}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch patient");
      }

      setPatient(data.patient);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch on load / id change
  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  // ===============================
  // DEBUG (optional, remove later)
  // ===============================
  useEffect(() => {
    if (patient) {
      console.log("PATIENT STATE:", patient);
      console.log("STAGES:", patient.stages);
    }
  }, [patient]);

  // ===============================
  // UI STATES
  // ===============================
  if (loading) return <p className="p-6">Loading patient data...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!patient) return null;

  const { stages } = patient;

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-2xl font-bold">Patient Dashboard</h1>
        <p className="text-gray-600">
          ID: <b>{patient.Id}</b> | Name: <b>{patient.Name}</b>
        </p>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-3 mb-6">
        {/* PRE-OP */}
        <button
          onClick={() => setActiveTab("preop")}
          className={`px-4 py-2 rounded ${
            activeTab === "preop"
              ? "bg-blue-600 text-white"
              : "bg-white"
          }`}
        >
          Pre-Op
        </button>

        {/* INTRA-OP */}
        <button
          disabled={!stages.preOpCompleted}
          onClick={() => setActiveTab("intraop")}
          className={`px-4 py-2 rounded ${
            activeTab === "intraop"
              ? "bg-orange-600 text-white"
              : "bg-white"
          } ${
            !stages.preOpCompleted &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          Intra-Op
        </button>

        {/* POST-OP */}
        <button
          disabled={!stages.intraOpCompleted}
          onClick={() => setActiveTab("postop")}
          className={`px-4 py-2 rounded ${
            activeTab === "postop"
              ? "bg-red-600 text-white"
              : "bg-white"
          } ${
            !stages.intraOpCompleted &&
            "opacity-50 cursor-not-allowed"
          }`}
        >
          Post-Op
        </button>
      </div>

      {/* ================= ACTIVE FORM ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        {activeTab === "preop" && (
          <PreOpForm
            patientId={patient.Id}
            initialData={patient.preOp}
            onSuccess={fetchPatient}
          />
        )}

        {activeTab === "intraop" && (
          <IntraOpForm
            patientId={patient.Id}
            initialData={patient.intraOp}
            onSuccess={fetchPatient}
          />
        )}

        {activeTab === "postop" && (
          <PostOpForm
            patientId={patient.Id}
            initialData={patient.postOp}
            onSuccess={fetchPatient}
          />
        )}
      </div>
    </div>
  );
}
