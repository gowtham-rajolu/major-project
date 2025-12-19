"use client";

import { useState } from "react";
import { NumberInput, YesNoSelect, ReadOnlyValue } from "./Inputs";

export default function PostOpForm({ patientId, initialData, onSuccess }) {
  const [form, setForm] = useState({
    Complication_Severity_Score: initialData?.Complication_Severity_Score ?? "",
    ICU_LOS_Days: initialData?.ICU_LOS_Days ?? "",
    Ventilation_Hours: initialData?.Ventilation_Hours ?? "",
    Postop_Hb: initialData?.Postop_Hb ?? "",
    Postop_WBC: initialData?.Postop_WBC ?? "",
    Postop_CRP: initialData?.Postop_CRP ?? "",
    Postop_Glucose: initialData?.Postop_Glucose ?? "",
    Drain_Amylase: initialData?.Drain_Amylase ?? "",
    POPF: initialData?.POPF ?? "",
    Reoperation: initialData?.Reoperation ?? "",
    LOS_Hospital_Days: initialData?.LOS_Hospital_Days ?? ""
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    const payload = {
      ...form,
      Complication_Severity_Score: Number(form.Complication_Severity_Score),
      ICU_LOS_Days: Number(form.ICU_LOS_Days),
      Ventilation_Hours: Number(form.Ventilation_Hours),
      Postop_Hb: Number(form.Postop_Hb),
      Postop_WBC: Number(form.Postop_WBC),
      Postop_CRP: Number(form.Postop_CRP),
      Postop_Glucose: Number(form.Postop_Glucose),
      Drain_Amylase: Number(form.Drain_Amylase),
      LOS_Hospital_Days: Number(form.LOS_Hospital_Days)
    };

    const res = await fetch(
      `http://localhost:5000/api/postop/${patientId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Post-Op saved");
      onSuccess();
    } else {
      alert(data.error || "Post-Op failed");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <NumberInput label="ICU LOS (days)" name="ICU_LOS_Days"
        value={form.ICU_LOS_Days} onChange={handleChange} />

      <NumberInput label="Ventilation Hours" name="Ventilation_Hours"
        value={form.Ventilation_Hours} onChange={handleChange} />

      <NumberInput label="Post-op Hb" name="Postop_Hb"
        value={form.Postop_Hb} onChange={handleChange} />

      <NumberInput label="Post-op WBC" name="Postop_WBC"
        value={form.Postop_WBC} onChange={handleChange} />

      <NumberInput label="Post-op CRP" name="Postop_CRP"
        value={form.Postop_CRP} onChange={handleChange} />

      <NumberInput label="Post-op Glucose" name="Postop_Glucose"
        value={form.Postop_Glucose} onChange={handleChange} />

      <NumberInput label="Drain Amylase" name="Drain_Amylase"
        value={form.Drain_Amylase} onChange={handleChange} />

      <YesNoSelect label="POPF" name="POPF"
        value={form.POPF} onChange={handleChange} />

      <YesNoSelect label="Reoperation" name="Reoperation"
        value={form.Reoperation} onChange={handleChange} />

      <NumberInput label="Hospital LOS (days)" name="LOS_Hospital_Days"
        value={form.LOS_Hospital_Days} onChange={handleChange} />

      {initialData?.Recovery_Duration_Days !== undefined && (
        <ReadOnlyValue
          label="Recovery Duration (Days)"
          value={initialData.Recovery_Duration_Days}
        />
      )}

      <button
        onClick={handleSubmit}
        className="col-span-2 bg-red-600 text-white py-2 rounded"
      >
        Save Post-Op
      </button>
    </div>
  );
}
