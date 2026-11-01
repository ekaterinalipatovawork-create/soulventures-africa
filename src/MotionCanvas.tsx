import type { ReactNode, CSSProperties } from "react";
import { useViewport } from "./Viewport";
export function MotionCanvas({
  children,
  height = 810,
}: {
  children: ReactNode;
  height?: number;
}) {
  const { width, height: viewportHeight } = useViewport();
  const scale = Math.min(width / 1440, viewportHeight / height);
  return (
    <div
      className="motion-canvas"
      style={
        {
          width: 1440,
          height,
          transform: `translate(-50%,-50%) scale(${scale})`,
          "--motion-scale": scale,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
