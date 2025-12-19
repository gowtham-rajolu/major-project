"use client";

import { useState } from "react";
import { NumberInput, YesNoSelect, SelectInput, ReadOnlyValue } from "./Inputs";

export default function IntraOpForm({ patientId, initialData, onSuccess }) {
  const [form, setForm] = useState({
    Surgery_Type: initialData?.Surgery_Type ?? "",
    Surgery_Approach: initialData?.Surgery_Approach ?? "",
    Surgery_Duration_Min: initialData?.Surgery_Duration_Min ?? "",
    Anesthesia_Duration_Min: initialData?.Anesthesia_Duration_Min ?? "",
    Blood_Loss_ml: initialData?.Blood_Loss_ml ?? "",
    Transfusion_Units: initialData?.Transfusion_Units ?? "",
    IntraOp_Hypotension: initialData?.IntraOp_Hypotension ?? "",
    IntraOp_Tachycardia: initialData?.IntraOp_Tachycardia ?? "",
    Vasopressor_Use: initialData?.Vasopressor_Use ?? "",
    IntraOp_Lactate: initialData?.IntraOp_Lactate ?? ""
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const payload = {
      ...form,
      Surgery_Duration_Min: Number(form.Surgery_Duration_Min),
      Anesthesia_Duration_Min: Number(form.Anesthesia_Duration_Min),
      Blood_Loss_ml: Number(form.Blood_Loss_ml),
      Transfusion_Units: Number(form.Transfusion_Units),
      IntraOp_Lactate: Number(form.IntraOp_Lactate)
    };

    const res = await fetch(
      `http://localhost:5000/api/intraop/${patientId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Intra-Op saved");
      onSuccess();
    } else {
      alert(data.error || "Intra-Op failed");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <SelectInput label="Surgery Type" name="Surgery_Type" value={form.Surgery_Type}
        options={["Whipple", "Distal Pancreatectomy"]} onChange={handleChange} />

      <SelectInput label="Approach" name="Surgery_Approach" value={form.Surgery_Approach}
        options={["Open", "Laparoscopic", "Robotic"]} onChange={handleChange} />

      <NumberInput label="Surgery Duration (min)" name="Surgery_Duration_Min"
        value={form.Surgery_Duration_Min} onChange={handleChange} />

      <NumberInput label="Anesthesia Duration (min)" name="Anesthesia_Duration_Min"
        value={form.Anesthesia_Duration_Min} onChange={handleChange} />

      <NumberInput label="Blood Loss (ml)" name="Blood_Loss_ml"
        value={form.Blood_Loss_ml} onChange={handleChange} />

      <NumberInput label="Transfusion Units" name="Transfusion_Units"
        value={form.Transfusion_Units} onChange={handleChange} />

      <YesNoSelect label="Hypotension" name="IntraOp_Hypotension"
        value={form.IntraOp_Hypotension} onChange={handleChange} />

      <YesNoSelect label="Tachycardia" name="IntraOp_Tachycardia"
        value={form.IntraOp_Tachycardia} onChange={handleChange} />

      <YesNoSelect label="Vasopressor Use" name="Vasopressor_Use"
        value={form.Vasopressor_Use} onChange={handleChange} />

      <NumberInput label="Lactate" name="IntraOp_Lactate"
        value={form.IntraOp_Lactate} onChange={handleChange} />

      {initialData?.IntraOp_Complication_Risk_Percent !== undefined && (
        <ReadOnlyValue
          label="Intra-Op Complication Risk (%)"
          value={initialData.IntraOp_Complication_Risk_Percent+"%"}
        />
      )}

      <button
        onClick={handleSubmit}
        className="col-span-2 bg-orange-600 text-white py-2 rounded"
      >
        Save Intra-Op
      </button>
    </div>
  );
}
