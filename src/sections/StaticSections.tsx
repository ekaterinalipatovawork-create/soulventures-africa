import { DesignFrame } from "../DesignFrame";
import { useViewport } from "../Viewport";
import { LazyVideo } from "../LazyVideo";
import { imgHero1WebmHero1Mp4, imgSoulVenturesAfrica } from "../design/assets";
import { HeroScene } from "../design/HeroScene";
import { AlbumIntroScene } from "../design/AlbumIntroScene";
import { CinematicScene } from "../design/CinematicScene";
import { ElephantScene } from "../design/ElephantScene";
import { AudienceScene } from "../design/AudienceScene";
import { MapScene } from "../design/MapScene";
import { TrustScene } from "../design/TrustScene";
import { FilmScene } from "../design/FilmScene";
import { ReviewsScene } from "../design/ReviewsScene";
import { ClosingScene } from "../design/ClosingScene";
import { FooterScene } from "../design/FooterScene";
export function HeroSection() {
  const { mobile } = useViewport();
  return mobile ? (
    <section id="top" className="mobile-hero">
      <LazyVideo
        src="/assets/video/hero-1.mp4"
        poster={imgHero1WebmHero1Mp4}
        eager
      />
      <div className="mobile-hero-shade" />
      <header>
        <img
          src={imgSoulVenturesAfrica}
          alt="Soul Ventures Africa"
          width="57"
          height="82"
        />
        <button aria-label="Открыть меню">Меню ☰</button>
      </header>
      <h1>
        ЛУЧШЕ ОДИН РАЗ
        <br />
        УВИДЕТЬ АФРИКУ САМОМУ.
      </h1>
      <button className="mobile-hero-cta" data-action="request">
        Подобрать тур
      </button>
    </section>
  ) : (
    <DesignFrame id="top" height={940} name="HeroScene">
      <HeroScene />
    </DesignFrame>
  );
}
export const AlbumIntroSection = () => (
  <DesignFrame id="intro" height={970} name="AlbumIntroScene">
    <AlbumIntroScene />
  </DesignFrame>
);
export const CinematicSection = () => (
  <DesignFrame height={900} name="CinematicScene">
    <CinematicScene />
  </DesignFrame>
);
export const ElephantSection = () => (
  <DesignFrame height={960} name="ElephantScene">
    <ElephantScene />
  </DesignFrame>
);
export const AudienceSection = () => (
  <DesignFrame height={1050} name="AudienceScene">
    <AudienceScene />
  </DesignFrame>
);
export const MapSection = () => (
  <DesignFrame id="routes" height={810.431} name="MapScene">
    <MapScene />
  </DesignFrame>
);
export const TrustSection = () => (
  <DesignFrame height={810} name="TrustScene">
    <TrustScene />
  </DesignFrame>
);
export const FilmSection = () => (
  <DesignFrame height={960} name="FilmScene">
    <FilmScene />
  </DesignFrame>
);
export const ReviewsSection = () => (
  <DesignFrame id="reviews" height={810} name="ReviewsScene">
    <ReviewsScene />
  </DesignFrame>
);
export const ClosingSection = () => (
  <DesignFrame height={650} name="ClosingScene">
    <ClosingScene />
  </DesignFrame>
);
export const FooterSection = () => (
  <DesignFrame id="contacts" height={634} name="FooterScene">
    <FooterScene />
  </DesignFrame>
);
