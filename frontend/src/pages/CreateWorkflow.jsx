import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Workflow, FileText, Activity, ArrowRight } from "lucide-react";

import { createWorkflow } from "../services/workflow";

export default function CreateWorkflow() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "DRAFT",
  });

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const workflow = await createWorkflow(form);

      toast.success("Workflow created successfully");

      navigate(`/workflows/${workflow.id}`);
    } catch (err) {
      toast.error("Failed to create workflow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto max-w-4xl space-y-8"
    >
      {/* Header */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="rounded-2xl bg-white/20 p-4">
            <Workflow size={34} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Create Workflow</h1>

            <p className="mt-2 text-blue-100">
              Build a new workflow automation.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}

      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="space-y-6 rounded-3xl bg-white p-8 shadow-xl"
      >
        {/* Workflow Name */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <Workflow size={18} />
            Workflow Name
          </label>

          <input
            type="text"
            required
            placeholder="Enter workflow name..."
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

        {/* Description */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <FileText size={18} />
            Description
          </label>

          <textarea
            rows={6}
            placeholder="Describe what this workflow does..."
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

        {/* Status */}

        <div>
          <label className="mb-2 flex items-center gap-2 font-semibold text-slate-700">
            <Activity size={18} />
            Workflow Status
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
          </select>
        </div>

        {/* Footer */}

        <div className="flex justify-end pt-4">
          <motion.button
            whileHover={{
              scale: 1.03,
              y: -2,
            }}
            whileTap={{
              scale: 0.98,
            }}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? (
              "Creating..."
            ) : (
              <>
                Create Workflow
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
}
