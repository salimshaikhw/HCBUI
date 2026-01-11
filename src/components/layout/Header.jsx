export default function Header() {
  return (
    <header
      style={{
        backgroundColor: "#007bff",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        alignItems: "center",
        gap: "15px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/2913/2913133.png"
          alt="Health Card"
          style={{
            width: "40px",
            height: "40px",
            objectFit: "contain",
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          Health Card Booking
        </h1>
      </div>
    </header>
  );
}
