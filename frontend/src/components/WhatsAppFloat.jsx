import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => (
  <motion.a
    href="https://wa.me/917041783028"
    target="_blank"
    rel="noreferrer"
    data-testid="whatsapp-float-button"
    aria-label="Chat on WhatsApp"
    className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-xl shadow-emerald-500/30"
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 1.4, type: 'spring', stiffness: 200, damping: 14 }}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.92 }}
  >
    <MessageCircle size={24} />
  </motion.a>
);

export default WhatsAppFloat;
