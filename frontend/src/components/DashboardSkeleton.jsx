import { motion } from "framer-motion";

function SkeletonBlock({ className = "" }) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`}
    />
  );
}

export default function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl bg-white p-8 shadow-xl"
      >
        <SkeletonBlock className="h-10 w-72 max-w-full" />
        <SkeletonBlock className="mt-4 h-5 w-[32rem] max-w-full" />
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <SkeletonBlock className="h-4 w-28" />
            <SkeletonBlock className="mt-5 h-10 w-24" />
            <SkeletonBlock className="mt-6 h-1 w-full" />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <SkeletonBlock className="h-7 w-48" />
          <SkeletonBlock className="mt-6 h-72 w-full" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <SkeletonBlock className="h-7 w-56" />
          <SkeletonBlock className="mx-auto mt-8 h-64 w-64 rounded-full" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <SkeletonBlock className="h-7 w-44" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-16 w-full" />
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-xl">
          <SkeletonBlock className="h-7 w-40" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonBlock key={index} className="h-14 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
