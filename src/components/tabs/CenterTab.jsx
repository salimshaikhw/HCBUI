import { useEffect, useState } from "react";
import {
  getCenters,
  createCenter,
  updateCenter,
  deleteCenter,
  getBooths,
  getConstituencies,
} from "../../services/api";
import Pagination from "../layout/Pagination";

export default function CenterTab() {
  const [centers, setCenters] = useState([]);
  const [booths, setBooths] = useState([]);
  const [constituencies, setConstituencies] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [form, setForm] = useState({
    boothId: "",
    name: "",
    address: "",
    contactNumber: "",
    contactPerson: "",
    isActive: true,
    slotsPerDay: "",
  });

  /* ======================
     LOAD DATA
  ====================== */
  const loadData = async () => {
    try {
      const [centerRes, boothRes, constituencyRes] = await Promise.all([
        getCenters(),
        getBooths(),
        getConstituencies(),
      ]);

      setCenters(centerRes.data);
      setBooths(boothRes.data);
      setConstituencies(constituencyRes.data);
    } catch (err) {
      console.error("Failed to load center data", err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ======================
     FORM HANDLERS
  ====================== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      boothId: "",
      name: "",
      address: "",
      contactNumber: "",
      contactPerson: "",
      isActive: true,
      slotsPerDay: "",
    });
  };

  /* ======================
     ADD / UPDATE
  ====================== */
  const handleSave = async () => {
    if (!form.name || !form.boothId) return;

    try {
      if (editingId) {
        await updateCenter(editingId, {
          id: editingId,
          ...form,
          boothId: Number(form.boothId),
          slotsPerDay: Number(form.slotsPerDay),
        });
      } else {
        await createCenter({
          ...form,
          boothId: Number(form.boothId),
          slotsPerDay: Number(form.slotsPerDay),
        });
      }

      resetForm();
      loadData();
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id) => {
    try {
      await deleteCenter(id);
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  /* ======================
     HELPERS
  ====================== */
  const getBoothName = (id) =>
    booths.find((b) => b.id === id)?.name || "-";

  const getConstituencyName = (boothId) => {
    const booth = booths.find((b) => b.id === boothId);
    return (
      constituencies.find((c) => c.id === booth?.constituencyId)?.name ||
      "-"
    );
  };

  // Pagination
  const totalPages = Math.ceil(centers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCenters = centers.slice(startIndex, endIndex);

  /* ======================
     UI
  ====================== */
  return (
  <div className="card">
    <h2>Center</h2>

    {/* ===== Add / Update Center Form ===== */}
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      {/* Row 1: Select Booth + Center Name */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select
          name="boothId"
          value={form.boothId}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Booth</option>
          {booths.map((b) => {
            const number = b.partNumber ?? b.partNo ?? b.boothNumber ?? b.number ?? b.id ?? "";
            const name = b.name ?? b.booth ?? "";
            const label = number ? `${number} - ${name}` : name;
            return (
              <option key={b.id} value={b.id}>
                {label}
              </option>
            );
          })}
        </select>

        <input
          name="name"
          placeholder="Center Name"
          value={form.name}
          onChange={handleChange}
          style={{ flex: 2, padding: "8px" }}
        />
      </div>

      {/* Row 2: Address */}
      <div style={{ marginBottom: "10px" }}>
        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>

      {/* Row 3: Contact Number + Contact Person */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <input
          name="contactNumber"
          placeholder="Contact Number"
          value={form.contactNumber}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px" }}
        />

        <input
          name="contactPerson"
          placeholder="Contact Person"
          value={form.contactPerson}
          onChange={handleChange}
          style={{ flex: 1, padding: "8px" }}
        />
      </div>

      {/* Row 4: Slots / Day + Active + Buttons */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <input
          type="number"
          name="slotsPerDay"
          placeholder="Slots / Day"
          value={form.slotsPerDay}
          onChange={handleChange}
          style={{ width: "140px", padding: "8px" }}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>

        <button
          onClick={handleSave}
          style={{
            padding: "8px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
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

    {/* ===== Center Table ===== */}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Center</th>
          <th>Booth</th>
          <th>Constituency</th>
          <th>Active</th>
          <th>Slots / Day</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {paginatedCenters.map((c) => (
          <tr key={c.id}>
            <td>{c.id}</td>
            <td>{c.name}</td>
            <td>{getBoothName(c.boothId)}</td>
            <td>{getConstituencyName(c.boothId)}</td>
            <td>{c.isActive ? "Yes" : "No"}</td>
            <td>{c.slotsPerDay}</td>
            <td>
              <button
                onClick={() => {
                  setEditingId(c.id);
                  setForm({
                    boothId: c.boothId,
                    name: c.name,
                    address: c.address,
                    contactNumber: c.contactNumber,
                    contactPerson: c.contactPerson,
                    isActive: c.isActive,
                    slotsPerDay: c.slotsPerDay,
                  });
                }}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>

              <button onClick={() => handleDelete(c.id)}>
                Delete
              </button>
            </td>
          </tr>
        ))}

        {centers.length === 0 && (
          <tr>
            <td colSpan="7">No data</td>
          </tr>
        )}
      </tbody>
    </table>

    {centers.length > 0 && (
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(newValue) => {
          setItemsPerPage(newValue);
          setCurrentPage(1);
        }}
      />
    )}
  </div>
);

}
