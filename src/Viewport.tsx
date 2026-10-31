import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
const ViewportContext = createContext({
  width: 1440,
  height: 900,
  scale: 1,
  mobile: false,
});
export function Viewport({ children }: { children: ReactNode }) {
  const [viewport, setViewport] = useState(() => ({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: window.innerWidth / 1440,
    mobile: window.innerWidth < 768,
  }));
  useLayoutEffect(() => {
    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() =>
        setViewport({
          width: innerWidth,
          height: innerHeight,
          scale: innerWidth / 1440,
          mobile: innerWidth < 768,
        }),
      );
    };
    addEventListener("resize", resize);
    return () => {
      removeEventListener("resize", resize);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <ViewportContext value={viewport}>{children}</ViewportContext>;
}
export const useViewport = () => useContext(ViewportContext);
