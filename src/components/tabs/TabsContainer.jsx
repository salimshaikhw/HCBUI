export default function TabsContainer({ activeTab, setActiveTab }) {
  const tabs = [
    { key: "familybooking", label: "Family Bookings" },
    { key: "constituency", label: "Constituency" },
    { key: "booth", label: "Booth" },
    { key: "center", label: "Center" },
    { key: "slot", label: "Slot" },
    { key: "holiday", label: "Holiday" },
    // { key: "appointment", label: "Appointment" }, // ✅ ADDED
  ];

  return (
    <div className="tabs">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "active" : ""}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
