import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'

type MotionComponent = React.ComponentType<HTMLMotionProps<any>>

interface ClientMotionComponentsProps {
  children: (components: {
    MotionDiv: MotionComponent;
    MotionH2: MotionComponent;
    MotionP: MotionComponent;
    MotionButton: MotionComponent;
  }) => React.ReactNode;
}

const ClientMotionComponents: React.FC<ClientMotionComponentsProps> = ({ children }) => {
  return children({
    MotionDiv: motion.div,
    MotionH2: motion.h2,
    MotionP: motion.p,
    MotionButton: motion.button
  });
};

export default ClientMotionComponents;