import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

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
    <>
      {/* Welcome Card */}
      <div
        style={{
          background: "#fff",
          padding: 30,
          borderRadius: 16,
          marginBottom: 30,
          boxShadow: "0 5px 20px rgba(0,0,0,.08)",
        }}
      >
        <h1>👋 Welcome back, Admin</h1>

        <p
          style={{
            color: "#666",
            marginTop: 10,
          }}
        >
          Build workflows. Automate tasks. Monitor executions.
        </p>
      </div>

      {/* Statistics */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginBottom: 30,
        }}
      >
        <StatCard title="📋 Workflows" value={stats.total_workflows} />
        <StatCard title="⚙ Executions" value={stats.total_executions} />
        <StatCard title="✅ Success" value={stats.successful_executions} />
        <StatCard title="❌ Failed" value={stats.failed_executions} />
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 20,
          marginTop: 35,
        }}
      >
        <Link to="/workflows/create">
          <button
            style={{
              width: "100%",
              padding: 20,
              cursor: "pointer",
            }}
          >
            ➕ Create Workflow
          </button>
        </Link>

        <Link to="/workflows">
          <button
            style={{
              width: "100%",
              padding: 20,
              cursor: "pointer",
            }}
          >
            📋 View Workflows
          </button>
        </Link>

        <Link to="/executions">
          <button
            style={{
              width: "100%",
              padding: 20,
              cursor: "pointer",
            }}
          >
            ⚙ View Executions
          </button>
        </Link>
      </div>
    </>
  );
}