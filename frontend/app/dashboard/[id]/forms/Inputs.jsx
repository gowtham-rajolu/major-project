"use client";

export const NumberInput = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <input
      type="number"
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded"
    />
  </div>
);

export const YesNoSelect = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded"
    >
      <option value="">Select</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  </div>
);

export const SelectInput = ({ label, name, value, options, onChange }) => (
  <div>
    <label className="text-sm font-semibold">{label}</label>
    <select
      name={name}
      value={value ?? ""}
      onChange={onChange}
      className="w-full mt-1 p-2 border rounded"
    >
      <option value="">Select</option>
      {options.map(o => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  </div>
);

export const ReadOnlyValue = ({ label, value }) => (
  <div className="col-span-2 bg-red-50 border p-4 rounded">
    <p className="text-sm font-semibold text-red-700">{label}</p>
    <p className="text-2xl font-bold text-red-600">{value}</p>
  </div>
);
