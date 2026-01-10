import axios from "axios";

/* =========================
   AXIOS INSTANCE
========================= */

const API = axios.create({
  baseURL: "http://localhost:5084/api",
});

/* =========================
   APPOINTMENT APIs
========================= */

// AppointmentRequests API removed — no remote dependency

/* =========================
   CONSTITUENCY APIs
========================= */

export const getConstituencies = () =>
  API.get("/Constituency");

export const createConstituency = (data) =>
  API.post("/Constituency", data);

export const updateConstituency = (id, data) =>
  API.put(`/Constituency/${id}`, data);

export const deleteConstituency = (id) =>
  API.delete(`/Constituency/${id}`);

/* =========================
   BOOTH APIs
========================= */

export const getBooths = () =>
  API.get("/Booth");

export const createBooth = (data) =>
  API.post("/Booth", data);

export const updateBooth = (id, data) =>
  API.put(`/Booth/${id}`, data);

export const deleteBooth = (id) =>
  API.delete(`/Booth/${id}`);

/* =========================
   CENTER APIs
========================= */

export const getCenters = () =>
  API.get("/Center");

export const createCenter = (data) =>
  API.post("/Center", data);

export const updateCenter = (id, data) =>
  API.put(`/Center/${id}`, data);

export const deleteCenter = (id) =>
  API.delete(`/Center/${id}`);

/* =========================
   SLOT TYPE APIs
========================= */

export const getSlotTypes = () =>
  API.get("/SlotType");

export const createSlotType = (data) =>
  API.post("/SlotType", data);

export const updateSlotType = (id, data) =>
  API.put(`/SlotType/${id}`, data);

export const deleteSlotType = (id) =>
  API.delete(`/SlotType/${id}`);

/* =========================
   SLOT APIs
========================= */

export const getSlots = () =>
  API.get("/Slot");

export const createSlot = (data) =>
  API.post("/Slot", data);

export const updateSlot = (id, data) =>
  API.put(`/Slot/${id}`, data);

export const deleteSlot = (id) =>
  API.delete(`/Slot/${id}`);

/* =========================
   HOLIDAY APIs
========================= */

export const getHolidays = () =>
  API.get("/Holiday");

export const createHoliday = (data) =>
  API.post("/Holiday", data);

export const updateHoliday = (id, data) =>
  API.put(`/Holiday/${id}`, data);

export const deleteHoliday = (id) =>
  API.delete(`/Holiday/${id}`);

/* =========================
   UPLOAD API
========================= */

export const uploadConstituencyData = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  // endpoint available at POST /api/ExcelImport/UploadData
  // Let the browser set the Content-Type (with boundary) for multipart/form-data
  return API.post("/ExcelImport/UploadData", formData);
};

/* =========================
   FAMILY BOOKING APIs
========================= */

export const getFamilyBookings = () =>
  API.get("/AppointmentBooking");

export const createFamilyBooking = (data) =>
  API.post("/AppointmentBooking", data);

export const updateFamilyBooking = (id, data) =>
  API.put(`/AppointmentBooking/${id}`, data);

export const deleteFamilyBooking = (id) =>
  API.delete(`/AppointmentBooking/${id}`);
