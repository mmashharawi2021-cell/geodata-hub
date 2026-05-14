import type { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
}

export function AnimatedPage({ children, className }: AnimatedPageProps) {
  return (
    <motion.section
      animate={{ opacity: 1, y: 0 }}
      className={className}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.section>
  );
}
