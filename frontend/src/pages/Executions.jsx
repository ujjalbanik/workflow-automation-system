import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getExecutions } from "../services/execution";
import Loader from "../components/Loader";

export default function Executions() {
  const navigate = useNavigate();
  const [executions, setExecutions] = useState(null);

  useEffect(() => {
    loadExecutions();
  }, []);

  const loadExecutions = async () => {
    try {
      const data = await getExecutions();
      setExecutions(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!executions) return <Loader />;

  return (
    <div>
      <h1 style={{ marginBottom: 20 }}>Execution History</h1>

      <table
        style={{
          width: "100%",
          background: "#fff",
          borderCollapse: "collapse",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <thead
          style={{
            background: "#1e3a8a",
            color: "#fff",
          }}
        >
          <tr>
            <th style={{ padding: 14, textAlign: "left" }}>Workflow ID</th>
            <th style={{ padding: 14, textAlign: "left" }}>Status</th>
            <th style={{ padding: 14, textAlign: "left" }}>Started</th>
            <th style={{ padding: 14, textAlign: "left" }}>Finished</th>
            <th style={{ padding: 14, textAlign: "left" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {executions.map((execution) => (
            <tr
              key={execution.id}
              style={{
                borderBottom: "1px solid #eee",
              }}
            >
              <td style={{ padding: 14 }}>
                {execution.workflow.slice(0, 8)}...
              </td>

              <td
                style={{
                  padding: 14,
                  color:
                    execution.status === "SUCCESS"
                      ? "green"
                      : execution.status === "FAILED"
                      ? "red"
                      : "#f59e0b",
                  fontWeight: "bold",
                }}
              >
                {execution.status}
              </td>

              <td style={{ padding: 14 }}>
                {new Date(execution.started_at).toLocaleString()}
              </td>

              <td style={{ padding: 14 }}>
                {execution.finished_at
                  ? new Date(execution.finished_at).toLocaleString()
                  : "-"}
              </td>

              <td style={{ padding: 14 }}>
                <button
                  onClick={() => navigate(`/executions/${execution.id}`)}
                  style={{
                    padding: "8px 14px",
                    background: "#2563eb",
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}