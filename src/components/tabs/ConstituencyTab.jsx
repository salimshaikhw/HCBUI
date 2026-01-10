import { useEffect, useState } from "react";
import {
  getConstituencies,
  createConstituency,
  updateConstituency,
  deleteConstituency,
  uploadConstituencyData,
} from "../../services/api";

export default function ConstituencyTab() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [constituencyNumber, setConstituencyNumber] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  /* ======================
     LOAD FROM BACKEND
  ====================== */
  const loadData = async () => {
    try {
      const res = await getConstituencies();
      setRows(res.data);
    } catch (err) {
      console.error("Failed to load constituencies", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     ADD / UPDATE (SQL)
  ====================== */
  const handleSave = async () => {
    if (!name.trim() || !constituencyNumber) return;

    try {
      if (editingId) {
        await updateConstituency(editingId, {
          name,
          constituencyNumber: Number(constituencyNumber),
        });
      } else {
        await createConstituency({
          name,
          constituencyNumber: Number(constituencyNumber),
        });
      }

      setName("");
      setConstituencyNumber("");
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     DELETE (SQL)
  ====================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this constituency?")) return;

    try {
      await deleteConstituency(id);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  /* ======================
     FILE UPLOAD (EXCEL)
  ====================== */
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const valid = [".xlsx", ".xls"].some((ext) =>
      file.name.toLowerCase().endsWith(ext)
    );

    if (!valid) {
      setUploadStatus("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setUploadStatus("File size exceeds 50 MB limit");
      return;
    }

    setSelectedFile(file);
    setUploadStatus("");
  };

  const handleFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadStatus("Uploading...");

    const result = await uploadConstituencyData(selectedFile);

    if (result.success) {
      setUploadStatus("File uploaded successfully!");
      setSelectedFile(null);
      loadData();
    } else {
      setUploadStatus(`Upload failed: ${result.error}`);
    }

    setIsUploading(false);
  };

  const downloadTemplate = () => {
  const headers = ["Name,ConstituencyNumber"];
  const sampleData = [
    "Sample Constituency 1,1",
    "Sample Constituency 2,2",
  ];

  const csvContent = [...headers, ...sampleData].join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "constituency_template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


  /* ======================
     UI (MATCHES SENIOR)
  ====================== */
  return (
    <div className="card">
      <h2>Constituency</h2>

      {/* ===== Manual Entry ===== */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ddd", borderRadius: "5px" }}>
        <h3 style={{ marginBottom: "15px", fontSize: "16px" }}>
          Add Constituency Manually
        </h3>

        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Constituency Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 2 }}
          />
          <input
            type="number"
            placeholder="Constituency Number"
            value={constituencyNumber}
            onChange={(e) => setConstituencyNumber(e.target.value)}
            style={{ flex: 1 }}
          />
          <button onClick={handleSave}>
            {editingId ? "Update" : "Add"}
          </button>
        </div>
      </div>

      {/* ===== Upload Excel ===== */}
<div
  style={{
    marginBottom: "30px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#f9f9f9",
  }}
>
  <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "16px" }}>
    Upload Constituency Data (Excel)
  </h3>

  {/* Download Template */}
  <div style={{ marginBottom: "15px" }}>
    <button
      onClick={downloadTemplate}
      style={{
        padding: "8px 15px",
        backgroundColor: "#28a745",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "18px" }}>📥</span>
      Download Template
    </button>
  </div>

  {/* File Upload Row */}
  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      id="constituency-file-input"
      type="file"
      accept=".xlsx,.xls"
      onChange={handleFileSelect}
      style={{ flex: 1 }}
    />

    <button
      onClick={handleFileUpload}
      disabled={!selectedFile || isUploading}
      style={{
        padding: "8px 20px",
        cursor:
          !selectedFile || isUploading ? "not-allowed" : "pointer",
        opacity: !selectedFile || isUploading ? 0.6 : 1,
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        fontSize: "14px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <span style={{ fontSize: "18px" }}>📤</span>
      {isUploading ? "Uploading..." : "Upload"}
    </button>
  </div>

  {/* Status + Note */}
  {uploadStatus && (
    <div style={{ marginTop: "10px", fontSize: "14px" }}>
      {uploadStatus}
    </div>
  )}

  <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
    <strong>Note:</strong> Maximum file size: 50 MB. Only Excel files
    (.xlsx, .xls) are supported.
  </div>
</div>


      {/* ===== Table ===== */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Constituency</th>
            <th>Constituency Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="4">No data</td>
            </tr>
          ) : (
            rows.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.name}</td>
                <td>{r.constituencyNumber}</td>
                <td>
                  <button
                    onClick={() => {
                      setEditingId(r.id);
                      setName(r.name);
                      setConstituencyNumber(r.constituencyNumber);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDelete(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
