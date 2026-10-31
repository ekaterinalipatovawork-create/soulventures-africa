import { useEffect, useRef, useState } from "react";
import "./FloatingAfricaSection.css";
import photographs from "./floating-photos.json";
export function FloatingAfricaSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [foreground, setForeground] = useState(!document.hidden);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { threshold: 0 },
    );
    if (ref.current) observer.observe(ref.current);
    const visibility = () => setForeground(!document.hidden);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return (
    <section
      id="floating-africa"
      ref={ref}
      className={
        "floating-africa" + (visible && foreground ? " is-running" : "")
      }
      aria-label="Африка в фотографиях"
    >
      <h2 className="floating-africa-word">АФРИКА</h2>
      <div className="floating-africa-window">
        <div className="floating-africa-track">
          {[0, 1, 2].map((copy) => (
            <div
              key={String(copy)}
              className="floating-africa-group"
              aria-hidden={copy ? true : undefined}
            >
              {photographs.map((photo) => (
                <figure
                  className="floating-africa-photo"
                  key={photo.file}
                  data-source-node={copy ? undefined : photo.node}
                >
                  <img
                    src={"/assets/floating/" + photo.file + ".webp"}
                    alt={copy ? "" : photo.alt}
                    width={photo.width}
                    height={photo.height}
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
