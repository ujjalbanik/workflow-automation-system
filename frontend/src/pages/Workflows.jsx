import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import Loader from "../components/Loader";
import {
  getWorkflows,
  executeWorkflow,
  deleteWorkflow,
} from "../services/workflow";

export default function Workflows() {
  const [workflows, setWorkflows] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getWorkflows();
    setWorkflows(data);
  };

  const execute = async (id) => {
    await executeWorkflow(id);
    toast.success("Workflow Started");
  };

  const remove = async (id) => {
    if (!window.confirm("Delete Workflow?")) return;

    await deleteWorkflow(id);

    toast.success("Workflow Deleted");
    load();
  };

  if (!workflows) return <Loader />;

  const filtered = workflows.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase()),
  );

  const buttonStyle = {
    background: "linear-gradient(135deg,#16a34a,#22c55e)",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: 30,
    border: 0,
    cursor: "pointer",
    fontWeight: 600,
    transition: "all .25s ease",
    boxShadow: "0 5px 12px rgba(34,197,94,.25)",
  };

  return (
    <div
      style={{
        animation: "fade .35s ease",
      }}
    >
      <style>{`
        @keyframes fade{
          from{
            opacity:0;
            transform:translateY(12px);
          }
          to{
            opacity:1;
            transform:translateY(0);
          }
        }

        .workflow-card{
          transition:.3s ease;
        }

        .workflow-card:hover{
          transform:translateY(-8px);
          box-shadow:0 18px 45px rgba(0,0,0,.12);
        }

        .action-btn:hover{
          transform:translateY(-2px) scale(1.03);
          filter:brightness(1.05);
        }

        .search-box{
          transition:.25s;
        }

        .search-box:focus{
          outline:none;
          border-color:#22c55e;
          box-shadow:0 0 0 4px rgba(34,197,94,.15);
        }
      `}</style>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 25,
          flexWrap: "wrap",
          gap: 20,
        }}
      >
        <div>
          <h1
            style={{
              marginBottom: 6,
            }}
          >
            📋 Workflows
          </h1>

          <p style={{ color: "#777" }}>
            Manage and automate your business processes.
          </p>
        </div>

        <Link to="/workflows/create">
          <button className="action-btn" style={buttonStyle}>
            ➕ Create Workflow
          </button>
        </Link>
      </div>

      <input
        className="search-box"
        placeholder="🔍 Search workflows..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 15,
          borderRadius: 14,
          border: "1px solid #ddd",
          marginBottom: 35,
          fontSize: 15,
          background: "#fff",
        }}
      />

      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: 80,
            color: "#666",
          }}
        >
          <h1
            style={{
              fontSize: 70,
              marginBottom: 10,
            }}
          >
            📭
          </h1>

          <h2>No Workflows Found</h2>

          <p>Create your first workflow.</p>

          <Link to="/workflows/create">
            <button
              className="action-btn"
              style={{
                ...buttonStyle,
                marginTop: 20,
              }}
            >
              ➕ Create Workflow
            </button>
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(350px,1fr))",
            gap: 25,
          }}
        >
          {filtered.map((workflow) => (
            <div
              key={workflow.id}
              className="workflow-card"
              style={{
                background: "#fff",
                borderRadius: 26,
                padding: 25,
                boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                border: "1px solid #f1f1f1",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 15,
                  alignItems: "center",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                  }}
                >
                  📋 {workflow.name}
                </h2>

                <span
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    background:
                      workflow.status === "ACTIVE" ? "#dcfce7" : "#fef9c3",
                    color: workflow.status === "ACTIVE" ? "#15803d" : "#a16207",
                    fontWeight: 600,
                    fontSize: 13,
                  }}
                >
                  {workflow.status === "ACTIVE" ? "🟢 Active" : "🟡 Draft"}
                </span>
              </div>

              <p
                style={{
                  color: "#666",
                  minHeight: 55,
                  lineHeight: 1.6,
                }}
              >
                {workflow.description || "No Description"}
              </p>

              <hr style={{ margin: "10px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#666",
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                <span>
                  📅{" "}
                  {workflow.created_at
                    ? new Date(workflow.created_at).toLocaleDateString()
                    : "N/A"}
                </span>

                <span>📝 Workflow</span>
              </div>

              <hr />

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 22,
                }}
              >
                <Link to={`/workflows/${workflow.id}`}>
                  <button className="action-btn" style={buttonStyle}>
                    👁 Open
                  </button>
                </Link>

                <Link to={`/workflows/${workflow.id}/edit`}>
                  <button className="action-btn" style={buttonStyle}>
                    ✏ Edit
                  </button>
                </Link>

                <button
                  className="action-btn"
                  style={buttonStyle}
                  onClick={() => execute(workflow.id)}
                >
                  ▶ Execute
                </button>

                <button
                  className="action-btn"
                  style={{
                    ...buttonStyle,
                    background: "linear-gradient(135deg,#ef4444,#dc2626)",
                    boxShadow: "0 5px 12px rgba(239,68,68,.25)",
                  }}
                  onClick={() => remove(workflow.id)}
                >
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
