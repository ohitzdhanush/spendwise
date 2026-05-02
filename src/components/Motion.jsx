import { motion, useReducedMotion } from "framer-motion";
import { riseIn } from "../utils/motion";

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(6px)" },
};

export function MotionPage({ children, className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : pageVariants}
      initial={reduceMotion ? false : "initial"}
      animate="animate"
      exit={reduceMotion ? undefined : "exit"}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function MotionCard({ children, className = "", delay = 0 }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduceMotion ? undefined : riseIn}
      initial={reduceMotion ? false : "initial"}
      animate="animate"
      whileHover={reduceMotion ? undefined : { y: -4, scale: 1.01 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
