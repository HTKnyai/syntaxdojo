'use client';

import { useEffect, useState } from 'react';
import { formatTime } from '@/lib/utils/calculations';

interface TimerProps {
  startTime: number | null;
  isActive: boolean;
}

export function Timer({ startTime, isActive }: TimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive || !startTime) return;

    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 100);

    return () => clearInterval(interval);
  }, [startTime, isActive]);

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600">経過時間:</span>
      <span className="font-mono text-2xl font-bold text-blue-600">{formatTime(elapsed)}</span>
    </div>
  );
}
