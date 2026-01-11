import { useEffect, useState } from "react";
import {
  getConstituencies,
  getBooths,
  getCenters,
  getSlotTypes,
  getSlots,
  getHolidays,
  getFamilyBookings,
} from "../services/api";

import TabsContainer from "../components/tabs/TabsContainer";
import ConstituencyTab from "../components/tabs/ConstituencyTab";
import BoothTab from "../components/tabs/BoothTab";
import CenterTab from "../components/tabs/CenterTab";
import SlotTypeTab from "../components/tabs/SlotTypeTab";
import HolidayTab from "../components/tabs/HolidayTab";
import AppointmentTab from "../components/tabs/AppointmentTab";
import FamilyBookingTab from "../components/tabs/FamilyBookingTab";

export default function AppointmentPage() {
  const [activeTab, setActiveTab] = useState("familybooking");

  // MASTER DATA
  const [constituencies, setConstituencies] = useState([]);
  const [booths, setBooths] = useState([]);
  const [centers, setCenters] = useState([]);
  const [slotTypes, setSlotTypes] = useState([]);
  const [slotTimes, setSlotTimes] = useState([]); // slots
  const [holidays, setHolidays] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [familyBookings, setFamilyBookings] = useState([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        constituencyRes,
        boothRes,
        centerRes,
        slotTypeRes,
        slotRes,
        holidayRes,
        familyBookingRes,
      ] = await Promise.all([
        getConstituencies(),
        getBooths(),
        getCenters(),
        getSlotTypes(),
        getSlots(),
        getHolidays(),
        getFamilyBookings(),
      ]);

      setConstituencies(constituencyRes.data);
      setBooths(boothRes.data);
      setCenters(centerRes.data);
      setSlotTypes(slotTypeRes.data);
      setSlotTimes(slotRes.data);
      setHolidays(holidayRes.data);
      setFamilyBookings(familyBookingRes.data);
    } catch (err) {
      console.error("Failed to load master data", err);
    }
  };

  return (
    <div className="page">
      <TabsContainer activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="content">
        {activeTab === "constituency" && (
          <ConstituencyTab rows={constituencies} setRows={setConstituencies} />
        )}

        {activeTab === "booth" && (
          <BoothTab constituencies={constituencies} rows={booths} setRows={setBooths} />
        )}

        {activeTab === "center" && (
          <CenterTab constituencies={constituencies} booths={booths} rows={centers} setRows={setCenters} />
        )}

        {activeTab === "slot" && (
          <SlotTypeTab
            centers={centers}
            slotTypes={slotTypes}
            setSlotTypes={setSlotTypes}
            slotTimes={slotTimes}
            setSlotTimes={setSlotTimes}
          />
        )}

        {activeTab === "holiday" && (
          <HolidayTab
            booths={booths}
            centers={centers}
            slotTimes={slotTimes}
            rows={holidays}
            setRows={setHolidays}
          />
        )}

        {/* {activeTab === "appointment" && (
          <AppointmentTab
            constituencies={constituencies}
            booths={booths}
            centers={centers}
            slotTypes={slotTypes}
            slotTimes={slotTimes}
            holidays={holidays}
            rows={appointments}
            setRows={setAppointments}
          />
        )} */}

        {activeTab === "familybooking" && (
          <FamilyBookingTab
            constituencies={constituencies}
            booths={booths}
            centers={centers}
            rows={familyBookings}
            setRows={setFamilyBookings}
          />
        )}
      </div>
    </div>
  );
}
