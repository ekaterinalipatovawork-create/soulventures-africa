# Implementation and verification

## Current page and sources

React / TypeScript homepage from Figma file `0WM1APchlt7hbW9ET0zC46`, page `13:2`, main frame `13:3` (Desktop / 1440). Existing static compositions preserve exported geometry, typography, separate photographs and SVG assets. `src/asset-manifest.json` records the original 83 exports, and `reference/home-current-figma.tsx` preserves the inspected design context. `scripts/import-figma.py` can regenerate those original scenes with Pillow and the local assets; it does not replace the later interactive sections.

- Hotels: eight selected photos from source frame `339:244`. The user removed the sunset/tree AndBeyond photo (`339:249`) and the pool/elephants Four Seasons photo (`339:251`). Node IDs and dimensions are in `hotel-photos.ts`; sources are in `reference/hotel-source-additions.json`.
- Lodge album: six photos and three real videos in three tracks. The sunset is the exact Figma export `339:241`; flamingos are `339:223`. The middle video is the supplied `dji_export_20251225_221113_1766689873271_editor.MP4`, optimized to 1080×1920 H.264, 30 fps, approximately 6.8 MB, without removing footage or changing colors. Its poster is from second 2 of that clip. See `reference/lodge-media-update.json`.
- First Africa: four native Figma states consolidated into one text/photo sequence.
- Reviews: user-approved identity/route/year placeholders retained; no fabricated customer names.
- Final photo block: six exact exports from `342:212`, labelled `342:213`, “01 / Главная / Путешествие в Африку подарит вам лучшие впечатления”. Source mapping and full dimensions are in `floating-photos.json` and `reference/floating-africa-source.json`.

At the user's request, the yacht photo chronicle (`#chronicle`, including 01 / 06 and the progress line) is no longer rendered. The previous Grouptours falling-photo spread is also replaced, rather than appended as another adjacent gallery. Their source files remain available; no Figma nodes were deleted or modified.

Runtime assets are local. Temporary Figma download URLs are provenance only. No new photography was generated and no reference-site photographs were reused.

## Current motion

Four desktop pins: hotels, dolphin expansion, First Africa and photo stories. GSAP ScrollTrigger follows native page progress with reversible timelines and cleanup on media-query changes; no wheel or touch cancellation and no permanent page scroll lock.

- Hotels: each new photo rises over the previous print with a slight alternating tilt.
- Lodge: side lanes move up and the middle lane down. The same dolphin video element expands into the viewport, then the unchanged trust block rises over it. No clone, seek, reparenting or media replacement occurs during this transition. Mobile keeps all nine materials in normal flow with a small unpinned emphasis; reduced motion removes pinning and scaling.
- First Africa: four synchronized text/photo states with separate text fades.
- Photo stories: individual sequential appearances; mobile has individual scroll progress.
- Floating Africa: one vertical strip shifted to the right over a large cream “АФРИКА”, with an opaque sky-blue/turquoise background gradient. Photos are fully opaque; the temporary edge fade has been removed at the user’s request. CSS animation moves the photos upward continuously without scrolling. Three identical tracks provide a seamless loop even on tall narrow screens; only the first copy is exposed to accessibility tools. Explicit intrinsic image sizes stabilize the loop before loading. IntersectionObserver and page visibility pause it offscreen or in a background tab. Reduced motion shows six originals in a static strip. This section follows the final CTA and precedes the footer; it has no pin, scroll counter or progress bar.

Other videos use the existing source hero clips and supplied giraffe/elephant footage. They are muted, inline, looping, have real posters and load near the viewport. External source footage is never substituted with a random still.

## Verification

`npm run build`: TypeScript and Vite production bundle.

`npm test`: browser checks for reversible pin lifecycles, hotel stacking, opposing lanes, silent autoplay, continuous dolphin playback and DOM identity, fullscreen geometry, overlay/reverse/release, all original asset URLs, media decoding, mobile widths, resize cleanup, reduced motion, deep links, dialog dismissal, removal of the yacht chronicle and autonomous photo movement while scrollY remains unchanged. The floating-loop test also checks sufficient content height on mobile and static original content under reduced motion.

Browser projects use installed Google Chrome and Playwright WebKit with Playwright 1.56.1, compatible with this computer's macOS 14. WebKit is the Safari engine; the installed Safari application, physical trackpad and physical iPhone were not separately tested. No measured FPS or Core Web Vitals score is claimed.

The request dialog reuses the existing Bitrix24 configuration, with retry/contact fallback. No real lead was submitted. No public deployment or domain change was performed.

## Run

`npm ci`

`npm run dev` — http://127.0.0.1:5190

`npx playwright install chrome webkit` before the first `npm test`.

`npm run build` creates `dist/` for a static host.

## Separate warm palette copy

`/heritage/` is a separate HTML entry using the exact same React components, typography, text, photos, videos and animation code as `/`. Its palette was sampled from the live `https://soulventuresafrica.ru/`: paper `#F5F4F3`, primary brown `#79593D`, terracotta `#AE3117`, body gray `#605E5E`, secondary brown `#815F41` and soft paper `#F7F5F3`. Background and foreground tokens are separate so white text becomes brown where a former blue surface becomes light paper.

`src/palettes.css` preserves every original default color and selects only color values under `html[data-palette="heritage"]`. The default values of 4,071 existing CSS declarations were resolved and compared with the previous version: no differences. The original SVG files are untouched; 36 palette variants have identical non-color content, paths and dimensions. Photos and videos are shared byte-for-byte, with no filters or new color correction. `reference/heritage-palette.json` records the mapping; `scripts/create-heritage-palette.py` builds the themed assets and variables.

Six additional checks passed in Google Chrome and WebKit: desktop and mobile node geometry/font/text/media equality, exact target colors, local SVG loading, the same pin sequences and autonomous photo motion. Both HTML entries build together. The original `/` entry remains in its original palette. Figma was not modified.
