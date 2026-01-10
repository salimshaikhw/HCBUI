import { useEffect, useState } from "react";
import {
  getBooths,
  createBooth,
  updateBooth,
  deleteBooth,
  getConstituencies,
} from "../../services/api";

export default function BoothTab() {
  const [booths, setBooths] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  const [name, setName] = useState("");
  const [constituencyId, setConstituencyId] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [town, setTown] = useState("");
  const [editingId, setEditingId] = useState(null);

  /* ======================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    try {
      const [boothRes, constituencyRes] = await Promise.all([
        getBooths(),
        getConstituencies(),
      ]);

      setBooths(boothRes.data);
      setConstituencies(constituencyRes.data);
    } catch (err) {
      console.error("Failed to load booth data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (!name.trim() || !constituencyId) return;

    try {
      if (editingId) {
        // UPDATE
        await updateBooth(editingId, {
          id: editingId,
          name: name,
          constituencyId: Number(constituencyId),
          partNumber: partNumber ? Number(partNumber) : null,
          town: town || null,
        });
      } else {
        // CREATE
        await createBooth({
          name: name,
          constituencyId: Number(constituencyId),
          partNumber: partNumber ? Number(partNumber) : null,
          town: town || null,
        });
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     DELETE (SQL PROTECTED)
  ====================== */
  const handleDelete = async (id) => {
    try {
      await deleteBooth(id);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  /* ======================
     HELPERS
  ====================== */
  const resetForm = () => {
    setName("");
    setConstituencyId("");
    setPartNumber("");
    setTown("");
    setEditingId(null);
  };

  const getConstituencyName = (id) =>
    constituencies.find((c) => c.id === id)?.name || "-";

  /* ======================
     UI
  ====================== */
  return (
  <div className="card">
    <h2>Booth</h2>

    {/* ===== Add / Update Booth (Single Line) ===== */}
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {/* Constituency FIRST */}
        <select
          value={constituencyId}
          onChange={(e) => setConstituencyId(e.target.value)}
          style={{
            flex: 2,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value="">Select Constituency</option>
          {constituencies.map((c) => {
            const number = c.constituencyNumber ?? c.constituencyNo ?? c.number ?? c.constituencyId ?? "";
            const name = c.name ?? c.constituency ?? "";
            const label = number ? `${number} - ${name}` : name;
            return (
              <option key={c.id} value={c.id}>
                {label}
              </option>
            );
          })}
        </select>

        <input
          type="text"
          placeholder="Booth Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            flex: 2,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="number"
          placeholder="Part Number"
          value={partNumber}
          onChange={(e) => setPartNumber(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <input
          type="text"
          placeholder="Town"
          value={town}
          onChange={(e) => setTown(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSave}
          style={{
            padding: "8px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {editingId ? "Update" : "Add"}
        </button>

        {editingId && (
          <button
            onClick={resetForm}
            style={{
              padding: "8px 16px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>

    {/* ===== Booth Table ===== */}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Booth</th>
          <th>Part</th>
          <th>Town</th>
          <th>Constituency</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {booths.map((b) => (
          <tr key={b.id}>
            <td>{b.id}</td>
            <td>{b.name}</td>
            <td>{b.partNumber ?? "-"}</td>
            <td>{b.town ?? "-"}</td>
            <td>{getConstituencyName(b.constituencyId)}</td>
            <td>
              <button
                onClick={() => {
                  setEditingId(b.id);
                  setName(b.name);
                  setConstituencyId(b.constituencyId);
                  setPartNumber(b.partNumber ?? "");
                  setTown(b.town ?? "");
                }}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(b.id)}>Delete</button>
            </td>
          </tr>
        ))}

        {booths.length === 0 && (
          <tr>
            <td colSpan="6">No data</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

}