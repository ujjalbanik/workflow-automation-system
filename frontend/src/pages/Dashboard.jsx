import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  ListChecks,
  PieChart as PieChartIcon,
  PlayCircle,
  Plus,
  Workflow,
  XCircle,
} from "lucide-react";

import DashboardChartCard from "../components/DashboardChartCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import StatCard from "../components/StatCard";
import { getDashboardStats, getExecutions } from "../services/execution";
import { getWorkflows } from "../services/workflow";

const STATUS_STYLES = {
  SUCCESS: {
    label: "Success",
    icon: CheckCircle2,
    badge: "bg-green-100 text-green-700",
    color: "#16a34a",
  },
  FAILED: {
    label: "Failed",
    icon: XCircle,
    badge: "bg-red-100 text-red-700",
    color: "#dc2626",
  },
  RUNNING: {
    label: "Running",
    icon: Activity,
    badge: "bg-blue-100 text-blue-700",
    color: "#2563eb",
  },
  PENDING: {
    label: "Pending",
    icon: Clock3,
    badge: "bg-slate-100 text-slate-700",
    color: "#64748b",
  },
};

const getStatusStyle = (status) => STATUS_STYLES[status] || STATUS_STYLES.PENDING;

const formatDateTime = (value) => {
  if (!value) return "-";

  return new Date(value).toLocaleString();
};

const formatRuntime = (execution) => {
  if (execution?.duration) return `${execution.duration} sec`;
  if (!execution?.started_at) return "-";

  const end = execution.finished_at
    ? new Date(execution.finished_at)
    : new Date();
  const seconds = Math.max(
    0,
    Math.round((end.getTime() - new Date(execution.started_at).getTime()) / 1000),
  );

  if (seconds < 60) return `${seconds} sec`;

  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};

const getRuntimeSeconds = (execution) => {
  if (Number(execution?.duration)) return Number(execution.duration);
  if (!execution?.started_at || !execution?.finished_at) return null;

  return Math.max(
    0,
    (new Date(execution.finished_at).getTime() -
      new Date(execution.started_at).getTime()) /
      1000,
  );
};

const getShortDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

function EmptyState({ icon, title, description, action }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-white p-10 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-800">{title}</h3>

      <p className="mx-auto mt-2 max-w-md text-slate-500">{description}</p>

      {action}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [workflows, setWorkflows] = useState([]);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [statsData, workflowsData, executionsData] = await Promise.all([
        getDashboardStats(),
        getWorkflows(),
        getExecutions(),
      ]);

      setStats(statsData);
      setWorkflows(workflowsData || []);
      setExecutions(executionsData || []);
    } finally {
      setLoading(false);
    }
  };

  const analytics = useMemo(() => {
    const totalExecutions = stats?.total_executions || executions.length;
    const successfulExecutions =
      stats?.successful_executions ||
      executions.filter((execution) => execution.status === "SUCCESS").length;
    const failedExecutions =
      stats?.failed_executions ||
      executions.filter((execution) => execution.status === "FAILED").length;
    const activeWorkflows = workflows.filter(
      (workflowItem) => workflowItem.status === "ACTIVE",
    ).length;
    const successRate = totalExecutions
      ? Math.round((successfulExecutions / totalExecutions) * 100)
      : 0;
    const completedRuntimes = executions
      .map(getRuntimeSeconds)
      .filter((runtime) => Number.isFinite(runtime));
    const averageRuntime = completedRuntimes.length
      ? `${(
          completedRuntimes.reduce((sum, runtime) => sum + runtime, 0) /
          completedRuntimes.length
        ).toFixed(1)} sec`
      : "-";

    const trendMap = executions.reduce((acc, execution) => {
      const dateKey = execution.started_at
        ? getShortDate(execution.started_at)
        : "Unknown";

      acc[dateKey] = (acc[dateKey] || 0) + 1;
      return acc;
    }, {});

    const executionTrend = Object.entries(trendMap)
      .map(([date, count]) => ({ date, executions: count }))
      .slice(0, 7)
      .reverse();

    const statusDistribution = Object.entries(
      executions.reduce((acc, execution) => {
        acc[execution.status] = (acc[execution.status] || 0) + 1;
        return acc;
      }, {}),
    ).map(([status, count]) => ({
      status,
      name: getStatusStyle(status).label,
      value: count,
      color: getStatusStyle(status).color,
    }));

    return {
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      activeWorkflows,
      successRate,
      averageRuntime,
      executionTrend,
      statusDistribution,
      recentExecutions: executions.slice(0, 5),
      recentActivity: executions.slice(0, 6),
    };
  }, [executions, stats, workflows]);

  if (loading) return <DashboardSkeleton />;

  const hasExecutions = executions.length > 0;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 p-8 text-white shadow-2xl sm:p-10"
      >
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase text-blue-100">
              Workflow Analytics
            </p>

            <h1 className="text-4xl font-bold">Operations Dashboard</h1>

            <p className="mt-3 max-w-2xl text-blue-100">
              Track workflow health, execution outcomes, and recent automation
              activity from one responsive control surface.
            </p>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="hidden lg:block"
          >
            <BarChart3 size={124} className="text-white/20" />
          </motion.div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {[
          {
            title: "Total Workflows",
            value: stats?.total_workflows || workflows.length,
            icon: <Workflow size={24} />,
            color: "blue",
          },
          {
            title: "Active Workflows",
            value: analytics.activeWorkflows,
            icon: <ListChecks size={24} />,
            color: "indigo",
          },
          {
            title: "Total Executions",
            value: analytics.totalExecutions,
            icon: <PlayCircle size={24} />,
            color: "purple",
          },
          {
            title: "Success Rate",
            value: `${analytics.successRate}%`,
            icon: <CheckCircle2 size={24} />,
            color: "green",
          },
          {
            title: "Failed Executions",
            value: analytics.failedExecutions,
            icon: <XCircle size={24} />,
            color: "red",
          },
          {
            title: "Average Runtime",
            value: analytics.averageRuntime,
            icon: <Clock3 size={24} />,
            color: "orange",
          },
        ].map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <DashboardChartCard
          title="Execution Trend"
          description="Daily execution volume from recent history."
          icon={<Activity size={24} />}
          empty={!analytics.executionTrend.length}
          emptyText="Run a workflow to start building execution trend data."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.executionTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" stroke="#64748b" />
                <YAxis allowDecimals={false} stroke="#64748b" />
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="executions"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "#2563eb" }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </DashboardChartCard>

        <DashboardChartCard
          title="Execution Status"
          description="Distribution by execution outcome."
          icon={<PieChartIcon size={24} />}
          empty={!analytics.statusDistribution.length}
          emptyText="No execution statuses are available yet."
        >
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics.statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={108}
                  paddingAngle={4}
                >
                  {analytics.statusDistribution.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardChartCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow-xl"
        >
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Executions
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest workflow runs and their current state.
              </p>
            </div>

            <Link
              to="/executions"
              className="flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              View All
              <ArrowRight size={16} />
            </Link>
          </div>

          {hasExecutions ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-sm text-slate-500">
                    <th className="pb-3 font-semibold">Workflow</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Started</th>
                    <th className="pb-3 font-semibold">Runtime</th>
                    <th className="pb-3 text-right font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {analytics.recentExecutions.map((execution, index) => {
                    const status = getStatusStyle(execution.status);

                    return (
                      <motion.tr
                        key={execution.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-slate-100 last:border-0"
                      >
                        <td className="py-4">
                          <p className="font-semibold text-slate-800">
                            {execution.workflow_name || "Workflow"}
                          </p>
                          <p className="mt-1 font-mono text-xs text-slate-500">
                            {execution.workflow}
                          </p>
                        </td>

                        <td className="py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${status.badge}`}
                          >
                            {execution.status}
                          </span>
                        </td>

                        <td className="py-4 text-sm text-slate-500">
                          {formatDateTime(execution.started_at)}
                        </td>

                        <td className="py-4 text-sm font-semibold text-slate-700">
                          {formatRuntime(execution)}
                        </td>

                        <td className="py-4 text-right">
                          <button
                            type="button"
                            onClick={() => navigate(`/executions/${execution.id}`)}
                            className="rounded-xl border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50"
                          >
                            Details
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              icon={<PlayCircle size={32} />}
              title="No executions yet"
              description="Execute a workflow to populate recent runs, charts, and activity."
              action={
                <Link
                  to="/workflows"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Go to Workflows
                  <ArrowRight size={16} />
                </Link>
              }
            />
          )}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-white p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-slate-800">Recent Activity</h2>
          <p className="mt-1 text-sm text-slate-500">
            Status changes from latest executions.
          </p>

          {hasExecutions ? (
            <div className="mt-6 space-y-5">
              {analytics.recentActivity.map((execution, index) => {
                const status = getStatusStyle(execution.status);
                const StatusIcon = status.icon;

                return (
                  <motion.div
                    key={execution.id}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-4"
                  >
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-white"
                      style={{ backgroundColor: status.color }}
                    >
                      <StatusIcon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        {status.label} execution
                      </p>
                      <p className="mt-1 truncate text-sm text-slate-500">
                        {execution.workflow_name || execution.workflow}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {formatDateTime(execution.started_at)}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              icon={<Activity size={32} />}
              title="No activity"
              description="Workflow execution events will appear here."
            />
          )}
        </motion.section>
      </div>

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>
          <p className="mt-2 text-slate-500">Frequently used shortcuts.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              to: "/workflows/create",
              icon: <Plus className="mb-4 text-blue-600" size={32} />,
              title: "Create Workflow",
              description: "Build a new automated workflow.",
            },
            {
              to: "/workflows",
              icon: <Workflow className="mb-4 text-indigo-600" size={32} />,
              title: "View Workflows",
              description: "Manage all workflow automations.",
            },
            {
              to: "/executions",
              icon: <PlayCircle className="mb-4 text-green-600" size={32} />,
              title: "Executions",
              description: "Monitor workflow execution history.",
            },
          ].map((item) => (
            <Link key={item.to} to={item.to}>
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-500"
              >
                {item.icon}
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-500">
                  {item.description}
                </p>
                <div className="mt-5 flex items-center gap-2 font-medium text-blue-600">
                  Open
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>
    </div>
  );
}
