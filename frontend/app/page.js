"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [patientId, setPatientId] = useState("");
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!patientId.trim()) return alert("Patient ID is required");
    router.push(`/dashboard/${patientId}`);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newId.trim() || !newName.trim())
      return alert("Both ID and Name are required");

    try {
      const res = await fetch("http://localhost:5000/api/patient", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Id: Number(newId), Name: newName })
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error || "Failed to create patient");

      alert("Patient created successfully");
      router.push(`/dashboard/${newId}`);
    } catch {
      alert("Server error");
    }
  };

  return (
    <div style={page}>
      <div style={card}>
        <h2 style={title}>Patient Access</h2>

        {/* EXISTING PATIENT */}
        <form onSubmit={handleSearch} style={section}>
          <h3 style={subtitle}>Open Existing Patient</h3>

          <input
            style={input}
            placeholder="Enter Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
          />

          <button style={primaryBtn}>Go to Dashboard</button>
        </form>

        <div style={divider} />

        {/* CREATE NEW PATIENT */}
        <form onSubmit={handleCreate} style={section}>
          <h3 style={subtitle}>Create New Patient</h3>

          <input
            style={input}
            type="number"
            placeholder="New Patient ID"
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
          />

          <input
            style={input}
            placeholder="Patient Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />

          <button style={secondaryBtn}>Create Patient</button>
        </form>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const page = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #f4f6fb, #e8ecf4)",
  fontFamily: "Segoe UI, sans-serif"
};

const card = {
  width: "420px",
  background: "#fff",
  padding: "32px",
  borderRadius: "12px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
};

const title = {
  textAlign: "center",
  marginBottom: "24px",
  color: "#2c3e50"
};

const subtitle = {
  marginBottom: "12px",
  color: "#34495e",
  fontSize: "16px"
};

const section = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
};

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "14px"
};

const primaryBtn = {
  padding: "12px",
  background: "#4f46e5",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer"
};

const secondaryBtn = {
  ...primaryBtn,
  background: "#16a34a"
};

const divider = {
  height: "1px",
  background: "#e5e7eb",
  margin: "28px 0"
};
