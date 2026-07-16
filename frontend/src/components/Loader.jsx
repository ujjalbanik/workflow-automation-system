import { motion } from "framer-motion";
import { Workflow } from "lucide-react";

export default function Loader() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center">
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "linear",
        }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-600 shadow-2xl"
      >
        <Workflow className="text-white" size={36} />
      </motion.div>

      <motion.h2
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
        }}
        className="text-2xl font-bold text-slate-700"
      >
        Loading...
      </motion.h2>

      <p className="mt-2 text-slate-500">
        Please wait while we prepare your data.
      </p>

      <div className="mt-8 flex gap-2">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.6,
              delay: i * 0.15,
            }}
            className="h-3 w-3 rounded-full bg-blue-600"
          />
        ))}
      </div>
    </div>
  );
}
