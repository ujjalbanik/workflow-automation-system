import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Workflow,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowRight,
} from "lucide-react";

import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../services/execution";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const data = await getDashboardStats();
    setStats(data);
  };

  if (!stats) return <Loader />;

  return (
    <div className="space-y-8">
      {/* Hero */}

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-10 text-white shadow-2xl"
      >
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div>
            <h1 className="text-4xl font-bold">Welcome Back 👋</h1>

            <p className="mt-3 max-w-xl text-blue-100">
              Manage workflows, automate business processes, monitor executions
              and keep everything running from one dashboard.
            </p>
          </div>

          <motion.div
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 3,
            }}
            className="hidden lg:block"
          >
            <Workflow size={120} className="text-white/20" />
          </motion.div>
        </div>
      </motion.div>

      {/* Stats */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Workflows"
            value={stats.total_workflows}
            icon={<Workflow size={24} />}
            color="blue"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Executions"
            value={stats.total_executions}
            icon={<PlayCircle size={24} />}
            color="purple"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Successful"
            value={stats.successful_executions}
            icon={<CheckCircle2 size={24} />}
            color="green"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="Failed"
            value={stats.failed_executions}
            icon={<XCircle size={24} />}
            color="red"
          />
        </motion.div>
      </div>

      {/* Quick Actions */}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Quick Actions</h2>

          <p className="mt-2 text-slate-500">Frequently used shortcuts.</p>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <Link to="/workflows/create">
            <motion.div
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-500"
            >
              <Plus className="mb-4 text-blue-600" size={32} />

              <h3 className="text-lg font-semibold">Create Workflow</h3>

              <p className="mt-2 text-sm text-slate-500">
                Build a new automated workflow.
              </p>

              <div className="mt-5 flex items-center gap-2 font-medium text-blue-600">
                Open
                <ArrowRight size={16} />
              </div>
            </motion.div>
          </Link>

          <Link to="/workflows">
            <motion.div
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-500"
            >
              <Workflow className="mb-4 text-indigo-600" size={32} />

              <h3 className="text-lg font-semibold">View Workflows</h3>

              <p className="mt-2 text-sm text-slate-500">
                Manage all your workflow automations.
              </p>

              <div className="mt-5 flex items-center gap-2 font-medium text-blue-600">
                Open
                <ArrowRight size={16} />
              </div>
            </motion.div>
          </Link>

          <Link to="/executions">
            <motion.div
              whileHover={{
                y: -5,
                scale: 1.02,
              }}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-slate-50 p-6 transition hover:border-blue-500"
            >
              <PlayCircle className="mb-4 text-green-600" size={32} />

              <h3 className="text-lg font-semibold">Executions</h3>

              <p className="mt-2 text-sm text-slate-500">
                Monitor workflow execution history.
              </p>

              <div className="mt-5 flex items-center gap-2 font-medium text-blue-600">
                Open
                <ArrowRight size={16} />
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
