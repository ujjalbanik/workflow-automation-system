import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Save, Settings2, Hash, FileJson } from "lucide-react";

import { getWorkflowStep, updateWorkflowStep } from "../services/workflow";

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
    const step = await getWorkflowStep(id, stepId);

    setForm({
      name: step.name,
      type: step.type,
      order: step.order,
      configuration: step.configuration || {},
    });

    setLoading(false);
  };

  const save = async (e) => {
    e.preventDefault();

    await updateWorkflowStep(id, stepId, form);

    toast.success("Step Updated");

    navigate(`/workflows/${id}`);
  };

  if (loading) return <h2>Loading...</h2>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-4xl"
    >
      <div className="mb-8 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 p-8 text-white">
        <h1 className="text-3xl font-bold">Edit Workflow Step</h1>

        <p className="mt-2 text-purple-100">Modify step configuration.</p>
      </div>

      <form
        onSubmit={save}
        className="space-y-6 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <Settings2 size={18} />
            Step Name
          </label>

          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <Hash size={18} />
            Execution Order
          </label>

          <input
            type="number"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold">
            <FileJson size={18} />
            Configuration (JSON)
          </label>

          <textarea
            rows={12}
            value={JSON.stringify(form.configuration, null, 2)}
            onChange={(e) => {
              try {
                setForm({
                  ...form,

                  configuration: JSON.parse(e.target.value),
                });
              } catch {}
            }}
            className="w-full rounded-xl border border-slate-200 px-4 py-3 font-mono outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex justify-end">
          <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </form>
    </motion.div>
  );
}
