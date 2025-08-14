// /components/AddRecordModal.jsx
import { useState } from "react";

export default function AddRecordModal({ isOpen, onClose, onSave, fieldConfig }) {
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    setFormData({});
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold mb-4">Add New Record</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fieldConfig.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium mb-1">{field.label}</label>
              {field.type === "select" ? (
                <select
                  className="w-full border rounded px-3 py-2"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type || "text"}
                  className="w-full border rounded px-3 py-2"
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-[#ff8400] text-white hover:bg-orange-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
