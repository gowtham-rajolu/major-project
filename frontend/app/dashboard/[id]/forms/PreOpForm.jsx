"use client";

import { useState } from "react";
import { NumberInput, YesNoSelect, SelectInput, ReadOnlyValue } from "./Inputs";

export default function PreOpForm({ patientId, initialData, onSuccess }) {
  const [form, setForm] = useState({
    Age: initialData?.Age ?? "",
    BMI: initialData?.BMI ?? "",
    Diabetes: initialData?.Diabetes ?? "",
    Hypertension: initialData?.Hypertension ?? "",
    Heart_Disease: initialData?.Heart_Disease ?? "",
    Chronic_Kidney_Disease: initialData?.Chronic_Kidney_Disease ?? "",
    COPD: initialData?.COPD ?? "",
    Tumor_Size_cm: initialData?.Tumor_Size_cm ?? "",
    Tumor_Stage: initialData?.Tumor_Stage ?? "",
    Metastasis: initialData?.Metastasis ?? "",
    ASA_Score: initialData?.ASA_Score ?? "",
    ECOG_Score: initialData?.ECOG_Score ?? "",
    Preop_Hb: initialData?.Preop_Hb ?? "",
    Preop_WBC: initialData?.Preop_WBC ?? "",
    Platelets: initialData?.Platelets ?? "",
    Bilirubin: initialData?.Bilirubin ?? "",
    Creatinine: initialData?.Creatinine ?? "",
    INR: initialData?.INR ?? "",
    Albumin: initialData?.Albumin ?? "",
    CRP: initialData?.CRP ?? "",
    Glucose: initialData?.Glucose ?? ""
  });

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // 🔑 CAST NUMBERS (CRITICAL)
    const payload = {
      ...form,
      Age: Number(form.Age),
      BMI: Number(form.BMI),
      Tumor_Size_cm: Number(form.Tumor_Size_cm),
      ASA_Score: Number(form.ASA_Score),
      ECOG_Score: Number(form.ECOG_Score),
      Preop_Hb: Number(form.Preop_Hb),
      Preop_WBC: Number(form.Preop_WBC),
      Platelets: Number(form.Platelets),
      Bilirubin: Number(form.Bilirubin),
      Creatinine: Number(form.Creatinine),
      INR: Number(form.INR),
      Albumin: Number(form.Albumin),
      CRP: Number(form.CRP),
      Glucose: Number(form.Glucose)
    };

    const res = await fetch(
      `http://localhost:5000/api/preop/${patientId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }
    );

    const data = await res.json();

    if (res.ok) {
      alert("Pre-Op saved");
      onSuccess();
    } else {
      alert(data.error || "Pre-Op failed");
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <NumberInput label="Age" name="Age" value={form.Age} onChange={handleChange} />
      <NumberInput label="BMI" name="BMI" value={form.BMI} onChange={handleChange} />

      <YesNoSelect label="Diabetes" name="Diabetes" value={form.Diabetes} onChange={handleChange} />
      <YesNoSelect label="Hypertension" name="Hypertension" value={form.Hypertension} onChange={handleChange} />
      <YesNoSelect label="Heart Disease" name="Heart_Disease" value={form.Heart_Disease} onChange={handleChange} />
      <YesNoSelect label="CKD" name="Chronic_Kidney_Disease" value={form.Chronic_Kidney_Disease} onChange={handleChange} />
      <YesNoSelect label="COPD" name="COPD" value={form.COPD} onChange={handleChange} />

      <NumberInput label="Tumor Size (cm)" name="Tumor_Size_cm" value={form.Tumor_Size_cm} onChange={handleChange} />

      <SelectInput
        label="Tumor Stage"
        name="Tumor_Stage"
        value={form.Tumor_Stage}
        options={["I", "II", "III", "IV"]}
        onChange={handleChange}
      />

      <YesNoSelect label="Metastasis" name="Metastasis" value={form.Metastasis} onChange={handleChange} />

      <NumberInput label="ASA Score" name="ASA_Score" value={form.ASA_Score} onChange={handleChange} />
      <NumberInput label="ECOG Score" name="ECOG_Score" value={form.ECOG_Score} onChange={handleChange} />

      <NumberInput label="Hb" name="Preop_Hb" value={form.Preop_Hb} onChange={handleChange} />
      <NumberInput label="WBC" name="Preop_WBC" value={form.Preop_WBC} onChange={handleChange} />
      <NumberInput label="Platelets" name="Platelets" value={form.Platelets} onChange={handleChange} />

      <NumberInput label="Bilirubin" name="Bilirubin" value={form.Bilirubin} onChange={handleChange} />
      <NumberInput label="Creatinine" name="Creatinine" value={form.Creatinine} onChange={handleChange} />
      <NumberInput label="INR" name="INR" value={form.INR} onChange={handleChange} />

      <NumberInput label="Albumin" name="Albumin" value={form.Albumin} onChange={handleChange} />
      <NumberInput label="CRP" name="CRP" value={form.CRP} onChange={handleChange} />
      <NumberInput label="Glucose" name="Glucose" value={form.Glucose} onChange={handleChange} />

      {initialData?.Surgery_Success_Probability !== undefined && (
        <ReadOnlyValue
          label="Surgery Success Probability"
          value={initialData.Surgery_Success_Probability}
        />
      )}

      <button
        onClick={handleSubmit}
        className="col-span-2 bg-blue-600 text-white py-2 rounded"
      >
        Save Pre-Op
      </button>
    </div>
  );
}
