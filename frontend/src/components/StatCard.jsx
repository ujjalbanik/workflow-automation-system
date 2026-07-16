export default function StatCard({ title, value, color = "#2563eb" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: 25,
        boxShadow: "0 8px 25px rgba(0,0,0,.08)",
        transition: ".25s",
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: 15,
          marginBottom: 15,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 42,
          fontWeight: 700,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}
