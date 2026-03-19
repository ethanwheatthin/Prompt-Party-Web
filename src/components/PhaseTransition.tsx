import type { ReactNode } from 'react';

interface PhaseTransitionProps {
  children: ReactNode;
  /** Unique key per phase to trigger the animation */
  phaseKey: string;
}

export function PhaseTransition({ children, phaseKey }: PhaseTransitionProps) {
  return (
    <div key={phaseKey} className="animate-fade-in w-full h-full">
      {children}
    </div>
  );
}
