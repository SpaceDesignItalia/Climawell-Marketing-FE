import { Spinner } from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Loader() {
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Simula un caricamento (puoi sostituire questo con chiamate API reali)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true); // Inizia l'uscita
      setTimeout(() => setLoading(false), 300); // Nascondi il loader dopo 300ms
    }, 2300); // Ridotto da 2500 a 1500 ms

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <motion.div
          className="fixed top-0 z-50 flex min-h-screen w-full items-center justify-center backdrop-blur-lg backdrop-filter"
          initial={{ opacity: 1 }} // Opacità iniziale
          animate={{ opacity: isExiting ? 0 : 1 }} // Cambia l'opacità in base allo stato di uscita
          transition={{ duration: 0.2 }} // Durata della transizione
        >
          <Spinner size="lg" />
        </motion.div>
      )}
    </>
  );
}
