import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { createWorkflow } from "../services/workflow";

export default function CreateWorkflow() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "DRAFT",
  });

  const submit = async (e) => {
    e.preventDefault();

    const workflow = await createWorkflow(form);
    toast.success("Workflow created");

    navigate(`/workflows/${workflow.id}`);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <h1>Create Workflow</h1>

      <form
        onSubmit={submit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 25,
        }}
      >
        <input
          placeholder="Workflow Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <textarea
          rows={5}
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        <select
          value={form.status}
          onChange={(e) =>
            setForm({
              ...form,
              status: e.target.value,
            })
          }
        >
          <option>DRAFT</option>
          <option>ACTIVE</option>
        </select>

        <button
          style={{
            padding: 14,
            background: "#1e3a8a",
            color: "#fff",
            border: 0,
            cursor: "pointer",
          }}
        >
          Create Workflow
        </button>
      </form>
    </div>
  );
}