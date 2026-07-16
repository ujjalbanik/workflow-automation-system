import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Clock3, XCircle, Eye } from "lucide-react";

import { getExecutions } from "../services/execution";
import Loader from "../components/Loader";

const TERMINAL_STATUSES = ["SUCCESS", "FAILED"];

const isExecutionRunning = (status) =>
  status && !TERMINAL_STATUSES.includes(status);

export default function Executions() {
  const navigate = useNavigate();

  const [executions, setExecutions] = useState(null);

  const loadExecutions = useCallback(async () => {
    try {
      const data = await getExecutions();
      setExecutions(data || []);
      return data || [];
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  useEffect(() => {
    loadExecutions();
  }, [loadExecutions]);

  const hasRunningExecutions = useMemo(
    () => executions?.some((execution) => isExecutionRunning(execution.status)),
    [executions],
  );

  useEffect(() => {
    if (!hasRunningExecutions) return undefined;

    let stopped = false;
    let timeoutId;

    const pollExecutions = async () => {
      const data = await loadExecutions();
      const stillRunning = data?.some((execution) =>
        isExecutionRunning(execution.status),
      );

      if (!stopped && stillRunning) {
        timeoutId = setTimeout(pollExecutions, 1000);
      }
    };

    timeoutId = setTimeout(pollExecutions, 1000);

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  }, [hasRunningExecutions, loadExecutions]);

  if (!executions) return <Loader />;

  const success = executions.filter((e) => e.status === "SUCCESS").length;

  const failed = executions.filter((e) => e.status === "FAILED").length;

  const running = executions.filter((e) => isExecutionRunning(e.status)).length;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="rounded-2xl bg-white/20 p-4">
            <Activity size={36} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Execution History</h1>

            <p className="mt-2 text-blue-100">
              Monitor every workflow execution in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <CheckCircle2 size={32} className="mb-3 text-green-600" />

          <p className="text-slate-500">Successful</p>

          <h2 className="mt-2 text-3xl font-bold">{success}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <XCircle size={32} className="mb-3 text-red-600" />

          <p className="text-slate-500">Failed</p>

          <h2 className="mt-2 text-3xl font-bold">{failed}</h2>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <Clock3 size={32} className="mb-3 text-orange-500" />

          <p className="text-slate-500">Running</p>

          <h2 className="mt-2 text-3xl font-bold">{running}</h2>
        </div>
      </div>

      {/* Executions */}

      <div className="space-y-5">
        {executions.map((execution, index) => (
          <motion.div
            key={execution.id}
            layout
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: index * 0.06,
            }}
            whileHover={{
              y: -4,
            }}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Workflow</h2>

                <p className="mt-1 font-mono text-sm text-slate-500">
                  {execution.workflow}
                </p>

                <div className="mt-5 flex flex-wrap gap-5 text-sm text-slate-500">
                  <span>
                    Started: {new Date(execution.started_at).toLocaleString()}
                  </span>

                  <span>
                    Finished:{" "}
                    {execution.finished_at
                      ? new Date(execution.finished_at).toLocaleString()
                      : "-"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <motion.span
                  key={`${execution.id}-${execution.status}`}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    execution.status === "SUCCESS"
                      ? "bg-green-100 text-green-700"
                      : execution.status === "FAILED"
                        ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {execution.status}
                </motion.span>

                <button
                  onClick={() => navigate(`/executions/${execution.id}`)}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  <Eye size={18} />
                  Details
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
