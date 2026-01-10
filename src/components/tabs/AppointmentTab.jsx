import { useState } from "react";
import "../../styles/appointment.css";

export default function AppointmentTab({
  constituencies = [],
  booths = [],
  centers = [],
  slotTimes = [],
  rows = [],
  setRows = () => {},
}) {

  /* ---------- FORM STATE ---------- */
  const [voterIdentifier, setVoterIdentifier] = useState("");
  const [hchName, setHchName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const [constituencyId, setConstituencyId] = useState("");
  const [boothId, setBoothId] = useState("");
  const [centerId, setCenterId] = useState("");
  const [slotTimeId, setSlotTimeId] = useState("");

  const [date, setDate] = useState("");

  const [karyakartaName, setKaryakartaName] = useState("");
  const [karyakartaContactNumber, setKaryakartaContactNumber] = useState("");

  const [isFamilyHead, setIsFamilyHead] = useState(false);
  const [familyHeadName, setFamilyHeadName] = useState("");
  const [familyId, setFamilyId] = useState("");
  const [isMinor, setIsMinor] = useState(false);

  /* ---------- LOAD ---------- */
  // Data is provided by parent via `rows` / `setRows` to avoid remote dependency

  /* ---------- CREATE ---------- */
  const saveAppointment = async () => {
    if (!voterIdentifier || !centerId || !slotTimeId || !date) {
      alert("Fill required fields");
      return;
    }

    const payload = {
      voterIdentifier,
      hchName,
      age: Number(age),
      gender,

      constituencyId: Number(constituencyId),
      boothId: Number(boothId),
      centerId: Number(centerId),
      slotId: Number(slotTimeId),

      appointmentDate: date,

      karyakartaName,
      karyakartaContactNumber,

      isFamilyHead,
      familyHeadName,
      familyId: Number(familyId),
      isMinor,
    };

    // Create locally (no API dependency)
    const newId = Date.now();
    const boothDetails = booths.find(b => String(b.id) === String(boothId)) || null;
    const centerDetails = centers.find(c => String(c.id) === String(centerId)) || null;
    const slotDetails = slotTimes.find(s => String(s.id) === String(slotTimeId)) || null;

    const newRow = {
      appointmentRequestId: newId,
      voterIdentifier,
      hchName,
      age: Number(age),
      gender,
      constituencyId: Number(constituencyId) || null,
      boothId: Number(boothId) || null,
      centerId: Number(centerId) || null,
      slotId: Number(slotTimeId) || null,
      appointmentDate: date,
      karyakartaName,
      karyakartaContactNumber,
      isFamilyHead,
      familyHeadName,
      familyId: familyId ? Number(familyId) : null,
      isMinor,
      boothDetails,
      centerDetails,
      slotDetails,
      status: "Pending",
    };

    try {
      setRows([...(rows || []), newRow]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment locally");
    }
  };

  const resetForm = () => {
    setVoterIdentifier("");
    setHchName("");
    setAge("");
    setGender("");
    setConstituencyId("");
    setBoothId("");
    setCenterId("");
    setSlotTimeId("");
    setDate("");
    setKaryakartaName("");
    setKaryakartaContactNumber("");
    setIsFamilyHead(false);
    setFamilyHeadName("");
    setFamilyId("");
    setIsMinor(false);
  };

  /* ---------- RENDER ---------- */
  return (
    <div className="card">
      <h2>Appointment Requests</h2>

      <input placeholder="Voter Identifier" value={voterIdentifier} onChange={e => setVoterIdentifier(e.target.value)} />
      <input placeholder="Voter Name" value={hchName} onChange={e => setHchName(e.target.value)} />
      <input placeholder="Age" type="number" value={age} onChange={e => setAge(e.target.value)} />
      <input placeholder="Gender" value={gender} onChange={e => setGender(e.target.value)} />

      <select value={constituencyId} onChange={e => setConstituencyId(e.target.value)}>
        <option value="">Select Constituency</option>
        {constituencies.map(c => (
          <option key={c.id} value={c.id}>{c.constituency}</option>
        ))}
      </select>

      <select value={boothId} onChange={e => setBoothId(e.target.value)}>
        <option value="">Select Booth</option>
        {booths.map(b => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>

      <select value={centerId} onChange={e => setCenterId(e.target.value)}>
        <option value="">Select Center</option>
        {centers.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <select value={slotTimeId} onChange={e => setSlotTimeId(e.target.value)}>
        <option value="">Select Slot Time</option>
        {slotTimes.map(s => (
          <option key={s.id} value={s.id}>{s.startTime} - {s.endTime}</option>
        ))}
      </select>

      <input type="date" value={date} onChange={e => setDate(e.target.value)} />

      <input placeholder="Karyakarta Name" value={karyakartaName} onChange={e => setKaryakartaName(e.target.value)} />
      <input placeholder="Karyakarta Contact" value={karyakartaContactNumber} onChange={e => setKaryakartaContactNumber(e.target.value)} />

      <label>
        <input type="checkbox" checked={isFamilyHead} onChange={e => setIsFamilyHead(e.target.checked)} />
        Is Family Head
      </label>

      <input placeholder="Family Head Name" value={familyHeadName} onChange={e => setFamilyHeadName(e.target.value)} />
      <input placeholder="Family ID" value={familyId} onChange={e => setFamilyId(e.target.value)} />

      <label>
        <input type="checkbox" checked={isMinor} onChange={e => setIsMinor(e.target.checked)} />
        Is Minor
      </label>

      <button onClick={saveAppointment}>Save Appointment</button>

      {/* ---------- TABLE ---------- */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Voter</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Booth</th>
            <th>Center</th>
            <th>Slot</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map(a => (
            <tr key={a.appointmentRequestId}>
              <td>{a.appointmentRequestId}</td>
              <td>{a.hchName}</td>
              <td>{a.age}</td>
              <td>{a.gender}</td>
              <td>{a.boothDetails?.name ?? "-"}</td>
              <td>{a.centerDetails?.name ?? "-"}</td>
              <td>{a.slotDetails?.startTime} - {a.slotDetails?.endTime}</td>
              <td>{a.appointmentDate}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
