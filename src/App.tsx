import { UI } from "./UI";
import {
  HeroSection,
  AlbumIntroSection,
  CinematicSection,
  ElephantSection,
  AudienceSection,
  MapSection,
  TrustSection,
  FilmSection,
  ReviewsSection,
  ClosingSection,
  FooterSection,
} from "./sections/StaticSections";
import { LodgeAlbumSection } from "./sections/LodgeAlbumSection";
import { FirstTimeAfricaSection } from "./sections/FirstTimeAfricaSection";
import { PhotoChronicleSection } from "./sections/PhotoChronicleSection";
import { PhotoStoriesSection } from "./sections/PhotoStoriesSection";
import { HotelGallerySection } from "./sections/HotelGallerySection";
import { FallingPhotosSection } from "./sections/FallingPhotosSection";
import { useMediaRefresh } from "./animation/useScrollScene";
export function App() {
  useMediaRefresh();
  return (
    <>
      <a className="skip" href="#intro">
        К содержанию
      </a>
      <main>
        <HeroSection />
        <AlbumIntroSection />
        <CinematicSection />
        <ElephantSection />
        <HotelGallerySection />
        <AudienceSection />
        <MapSection />
        <LodgeAlbumSection>
          <TrustSection />
        </LodgeAlbumSection>
        <FirstTimeAfricaSection />
        <PhotoChronicleSection />
        <FilmSection />
        <PhotoStoriesSection />
        <ReviewsSection />
        <ClosingSection />
        <FallingPhotosSection />
      </main>
      <FooterSection />
      <UI />
    </>
  );
}
