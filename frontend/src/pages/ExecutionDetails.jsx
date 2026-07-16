import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Activity,
  Clock3,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileJson,
  Hash,
  ListChecks,
  User,
} from "lucide-react";

import ExecutionTimeline from "../components/ExecutionTimeline";
import Loader from "../components/Loader";
import { getWorkflowSteps } from "../services/workflow";
import { getExecution } from "../services/execution";

const TERMINAL_STATUSES = ["SUCCESS", "FAILED"];

const isExecutionRunning = (status) => status === "RUNNING";

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString();
};

const formatRuntime = (execution) => {
  if (!execution?.started_at) return "-";

  if (execution.duration) return `${execution.duration} sec`;

  const end = execution.finished_at
    ? new Date(execution.finished_at)
    : new Date();
  const seconds = Math.max(
    0,
    Math.round(
      (end.getTime() - new Date(execution.started_at).getTime()) / 1000,
    ),
  );

  if (seconds < 60) return `${seconds} sec`;

  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${minutes}m ${remainder}s`;
};

export default function ExecutionDetails() {
  const { id } = useParams();

  const [execution, setExecution] = useState(null);
  const [workflowSteps, setWorkflowSteps] = useState([]);

  const loadExecution = useCallback(async () => {
    try {
      const data = await getExecution(id);
      setExecution(data);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [id]);

  useEffect(() => {
    loadExecution();
  }, [loadExecution]);

  useEffect(() => {
    if (!isExecutionRunning(execution?.status)) return undefined;

    let stopped = false;
    let timeoutId;

    const pollExecution = async () => {
      const data = await loadExecution();

      if (!stopped && isExecutionRunning(data?.status)) {
        timeoutId = setTimeout(pollExecution, 1000);
      }
    };

    timeoutId = setTimeout(pollExecution, 1000);

    return () => {
      stopped = true;
      clearTimeout(timeoutId);
    };
  }, [execution?.status, loadExecution]);

  useEffect(() => {
    if (!execution?.workflow) return undefined;

    let active = true;

    const loadWorkflowSteps = async () => {
      try {
        const data = await getWorkflowSteps(execution.workflow);

        if (active) {
          setWorkflowSteps(data || []);
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadWorkflowSteps();

    return () => {
      active = false;
    };
  }, [execution?.workflow]);

  const logs = execution?.logs || [];
  const running = isExecutionRunning(execution?.status);
  const totalSteps = workflowSteps.length || logs.length;
  const completedLogs = logs.filter((log) =>
    TERMINAL_STATUSES.includes(log.status),
  ).length;

  const progress =
    execution?.status === "SUCCESS"
      ? 100
      : totalSteps
        ? Math.min(100, Math.round((completedLogs / totalSteps) * 100))
        : running
          ? 8
          : 100;

  const activeStepIndex = useMemo(() => {
    const runningLogIndex = logs.findIndex((log) => log.status === "RUNNING");

    if (runningLogIndex !== -1) return runningLogIndex;

    if (!running || !workflowSteps.length) return -1;

    return Math.min(completedLogs, workflowSteps.length - 1);
  }, [completedLogs, logs, running, workflowSteps.length]);

  const timelineItems = useMemo(() => {
    if (workflowSteps.length) {
      return workflowSteps.map((step, index) => {
        const log = logs[index];
        const active = index === activeStepIndex;

        return {
          id: step.id,
          step_name: step.name,
          step_type: step.step_type,
          started_at: log?.started_at,
          finished_at: log?.finished_at,
          raw: log,
          message:
            log?.message ||
            (active
              ? "This step is currently being processed."
              : "Waiting for execution."),
          status: log?.status || (active ? "RUNNING" : "PENDING"),
          active,
        };
      });
    }

    return logs.map((log, index) => ({
      id: `${log.step_name}-${index}`,
      ...log,
      active: index === activeStepIndex,
    }));
  }, [activeStepIndex, logs, workflowSteps]);

  if (!execution) return <Loader />;

  const badge =
    execution.status === "SUCCESS"
      ? "bg-green-100 text-green-700"
      : execution.status === "FAILED"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700";

  const runtime = formatRuntime(execution);
  const executionJson = JSON.stringify(execution, null, 2);
  const statusBadges = [
    { label: execution.status, className: badge },
    {
      label: running ? "Live" : "Final",
      className: running
        ? "bg-blue-100 text-blue-700"
        : "bg-slate-100 text-slate-700",
    },
    {
      label: `${completedLogs}/${totalSteps || logs.length} Steps`,
      className: "bg-indigo-100 text-indigo-700",
    },
  ];

  const progressColor =
    execution.status === "SUCCESS"
      ? "bg-green-500"
      : execution.status === "FAILED"
        ? "bg-red-500"
        : "bg-blue-500";

  const copyExecutionJson = async () => {
    try {
      await navigator.clipboard.writeText(executionJson);
      toast.success("Execution JSON copied");
    } catch (err) {
      console.error(err);
      toast.error("Failed to copy JSON");
    }
  };

  const downloadLogs = () => {
    const payload = {
      execution_id: execution.id,
      workflow: execution.workflow_name || execution.workflow,
      status: execution.status,
      runtime,
      exported_at: new Date().toISOString(),
      logs,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `execution-${String(execution.id).slice(0, 8)}-logs.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  };

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

          <motion.span
            key={execution.status}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`rounded-full px-5 py-3 text-sm font-bold ${badge}`}
          >
            {execution.status}
          </motion.span>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Execution Metadata
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              {execution.workflow_name || "Workflow Run"}
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {statusBadges.map((item) => (
                <motion.span
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${item.className}`}
                >
                  {item.label}
                </motion.span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyExecutionJson}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Copy size={18} />
              Copy JSON
            </button>

            <button
              type="button"
              onClick={downloadLogs}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              <Download size={18} />
              Download Logs
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetadataItem
            icon={<Hash size={18} />}
            label="Execution ID"
            value={execution.id}
          />
          <MetadataItem
            icon={<Activity size={18} />}
            label="Workflow"
            value={execution.workflow}
          />
          <MetadataItem
            icon={<User size={18} />}
            label="Started By"
            value={execution.started_by}
          />
          <MetadataItem
            icon={<ListChecks size={18} />}
            label="Logs"
            value={`${logs.length} Events`}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-slate-500">
              Execution Progress
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-800">
              {progress}%
            </h2>
          </div>

          <motion.span
            key={`progress-${execution.status}`}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${badge}`}
          >
            {running
              ? "Live Updating"
              : execution.status === "FAILED"
                ? "Execution Failed"
                : "Execution Complete"}
          </motion.span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={`h-full rounded-full ${progressColor}`}
          />
        </div>
      </div>

      {/* Summary */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <InfoCard
          icon={<Calendar className="text-blue-600" size={24} />}
          title="Started"
          value={formatDateTime(execution.started_at)}
        />

        <InfoCard
          icon={<Clock3 className="text-orange-500" size={24} />}
          title="Finished"
          value={formatDateTime(execution.finished_at)}
        />

        <InfoCard
          icon={<Activity className="text-green-600" size={24} />}
          title="Runtime"
          value={runtime}
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

      <ExecutionTimeline events={timelineItems} />

      <div className="rounded-3xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <FileJson size={24} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-800">
                JSON Payload
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Raw execution response used by this page.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={copyExecutionJson}
            className="flex w-fit items-center gap-2 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Copy size={18} />
            Copy JSON
          </button>
        </div>

        <pre className="max-h-[460px] overflow-auto rounded-2xl bg-slate-950 p-5 text-sm leading-7 text-slate-100">
          <code>{executionJson}</code>
        </pre>
      </div>
    </motion.div>
  );
}

function MetadataItem({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <div className="mb-3 flex items-center gap-2 text-blue-600">{icon}</div>

      <p className="text-sm text-slate-500">{label}</p>

      <p className="mt-2 break-all font-semibold text-slate-800">
        {value || "-"}
      </p>
    </div>
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
