import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Activity,
  Clock3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

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

  const badge =
    execution.status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : execution.status === "FAILED"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-6xl space-y-8"
    >
      {/* Back */}

      <Link
        to="/executions"
        className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
      >
        <ArrowLeft size={18} />
        Back to Executions
      </Link>

      {/* Hero */}

      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-8 text-white shadow-2xl">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="rounded-2xl bg-white/20 p-4">
                <Activity size={34} />
              </div>

              <div>
                <h1 className="text-3xl font-bold">Workflow Execution</h1>

                <p className="mt-2 text-blue-100">
                  {execution.workflow_name || execution.workflow}
                </p>
              </div>
            </div>
          </div>

          <span className={`rounded-full px-5 py-3 text-sm font-bold ${badge}`}>
            {execution.status}
          </span>
        </div>
      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Calendar className="text-blue-600" size={24} />}
          title="Started"
          value={new Date(execution.started_at).toLocaleString()}
        />

        <InfoCard
          icon={<Clock3 className="text-orange-500" size={24} />}
          title="Finished"
          value={
            execution.finished_at
              ? new Date(execution.finished_at).toLocaleString()
              : "-"
          }
        />

        <InfoCard
          icon={<Activity className="text-green-600" size={24} />}
          title="Duration"
          value={execution.duration ? `${execution.duration} sec` : "-"}
        />

        <InfoCard
          icon={<CheckCircle2 className="text-indigo-600" size={24} />}
          title="Execution ID"
          value={String(execution.id).slice(0, 8)}
        />
      </div>

      {/* Error */}

      {execution.error_message && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="mb-3 flex items-center gap-3 text-red-700">
            <AlertTriangle size={22} />

            <h3 className="text-lg font-bold">Execution Error</h3>
          </div>

          <p className="text-red-700">{execution.error_message}</p>
        </div>
      )}

      {/* Timeline */}

      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <h2 className="mb-8 text-2xl font-bold text-slate-800">
          Execution Timeline
        </h2>

        {execution.logs?.length ? (
          <div className="relative">
            <div className="absolute left-5 top-0 h-full w-1 rounded-full bg-slate-200" />

            <div className="space-y-8">
              {execution.logs.map((log, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative ml-2"
                >
                  <div
                    className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ${
                      log.status === "SUCCESS"
                        ? "bg-green-600"
                        : log.status === "FAILED"
                          ? "bg-red-600"
                          : "bg-blue-600"
                    } text-white shadow-lg`}
                  >
                    {log.status === "SUCCESS" ? (
                      <CheckCircle2 size={18} />
                    ) : log.status === "FAILED" ? (
                      <XCircle size={18} />
                    ) : (
                      <Activity size={18} />
                    )}
                  </div>

                  <div className="ml-16 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800">
                          {log.step_name}
                        </h3>

                        <p className="mt-1 text-sm text-blue-600">
                          {log.step_type}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          log.status === "SUCCESS"
                            ? "bg-green-100 text-green-700"
                            : log.status === "FAILED"
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <p className="mt-5 leading-7 text-slate-600">
                      {log.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 p-16 text-center">
            <Activity size={56} className="mx-auto mb-5 text-slate-400" />

            <h3 className="text-2xl font-bold text-slate-700">
              No Execution Logs
            </h3>

            <p className="mt-2 text-slate-500">
              This execution doesn't have any logs yet.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <div className="mb-4">{icon}</div>

      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-lg font-bold text-slate-800 break-all">
        {value}
      </h3>
    </div>
  );
}
