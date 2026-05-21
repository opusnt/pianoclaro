"use client";

import { useCallback, useRef } from "react";

export function useMetronome() {
  const animationFrameRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  const stopMetronome = useCallback(() => {
    isRunningRef.current = false;

    if (!animationFrameRef.current) {
      return;
    }

    window.cancelAnimationFrame(animationFrameRef.current);
    animationFrameRef.current = null;
  }, []);

  const startMetronome = useCallback(
    (onFrame: () => void) => {
      stopMetronome();
      isRunningRef.current = true;

      function tick() {
        if (!isRunningRef.current) {
          return;
        }

        onFrame();

        if (!isRunningRef.current) {
          return;
        }

        animationFrameRef.current = window.requestAnimationFrame(tick);
      }

      animationFrameRef.current = window.requestAnimationFrame(tick);
    },
    [stopMetronome],
  );

  return {
    startMetronome,
    stopMetronome,
  };
}
