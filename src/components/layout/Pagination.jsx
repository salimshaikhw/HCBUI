export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) {
  return (
    <div
      style={{
        marginTop: "20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px",
        backgroundColor: "#f8f9fa",
        borderRadius: "6px",
        flexWrap: "wrap",
        gap: "10px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", whiteSpace: "nowrap" }}>
        <label style={{ fontSize: "14px", fontWeight: "bold", whiteSpace: "nowrap" }}>
          Items per page:
        </label>
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          style={{
            padding: "6px 10px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: currentPage === 1 ? "#e9ecef" : "#007bff",
            color: currentPage === 1 ? "#6c757d" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          &laquo;
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "none",
            backgroundColor: currentPage === 1 ? "#e9ecef" : "#007bff",
            color: currentPage === 1 ? "#6c757d" : "white",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          &lsaquo;
        </button>

        <span style={{ fontSize: "14px", padding: "0 10px", fontWeight: "500" }}>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "none",
            backgroundColor:
              currentPage === totalPages ? "#e9ecef" : "#007bff",
            color: currentPage === totalPages ? "#6c757d" : "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          &rsaquo;
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          style={{
            padding: "6px 12px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "none",
            backgroundColor:
              currentPage === totalPages ? "#e9ecef" : "#007bff",
            color: currentPage === totalPages ? "#6c757d" : "white",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          &raquo;
        </button>
      </div>
    </div>
  );
}
