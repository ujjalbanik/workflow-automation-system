import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams, Link } from "react-router-dom";
import AddStepModal from "../components/AddStepModal";

import {
  getWorkflow,
  getWorkflowSteps,
  executeWorkflow,
  deleteWorkflow,
  deleteWorkflowStep,
} from "../services/workflow";

export default function WorkflowDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [workflow, setWorkflow] = useState(null);
  const [steps, setSteps] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const workflowData = await getWorkflow(id);
      const stepsData = await getWorkflowSteps(id);

      setWorkflow(workflowData);
      setSteps(stepsData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleExecute = async () => {
    try {
      await executeWorkflow(id);
      toast.success("Workflow execution started");
    } catch (err) {
      console.error(err);
      toast.error("Execution failed");
    }
  };

  const removeWorkflow = async () => {
    if (!window.confirm("Delete this workflow?")) return;

    await deleteWorkflow(id);

    toast.success("Workflow deleted");

    navigate("/workflows");
  };

  const removeStep = async (stepId) => {
    if (!window.confirm("Delete this step?")) return;

    await deleteWorkflowStep(id, stepId);

    toast.success("Step deleted");

    load();
  };

  if (!workflow) {
    return <h2>Loading...</h2>;
  }

  return (
    <div>
      {/* Workflow Info */}

      <div
        style={{
          background: "#fff",
          borderRadius: 18,
          padding: 30,
          marginBottom: 30,
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
            <h1 style={{ margin: 0, fontSize: 30 }}>
              📋 {workflow?.name || "Workflow"}
            </h1>

            <p
              style={{
                marginTop: 12,
                color: "#666",
                fontSize: 16,
              }}
            >
              {workflow?.description || "No description provided."}
            </p>
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background: workflow?.status === "ACTIVE" ? "#dcfce7" : "#fef3c7",
              color: workflow?.status === "ACTIVE" ? "#15803d" : "#92400e",
              fontWeight: 700,
            }}
          >
            {workflow?.status || "Unknown"}
          </div>
        </div>

        <hr style={{ margin: "25px 0" }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
            marginBottom: 25,
          }}
        >
          <div>
            <div style={{ color: "#888" }}>Total Steps</div>
            <h2>{steps?.length || 0}</h2>
          </div>

          <div>
            <div style={{ color: "#888" }}>Workflow Status</div>
            <h2>{workflow?.status || "Unknown"}</h2>
          </div>

          <div>
            <div style={{ color: "#888" }}>Created</div>
            <h2>
              {workflow?.created_at
                ? new Date(workflow.created_at).toLocaleDateString()
                : "-"}
            </h2>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 15,
            flexWrap: "wrap",
          }}
        >
          <button onClick={handleExecute}>▶ Execute Workflow</button>

          <button>✏ Edit Workflow</button>

          <button
            onClick={removeWorkflow}
            style={{
              background: "#ef4444",
              color: "#fff",
            }}
          >
            🗑 Delete Workflow
          </button>
        </div>
      </div>

      {/* Steps */}

      <div
        style={{
          background: "#fff",
          padding: "25px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,.08)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Workflow Steps</h2>

          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "10px 18px",
              background: "#16a34a",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Add Step
          </button>
        </div>

        {steps.length === 0 ? (
          <p>No steps added yet.</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <div className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow">
                🚀 Trigger
              </div>
            </div>
            {steps.map((step) => (
              <div key={step.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    margin: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 42,
                      background: "#cbd5e1",
                      borderRadius: 20,
                    }}
                  ></div>
                </div>

                <div
                  style={{
                    width: "100%",
                    maxWidth: "900px",
                    margin: "0 auto",
                    background: "#fff",
                    borderRadius: 18,
                    padding: 24,
                    boxShadow: "0 8px 20px rgba(0,0,0,.08)",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 20,
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <h2 className="text-xl font-bold">
                        {step.step_type === "EMAIL" && "📧"}
                        {step.step_type === "WAIT" && "⏱"}
                        {step.step_type === "HTTP_REQUEST" && "🌐"} {step.name}
                      </h2>

                      <p className="text-gray-500">{step.description}</p>
                    </div>

                    <span className="bg-gray-200 rounded-full px-4 py-1 h-fit">
                      #{step.order}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop: 20,
                      background: "#f8fafc",
                      borderRadius: 12,
                      padding: 16,
                    }}
                  >
                    {step.step_type === "EMAIL" && (
                      <>
                        <p>👤 Recipient : {step.configuration.to}</p>
                        <p>📨 Subject : {step.configuration.subject}</p>
                      </>
                    )}

                    {step.step_type === "WAIT" && (
                      <p>⏱ Wait : {step.configuration.seconds} seconds</p>
                    )}

                    {step.step_type === "HTTP_REQUEST" && (
                      <>
                        <p>🌐 {step.configuration.method}</p>
                        <p>🔗 {step.configuration.url}</p>
                      </>
                    )}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexWrap: "wrap",
                      marginTop: 20,
                    }}
                  >
                    <Link
                      to={`/workflows/${id}/steps/${step.id}/edit`}
                      className="bg-yellow-500 text-white px-4 py-2 rounded"
                    >
                      ✏ Edit
                    </Link>

                    <button
                      onClick={() => removeStep(step.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                margin: "8px 0",
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 42,
                  background: "#cbd5e1",
                  borderRadius: 20,
                }}
              ></div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow">
                ✅ End
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <AddStepModal
          workflowId={id}
          onClose={() => setShowModal(false)}
          onSuccess={load}
        />
      )}
    </div>
  );
}
