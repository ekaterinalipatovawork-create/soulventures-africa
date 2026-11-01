import type { ReactNode, CSSProperties } from "react";
import { useViewport } from "./Viewport";
import mobileContent from "./mobile-content.json";
import * as assets from "./design/assets";
import { LazyVideo } from "./LazyVideo";
export function MobileEditorial({ name }: { name: string }) {
  const data = mobileContent.find((n) => n.component === name);
  if (!data) return null;
  const headingLines = name === "FooterScene" ? 1 : 2;
  const hrefFor = (text: string) => {
    if (/^\+\d/.test(text)) return "tel:" + text;
    if (text === "info@soulventuresafrica.com") return "mailto:" + text;
    return (
      {
        Туры: "https://soulventuresafrica.ru/tours/",
        "О нас": "https://soulventuresafrica.ru/about/",
        Блог: "https://soulventuresafrica.ru/blog/",
        Отзывы: "#reviews",
        Отели: "#hotels",
        "Согласие на обработку персональных данных":
          "https://soulventuresafrica.ru/#popup:doc2",
        "Политика в отношении обработки персональных данных":
          "https://soulventuresafrica.ru/#popup:doc1",
        "Согласие на новостную и рекламную рассылку":
          "https://soulventuresafrica.ru/#popup:doc3",
      } as Record<string, string>
    )[text];
  };
  return (
    <div className={"mobile-editorial mobile-" + name}>
      <h2>{data.paragraphs.slice(0, headingLines).join(" ")}</h2>
      {data.photos.map((p, i) =>
        p === "imgAutoplayMutedLoopPlaysinline" ||
        p === "imgPreviewHero2Mp40010500ExactFrame" ? (
          <figure key={p} className="mobile-video">
            <LazyVideo
              src={
                p === "imgAutoplayMutedLoopPlaysinline"
                  ? "/assets/video/dolphins.mp4"
                  : "/assets/video/hero-2.mp4"
              }
              poster={(assets as Record<string, string>)[p]}
            />
          </figure>
        ) : (
          <img
            key={p}
            loading="lazy"
            decoding="async"
            src={(assets as Record<string, string>)[p]}
            alt={data.paragraphs[i + 2] || "Soul Ventures Africa — путешествие"}
          />
        ),
      )}
      <div className="mobile-copy">
        {data.paragraphs.slice(headingLines).map((p, i) =>
          /Подобрать|СОБРАТЬ МОЙ|Создать свой маршрут|Обсудить путешествие|Начать путешествие|Оставить заявку/i.test(
            p,
          ) ? (
            <button key={i} data-action="request">
              {p}
            </button>
          ) : (
            <p key={i}>{hrefFor(p) ? <a href={hrefFor(p)}>{p}</a> : p}</p>
          ),
        )}
      </div>
    </div>
  );
}
export function DesignFrame({
  children,
  height,
  name,
  id,
  className = "",
}: {
  children: ReactNode;
  height: number;
  name: string;
  id?: string;
  className?: string;
}) {
  const { scale, mobile } = useViewport();
  return (
    <section
      id={id}
      className={"design-frame " + className}
      aria-label={name}
      style={
        {
          "--scale": scale,
          "--scene-height": height,
          height: mobile ? "auto" : height * scale,
        } as CSSProperties
      }
    >
      {mobile ? (
        <MobileEditorial name={name} />
      ) : (
        <div
          className="design-canvas"
          style={{ height, transform: `scale(${scale})` }}
        >
          {children}
        </div>
      )}
    </section>
  );
}
