import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Workflow,
  PlusCircle,
  PlayCircle,
  Sparkles,
} from "lucide-react";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Workflows",
    path: "/workflows",
    icon: Workflow,
  },
  {
    name: "Create Workflow",
    path: "/workflows/create",
    icon: PlusCircle,
  },
  {
    name: "Executions",
    path: "/executions",
    icon: PlayCircle,
  },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl">
      {/* Logo */}

      <div className="border-b border-slate-800 p-8">
        <motion.div
          whileHover={{
            rotate: -5,
            scale: 1.05,
          }}
          className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg"
        >
          <Sparkles size={28} />
        </motion.div>

        <h1 className="text-2xl font-bold">Workflow</h1>

        <p className="mt-1 text-sm text-slate-400">Automation Platform</p>
      </div>

      {/* Navigation */}

      <nav className="flex-1 space-y-2 p-5">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `group flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon
                      size={20}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-400 group-hover:text-blue-400"
                      }
                    />
                  </motion.div>

                  <span className="font-medium">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}

      <div className="border-t border-slate-800 p-6">
        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-sm font-semibold">Workflow Automation</p>

          <p className="mt-1 text-xs text-slate-400">
            Build • Execute • Monitor
          </p>
        </div>
      </div>
    </aside>
  );
}
