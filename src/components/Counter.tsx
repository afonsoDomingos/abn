'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

export default function Counter({ value }: { value: string }) {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = useState('0');
  
  // Extract number and suffix (e.g., "150+" -> { num: 150, suffix: "+" })
  const match = value.match(/(\d+\.?\d*)(.*)/);
  const targetNum = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : '';

  const rounded = useTransform(count, (latest) => {
    if (targetNum % 1 === 0) return Math.round(latest);
    return latest.toFixed(1);
  });

  useEffect(() => {
    const animation = animate(count, targetNum, { duration: 2, ease: "easeOut" });
    return animation.stop;
  }, [targetNum]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      setDisplayValue(`${latest}${suffix}`);
    });
  }, [rounded, suffix]);

  return <span>{displayValue}</span>;
}
