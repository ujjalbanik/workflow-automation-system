import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Workflow, FileText, Activity, Save } from "lucide-react";

import { getWorkflow, updateWorkflow } from "../services/workflow";

export default function EditWorkflow() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "DRAFT",
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const wf = await getWorkflow(id);

      setForm({
        name: wf.name,
        description: wf.description || "",
        status: wf.status,
      });
    } finally {
      setLoading(false);
    }
  };

  const save = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await updateWorkflow(id, form);

      toast.success("Workflow Updated");

      navigate(`/workflows/${id}`);
    } catch {
      toast.error("Failed to update workflow");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="text-slate-500">Loading...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="rounded-2xl bg-white/20 p-4">
            <Workflow size={34} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Edit Workflow</h1>

            <p className="mt-2 text-orange-100">
              Update your workflow configuration.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}

      <motion.form
        onSubmit={save}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-6 rounded-3xl bg-white p-8 shadow-xl"
      >
        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <Workflow size={18} />
            Workflow Name
          </label>

          <input
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <FileText size={18} />
            Description
          </label>

          <textarea
            rows={6}
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <Activity size={18} />
            Status
          </label>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
          >
            <option value="DRAFT">Draft</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{
              scale: 1.03,
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-amber-600 disabled:opacity-60"
          >
            <Save size={18} />

            {saving ? "Saving..." : "Save Changes"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
