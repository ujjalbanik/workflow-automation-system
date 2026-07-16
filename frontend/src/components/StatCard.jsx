import { motion } from "framer-motion";

export default function StatCard({ title, value, icon, color = "blue" }) {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    green: "from-green-500 to-green-700",
    red: "from-red-500 to-red-700",
    orange: "from-orange-500 to-orange-600",
    purple: "from-purple-500 to-purple-700",
    indigo: "from-indigo-500 to-indigo-700",
  };

  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-slate-500">
            {title}
          </p>

          <motion.h2
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-3 text-4xl font-bold text-slate-800"
          >
            {value}
          </motion.h2>
        </div>

        <div
          className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}
        >
          {icon}
        </div>
      </div>

      <div className={`h-1 w-full bg-gradient-to-r ${colors[color]}`} />
    </motion.div>
  );
}
