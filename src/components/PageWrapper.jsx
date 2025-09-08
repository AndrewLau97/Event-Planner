import { motion } from "framer-motion";
import { useEffect } from "react";

export default function PageWrapper({ children }) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1.5 } }}
      exit={{ opacity: 0, transition: { duration: 0.7 } }}
    >
      {children}
    </motion.div>
  );
}
