import { AnimatePresence, motion } from "framer-motion";
import { Activity, CheckCircle2, Clock3, XCircle } from "lucide-react";

const statusStyles = {
  SUCCESS: {
    dot: "bg-green-600",
    badge: "bg-green-100 text-green-700",
    icon: CheckCircle2,
  },
  FAILED: {
    dot: "bg-red-600",
    badge: "bg-red-100 text-red-700",
    icon: XCircle,
  },
  RUNNING: {
    dot: "bg-blue-600",
    badge: "bg-blue-100 text-blue-700",
    icon: Activity,
  },
  PENDING: {
    dot: "bg-slate-400",
    badge: "bg-slate-100 text-slate-600",
    icon: Clock3,
  },
};

const getStatusStyle = (status) => statusStyles[status] || statusStyles.PENDING;

const formatDateTime = (timestamp) => {
  if (!timestamp) return "-";

  return new Date(timestamp).toLocaleString();
};

const formatTimestamp = (event) => {
  const timestamp = event.finished_at || event.started_at;

  if (!timestamp) return "Pending";

  return new Date(timestamp).toLocaleString();
};

export default function ExecutionTimeline({ events = [] }) {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <h2 className="mb-8 text-2xl font-bold text-slate-800">
        Execution Timeline
      </h2>

      {events.length ? (
        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-1 rounded-full bg-slate-200" />

          <div className="space-y-8">
            <AnimatePresence initial={false}>
              {events.map((event, index) => {
                const style = getStatusStyle(event.status);
                const StatusIcon = style.icon;

                return (
                  <motion.div
                    key={event.id || `${event.step_name}-${index}`}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.06 }}
                    className="relative ml-2"
                  >
                    <div
                      className={`absolute left-0 flex h-10 w-10 items-center justify-center rounded-full ${style.dot} text-white shadow-lg`}
                    >
                      <StatusIcon size={18} />
                    </div>

                    <motion.div
                      animate={{
                        borderColor: event.active ? "#60a5fa" : "#e2e8f0",
                        backgroundColor: event.active ? "#eff6ff" : "#f8fafc",
                      }}
                      className="ml-16 rounded-2xl border p-6"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-800">
                            {event.step_name}
                          </h3>

                          <p className="mt-1 text-sm text-blue-600">
                            {event.step_type}
                          </p>
                        </div>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">
                        <div className="rounded-xl bg-white p-3">
                          <p className="font-semibold text-slate-700">
                            Started
                          </p>
                          <p className="mt-1">{formatDateTime(event.started_at)}</p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="font-semibold text-slate-700">
                            Finished
                          </p>
                          <p className="mt-1">{formatDateTime(event.finished_at)}</p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <p className="mb-2 text-xs font-semibold uppercase text-slate-400">
                          Log Message
                        </p>

                        <p className="leading-7 text-slate-600">
                          {event.message || "No log message available."}
                        </p>
                      </div>

                      <p className="mt-3 text-xs font-semibold text-slate-400">
                        Latest update: {formatTimestamp(event)}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
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
  );
}
