import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function CollapsibleSection({
  title,
  description,
  icon,
  actions,
  defaultOpen = true,
  children,
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section className="rounded-3xl bg-white shadow-xl">
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex min-w-0 items-center gap-3 text-left"
        >
          {icon && (
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
              {icon}
            </span>
          )}

          <span className="min-w-0">
            <span className="block text-2xl font-bold text-slate-800">
              {title}
            </span>

            {description && (
              <span className="mt-1 block text-sm text-slate-500">
                {description}
              </span>
            )}
          </span>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="ml-auto rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-hidden="true"
          >
            <ChevronDown size={20} />
          </motion.span>
        </button>

        {actions && (
          <div className="flex flex-wrap gap-3 lg:justify-end">{actions}</div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="p-5 sm:p-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
