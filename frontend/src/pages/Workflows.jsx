import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { Search, Plus, Workflow } from "lucide-react";

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
    try {
      const data = await getWorkflows();
      setWorkflows(data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load workflows");
      setWorkflows([]);
    }
  };

  const execute = async (id) => {
    try {
      await executeWorkflow(id);
      toast.success("Workflow started");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to execute workflow",
      );
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete Workflow?")) return;

    try {
      await deleteWorkflow(id);
      toast.success("Workflow deleted");
      load();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete workflow",
      );
    }
  };

  if (!workflows) return <Loader />;

  const filtered = (workflows || []).filter((workflow) =>
    (workflow.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Workflow Management
          </h1>
          <p className="mt-2 text-slate-500">
            Create, manage and automate workflow executions.
          </p>
        </div>

        <Link to="/workflows/create">
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Create Workflow
          </motion.button>
        </Link>
      </div>

      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            placeholder="Search workflows..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-12 pr-5 shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20"
          />
        </div>
      </motion.div>

      <div className="grid gap-6">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-3xl bg-white p-20 text-center shadow-xl"
          >
            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-blue-100">
              <Workflow size={60} className="text-blue-600" />
            </div>

            <h2 className="mt-8 text-3xl font-bold text-slate-800">
              No Workflows Found
            </h2>

            <p className="mt-3 text-slate-500">
              Create your first automation workflow.
            </p>

            <Link to="/workflows/create">
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg hover:bg-blue-700"
              >
                <Plus size={18} />
                Create Workflow
              </motion.button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((workflow, index) => (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
              >
                <div className="p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-blue-100 p-3">
                        <Workflow size={22} className="text-blue-600" />
                      </div>

                      <div>
                        <h2 className="text-lg font-bold text-slate-800">
                          {workflow.name}
                        </h2>
                        <p className="text-sm text-slate-500">Workflow</p>
                      </div>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        workflow.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {workflow.status === "ACTIVE" ? "Active" : "Draft"}
                    </span>
                  </div>

                  <p className="min-h-[70px] leading-7 text-slate-600">
                    {workflow.description || "No description provided."}
                  </p>

                  <div className="my-5 h-px bg-slate-200" />

                  <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
                    <span>
                      {workflow.created_at
                        ? new Date(workflow.created_at).toLocaleDateString()
                        : "N/A"}
                    </span>

                    <span>ID #{workflow.id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Link to={`/workflows/${workflow.id}`}>
                      <button className="w-full rounded-xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-black">
                        Open
                      </button>
                    </Link>

                    <Link to={`/workflows/${workflow.id}/edit`}>
                      <button className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700">
                        Edit
                      </button>
                    </Link>

                    <button
                      type="button"
                      onClick={() => execute(workflow.id)}
                      className="w-full rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
                    >
                      Execute
                    </button>

                    <button
                      type="button"
                      onClick={() => remove(workflow.id)}
                      className="w-full rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
