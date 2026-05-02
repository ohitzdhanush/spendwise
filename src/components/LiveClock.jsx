import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaClock } from "react-icons/fa6";

export default function LiveClock({ compact = false }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dateText = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        weekday: compact ? "short" : "long",
        day: "2-digit",
        month: compact ? "short" : "long",
        year: "numeric",
      }).format(now),
    [compact, now]
  );

  const timeText = useMemo(
    () =>
      new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: compact ? undefined : "2-digit",
        hour12: true,
      }).format(now),
    [compact, now]
  );

  return (
    <motion.div
      className={`flex items-center gap-3 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 shadow-sm backdrop-blur ${
        compact ? "text-xs" : "text-sm"
      }`}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <span className="pulse-ring grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
        <FaClock className="h-4 w-4" />
      </span>
      <span className="min-w-0">
        <span className="block truncate font-bold text-slate-950">{timeText}</span>
        <span className="block truncate text-slate-500">{dateText}</span>
      </span>
    </motion.div>
  );
}
