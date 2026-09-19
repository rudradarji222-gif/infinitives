import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CursorGlow = () => {
  const x = useMotionValue(-500);
  const y = useMotionValue(-500);
  const sx = useSpring(x, { stiffness: 140, damping: 22 });
  const sy = useSpring(y, { stiffness: 140, damping: 22 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX - 180);
      y.set(e.clientY - 180);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      data-testid="cursor-glow"
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[65] hidden h-[22rem] w-[22rem] rounded-full lg:block"
      style={{
        x: sx,
        y: sy,
        background: 'radial-gradient(circle, rgba(233,30,99,0.10) 0%, rgba(56,189,248,0.09) 38%, rgba(245,158,11,0.06) 58%, transparent 72%)',
      }}
    />
  );
};

export default CursorGlow;
