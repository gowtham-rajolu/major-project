"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

import PreOpForm from "./forms/PreOpForm";
import IntraOpForm from "./forms/IntraOpForm";
import PostOpForm from "./forms/PostOpForm";

export default function DashboardPage() {
  const { id } = useParams();

  const [patient, setPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH PATIENT =================
  const fetchPatient = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:5000/data/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPatient(data.patient);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchPatient();
  }, [id]);

  if (loading) return <p className="p-6">Loading patient data…</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!patient) return null;

  const { preOp, intraOp, postOp, stages } = patient;

  // ================= PRE-OP RADAR =================
  const preOpRadarData = preOp
    ? [
        { metric: "BMI", value: Math.min(preOp.BMI * 4, 100) },
        { metric: "Hb", value: Math.min(preOp.Preop_Hb * 6, 100) },
        { metric: "WBC", value: Math.min(preOp.Preop_WBC * 5, 100) },
        { metric: "Albumin", value: Math.min(preOp.Albumin * 25, 100) },
        { metric: "CRP", value: Math.min(preOp.CRP * 3, 100) },
        { metric: "Glucose", value: Math.min(preOp.Glucose / 2, 100) }
      ]
    : [];

  // ================= INTRA-OP BAR =================
  const intraOpBarData = intraOp
    ? [
        { name: "Surgery Time", value: intraOp.Surgery_Duration_Min },
        { name: "Anesthesia Time", value: intraOp.Anesthesia_Duration_Min },
        { name: "Blood Loss (ml)", value: intraOp.Blood_Loss_ml },
        { name: "Lactate", value: intraOp.IntraOp_Lactate }
      ]
    : [];

  const intraRisk = intraOp?.IntraOp_Complication_Risk_Percent ?? 0;

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
        {["overview", "preop", "intraop", "postop"].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={
              (tab === "intraop" && !stages.preOpCompleted) ||
              (tab === "postop" && !stages.intraOpCompleted)
            }
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white"
            }`}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ================= OVERVIEW ================= */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
          {/* PRE-OP RADAR */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold mb-4">Pre-Operative Risk Profile</h2>
            {preOp ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={preOpRadarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    dataKey="value"
                    stroke="#2563eb"
                    fill="#3b82f6"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <p>No Pre-Op data available</p>
            )}
          </div>

          {/* ML SUMMARY */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="font-bold mb-4">ML Predictions</h2>
            <p>🟦 Surgery Success Probability: <b>{preOp?.Surgery_Success_Probability ?? "—"}</b></p>
            <p>🟧 Intra-Op Complication Risk: <b>{intraOp?.IntraOp_Complication_Risk_Percent ?? "—"}</b></p>
            <p>🟥 Recovery Duration (Days): <b>{postOp?.Recovery_Duration_Days ?? "—"}</b></p>
          </div>

          {/* INTRA-OP BAR */}
          <div className="bg-white p-6 rounded-xl shadow col-span-2">
            <h2 className="font-bold mb-4">Intra-Operative Stress Profile</h2>
            {intraOp ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={intraOpBarData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p>No Intra-Op data available</p>
            )}
          </div>

          {/* INTRA-OP RISK GAUGE */}
          <div className="bg-white p-6 rounded-xl shadow col-span-2">
            <h2 className="font-bold mb-2">Intra-Op Complication Risk</h2>
            <div className="w-full bg-gray-200 rounded h-6">
              <div
                className={`h-6 rounded text-white text-center text-sm ${
                  intraRisk < 30
                    ? "bg-green-500"
                    : intraRisk < 60
                    ? "bg-yellow-500"
                    : "bg-red-600"
                }`}
                style={{ width: `${intraRisk}%` }}
              >
                {intraRisk}%
              </div>
            </div>
          </div>

          {/* POST-OP KPI */}
          <div className="grid grid-cols-3 gap-4 col-span-2">
            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">ICU Stay</p>
              <p className="text-2xl font-bold">{postOp?.ICU_LOS_Days ?? "—"} days</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">Hospital Stay</p>
              <p className="text-2xl font-bold">{postOp?.LOS_Hospital_Days ?? "—"} days</p>
            </div>

            <div className="bg-white p-4 rounded shadow text-center">
              <p className="text-gray-500">Recovery Duration</p>
              <p className="text-2xl font-bold text-red-600">
                {postOp?.Recovery_Duration_Days ?? "—"} days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= FORMS ================= */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        {activeTab === "preop" && (
          <PreOpForm
            patientId={patient.Id}
            initialData={preOp}
            onSuccess={fetchPatient}
          />
        )}

        {activeTab === "intraop" && (
          <IntraOpForm
            patientId={patient.Id}
            initialData={intraOp}
            onSuccess={fetchPatient}
          />
        )}

        {activeTab === "postop" && (
          <PostOpForm
            patientId={patient.Id}
            initialData={postOp}
            onSuccess={fetchPatient}
          />
        )}
      </div>
    </div>
  );
}
