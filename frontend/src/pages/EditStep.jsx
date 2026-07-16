import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getWorkflowStep,
  updateWorkflowStep,
} from "../services/workflow";

export default function EditStep() {
  const { id, stepId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    type: "",
    order: 1,
    configuration: {},
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const step = await getWorkflowStep(id, stepId);

      setForm({
        name: step.name,
        type: step.type,
        order: step.order,
        configuration: step.configuration || {},
      });

      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const save = async (e) => {
    e.preventDefault();

    await updateWorkflowStep(id, stepId, form);

    toast.success("Step Updated");

    navigate(`/workflows/${id}`);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <div style={{ maxWidth: 700 }}>

      <h2>Edit Step</h2>

      <form
        onSubmit={save}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 15,
          marginTop: 20,
        }}
      >

        <input
          value={form.name}
          onChange={(e) =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="number"
          value={form.order}
          onChange={(e) =>
            setForm({
              ...form,
              order: Number(e.target.value),
            })
          }
        />

        <textarea
          rows={10}
          value={JSON.stringify(form.configuration, null, 2)}
          onChange={(e) =>
            setForm({
              ...form,
              configuration: JSON.parse(e.target.value),
            })
          }
        />

        <button type="submit">
          Save Changes
        </button>

      </form>

    </div>
  );
}