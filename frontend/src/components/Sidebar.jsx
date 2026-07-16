import { Link } from "react-router-dom";

const linkStyle={
color:"#fff",
textDecoration:"none",
padding:"12px 15px",
borderRadius:10,
background:"rgba(255,255,255,.05)",
transition:".25s",
};

export default function Sidebar() {
  return (
    <div
      style={{
        width: 250,
        background: "#111827",
        color: "#fff",
        padding: 25,
      }}
    >
      <h2>⚙ Menu</h2>

      <hr
        style={{
          borderColor: "#333",
          margin: "20px 0",
        }}
      />

      <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginTop: 30,
  }}
>

<Link
to="/dashboard"
style={linkStyle}
>

📊 Dashboard

</Link>

<Link
to="/workflows"
style={linkStyle}
>

📋 Workflows

</Link>

<Link
to="/workflows/create"
style={linkStyle}
>

➕ Create Workflow

</Link>

<Link
to="/executions"
style={linkStyle}
>

⚙ Executions

</Link>

</div>
    </div>
  );
}