import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function DashboardChartCard({
  title,
  description,
  icon,
  empty,
  emptyText = "No data available yet.",
  children,
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl bg-white p-6 shadow-xl"
    >
      <div className="mb-6 flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-blue-600">
          {icon || <BarChart3 size={24} />}
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>

          {description && (
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </div>

      {empty ? (
        <div className="flex min-h-[280px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <div>
            <BarChart3 className="mx-auto mb-4 text-slate-400" size={42} />
            <p className="font-semibold text-slate-700">{emptyText}</p>
          </div>
        </div>
      ) : (
        children
      )}
    </motion.section>
  );
}
