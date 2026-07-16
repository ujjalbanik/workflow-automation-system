import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import { getExecution } from "../services/execution";

export default function ExecutionDetails() {
  const { id } = useParams();

  const [execution, setExecution] = useState(null);

  useEffect(() => {
    loadExecution();
  }, [id]);

  const loadExecution = async () => {
    try {
      const data = await getExecution(id);
      setExecution(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!execution) return <Loader />;

  const statusColor =
    execution.status === "SUCCESS"
      ? "#16a34a"
      : execution.status === "FAILED"
        ? "#dc2626"
        : "#2563eb";

  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      <Link
        to="/executions"
        style={{
          textDecoration: "none",
          color: "#2563eb",
          fontWeight: 600,
        }}
      >
        ← Back to Executions
      </Link>

      <div
        style={{
          background: "#fff",
          marginTop: 20,
          borderRadius: 18,
          padding: 30,
          boxShadow: "0 8px 25px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
              }}
            >
              ⚙ Workflow Execution
            </h1>

            <p
              style={{
                color: "#666",
                marginTop: 10,
              }}
            >
              {execution.workflow_name || execution.workflow}
            </p>
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderRadius: 30,
              background: statusColor,
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {execution.status}
          </div>
        </div>

        <hr style={{ margin: "30px 0" }} />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
            gap: 20,
          }}
        >
          <InfoCard
            title="Started"
            value={new Date(execution.started_at).toLocaleString()}
          />

          <InfoCard
            title="Finished"
            value={
              execution.finished_at
                ? new Date(execution.finished_at).toLocaleString()
                : "-"
            }
          />

          <InfoCard
            title="Duration"
            value={execution.duration ? `${execution.duration} sec` : "-"}
          />

          <InfoCard title="Execution ID" value={execution.id.slice(0, 8)} />
        </div>

        {execution.error_message && (
          <div
            style={{
              marginTop: 30,
              background: "#fee2e2",
              padding: 20,
              borderRadius: 10,
              color: "#991b1b",
            }}
          >
            <b>Error</b>

            <br />

            {execution.error_message}
          </div>
        )}

        <h2
          style={{
            marginTop: 40,
            marginBottom: 20,
          }}
        >
          Execution Timeline
        </h2>

        {execution.logs?.length ? (
          execution.logs.map((log, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 25,
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background:
                    log.status === "SUCCESS"
                      ? "#16a34a"
                      : log.status === "FAILED"
                        ? "#dc2626"
                        : "#2563eb",
                  marginTop: 8,
                }}
              />

              <div
                style={{
                  flex: 1,
                  background: "#fff",
                  border: "1px solid #eee",
                  borderRadius: 12,
                  padding: 18,
                }}
              >
                <h3
                  style={{
                    margin: 0,
                  }}
                >
                  {log.step_name}
                </h3>

                <small
                  style={{
                    color: "#2563eb",
                  }}
                >
                  {log.step_type}
                </small>

                <p
                  style={{
                    marginTop: 10,
                    color: "#555",
                  }}
                >
                  {log.message}
                </p>

                <small
                  style={{
                    color: "#999",
                  }}
                >
                  {log.status}
                </small>
              </div>
            </div>
          ))
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#777",
            }}
          >
            No execution logs available.
          </div>
        )}
      </div>
    </div>
  );
}

function InfoCard({ title, value }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        borderRadius: 12,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#666",
          fontSize: 14,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        {value}
      </div>
    </div>
  );
}
