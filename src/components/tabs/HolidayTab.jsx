import { useEffect, useState } from "react";
import {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
} from "../../services/api";
import Pagination from "../layout/Pagination";

export default function HolidayTab({
  booths = [],
  centers = [],
  slotTimes = [],
  rows,
  setRows,
}) {
  const [boothId, setBoothId] = useState("");
  const [centerId, setCenterId] = useState("");
  const [slotId, setSlotId] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [description, setDescription] = useState("");
  const [fullDay, setFullDay] = useState(false);
  const [globalHoliday, setGlobalHoliday] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    loadHolidays();
  }, []);

  const loadHolidays = async () => {
    try {
      const res = await getHolidays();
      // Normalize incoming records to support different backends
      const normalize = (h) => ({
        ...h,
        globalHoliday:
          h.globalHoliday ?? h.isGlobalHoliday ?? h.isGlobal ?? h.global ?? false,
      });

      setRows(Array.isArray(res.data) ? res.data.map(normalize) : []);
    } catch (err) {
      console.error("Failed to load holidays", err);
    }
  };

  /* ---------------- FILTERS ---------------- */

  const filteredCenters = centers.filter(
    (c) => c.boothId === Number(boothId)
  );

  const filteredSlots = slotTimes.filter(
    (s) => s.centerId === Number(centerId)
  );

  /* ---------------- RESET ---------------- */

  const resetForm = () => {
    setBoothId("");
    setCenterId("");
    setSlotId("");
    setHolidayDate("");
    setDescription("");
    setFullDay(false);
    setGlobalHoliday(false);
    setEditingId(null);
  };

  /* ---------------- HELPERS ---------------- */

  const getBoothLabel = (b) => {
    if (!b) return "-";
    const number = b.partNumber ?? b.partNo ?? b.boothNumber ?? b.number ?? "";
    const name = b.name ?? b.booth ?? "";
    return number ? `${number} - ${name}` : name || "-";
  };

  const getCenterLabel = (c) => {
    if (!c) return "-";
    const number = c.centerNumber ?? c.centerNo ?? c.number ?? c.id ?? "";
    const name = c.name ?? c.center ?? "";
    return number ? `${number} - ${name}` : name || "-";
  };

  /* ---------------- SAVE / UPDATE ---------------- */

  const handleSave = async () => {
    if (!holidayDate) return alert("Date is required");

    if (!fullDay && !slotId)
      return alert("Select slot or enable Full Day");

    const payload = {
      // include id for update endpoints that expect it in body
      ...(editingId ? { id: editingId } : {}),
      boothId: boothId ? Number(boothId) : null,
      centerId: centerId ? Number(centerId) : null,
      slotId: fullDay ? null : slotId ? Number(slotId) : null,
      holidayDate, // yyyy-mm-dd
      description: description || null,
      // send multiple variants so backend matches whatever it expects
      globalHoliday: !!globalHoliday,
      isGlobalHoliday: !!globalHoliday,
      isGlobal: !!globalHoliday,
      global: !!globalHoliday,
    };

    console.log("Saving holiday payload", payload);

    try {
      if (editingId) {
        await updateHoliday(editingId, payload);
      } else {
        await createHoliday(payload);
      }

      await loadHolidays();
      resetForm();
    } catch (err) {
      console.error("Save failed", err, err.response?.data);
      const serverMsg = err.response?.data?.message ?? err.response?.data ?? null;
      alert("Failed to save Holiday" + (serverMsg ? `: ${JSON.stringify(serverMsg)}` : ""));
    }
  };

  /* ---------------- EDIT ---------------- */

  const handleEdit = (h) => {
    setEditingId(h.id);
    setBoothId(h.boothId ?? "");
    setCenterId(h.centerId ?? "");
    setSlotId(h.slotId ?? "");
    setHolidayDate(h.holidayDate);
    setDescription(h.description ?? "");
    setFullDay(h.slotId === null);
    setGlobalHoliday(!!h.globalHoliday);
  };

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    if (!confirm("Delete this holiday?")) return;

    try {
      await deleteHoliday(id);
      await loadHolidays();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  };

  // Pagination
  const totalPages = Math.ceil(rows.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRows = rows.slice(startIndex, endIndex);

  /* ---------------- UI ---------------- */

  return (
  <div className="card">
    <h2>Holiday</h2>

    {/* ===== Holiday Form ===== */}
    <div
      style={{
        marginBottom: "20px",
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "5px",
      }}
    >
      {/* Row 1: Booth + Center */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
        <select
          value={boothId}
          onChange={(e) => {
            setBoothId(e.target.value);
            setCenterId("");
            setSlotId("");
          }}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Booth</option>
          {booths.map((b) => (
            <option key={b.id} value={b.id}>
              {getBoothLabel(b)}
            </option>
          ))}
        </select>

        <select
          value={centerId}
          disabled={!boothId}
          onChange={(e) => {
            setCenterId(e.target.value);
            setSlotId("");
          }}
          style={{ flex: 1, padding: "8px" }}
        >
          <option value="">Select Center</option>
          {filteredCenters.map((c) => (
            <option key={c.id} value={c.id}>
              {getCenterLabel(c)}
            </option>
          ))}
        </select>
      </div>

      {/* Row 2: Full Day + Slot */}
      <div
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={fullDay}
            onChange={(e) => {
              setFullDay(e.target.checked);
              setSlotId("");
            }}
          />
          Full Day Holiday
        </label>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
          }}
        >
          <input
            type="checkbox"
            checked={globalHoliday}
            onChange={(e) => setGlobalHoliday(e.target.checked)}
          />
          Global Holiday
        </label>

        {!fullDay && (
          <select
            value={slotId}
            disabled={!centerId}
            onChange={(e) => setSlotId(e.target.value)}
            style={{ flex: 1, padding: "8px" }}
          >
            <option value="">Select Slot</option>
            {filteredSlots.map((s) => (
              <option key={s.id} value={s.id}>
                {s.startTime} - {s.endTime}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Row 3: Date */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="date"
          value={holidayDate}
          onChange={(e) => setHolidayDate(e.target.value)}
          style={{ padding: "8px", width: "220px" }}
        />
      </div>

      {/* Row 4: Description */}
      <div style={{ marginBottom: "10px" }}>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            minHeight: "70px",
          }}
        />
      </div>

      {/* Row 5: Buttons */}
      <div style={{ display: "flex", gap: "10px" }}>
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
          {editingId ? "Update Holiday" : "Add Holiday"}
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

    {/* ===== Holiday Table ===== */}
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Booth</th>
          <th>Center</th>
          <th>Slot</th>
          <th>Date</th>
          <th>Global</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan="6">No holidays</td>
          </tr>
        )}

        {paginatedRows.map((h) => (
          <tr key={h.id}>
            <td>{h.id}</td>
            <td>{getBoothLabel(booths.find((b) => b.id === h.boothId))}</td>
            <td>{getCenterLabel(centers.find((c) => c.id === h.centerId))}</td>
            <td>
              {h.slotId
                ? `${slotTimes.find((s) => s.id === h.slotId)?.startTime} - 
                   ${slotTimes.find((s) => s.id === h.slotId)?.endTime}`
                : "Full Day"}
            </td>
            <td>{h.holidayDate}</td>
            <td>{h.globalHoliday ? "Yes" : "No"}</td>
            <td>
              <button
                onClick={() => handleEdit(h)}
                style={{ marginRight: "8px" }}
              >
                Edit
              </button>
              <button onClick={() => handleDelete(h.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {rows.length > 0 && (
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
