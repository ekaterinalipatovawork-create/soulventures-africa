# Implementation and verification

## Source and design

Figma file `0WM1APchlt7hbW9ET0zC46`, page `13:2`, main frame `13:3` (Desktop / 1440).

Static compositions preserve the exported node geometry, palette, typography, individual media and SVG assets. `src/design-scenes.json` maps scenes to Figma node IDs; `src/asset-manifest.json` records the 83 original Figma exports. `reference/home-current-figma.tsx` is the inspected design context, not runtime code. `scripts/import-figma.py` regenerates the native CSS and scene components from this reference and the local assets (requires Pillow). It does not fetch replacement photography.

Hotel gallery uses all four photographs from source frame `339:244`: Lemala, Meliá, AndBeyond and Four Seasons. The four separate “First time in Africa” frames are intentionally consolidated into one sequence. Orphan design cards outside their parent sections are not repeated as extra website sections.

Section 09 follows the user's explicit clarification: `gallery-after-map/gallery.html`, rather than the three-image lodge composition currently visible in Figma. It contains six supplied photos and three supplied videos in three tracks. All media remains separate. No Figma frame was modified during implementation.

Videos are the supplied giraffe/elephant clips, the project's dolphin clip and the site's existing `hero-1.mp4` / `hero-2.mp4`. Dolphin footage is transcoded to H.264, 30 fps, 960 px wide for delivery; content is unchanged. All videos are muted, looping, inline and play automatically on approaching the viewport. They pause outside it. Reduced-motion users receive still posters.

Review names, route and year remain the user-approved placeholders from Figma. No fabricated customer identities were added.

## Scroll behavior

- Hotels: four source photos, a changing pair, one new photograph per transition.
- Lodge album: side tracks move up, middle track moves down; smaller amplitude on touch screens.
- First Africa: one pinned section, four synchronized text/photo states. Text fades out before the next text fades in.
- Chronicle: all six source creatives move vertically from bottom to top.
- Photo stories: four individually staged appearances. On mobile each image has its own reversible scroll progress.

GSAP ScrollTrigger uses native page scrolling; there is no wheel/touch cancellation or body scroll lock. Four desktop pins and three album tracks share GSAP's scheduler. Timelines are reverted on media-query changes and unmount. Fonts and loaded images trigger a debounced refresh. Mobile and reduced-motion layouts expose all content without long pinned sequences.

## Checks

`npm run build`: TypeScript and production Vite build.

`npm test`: Google Chrome (Chromium engine) and WebKit browser suites covering forward/reverse progress, four pin lifecycles, vertical film direction, separate photo-story phases, opposite album directions, real muted autoplay, all 83 local asset URLs, source hotel image decoding, fast wheel exit, mobile layout, widths 375/768/1024/1440, resize cleanup, reduced motion, deep links and closing the request dialog with Escape.

Desktop 1440 compositions were also visually inspected against Figma exports, including album heading wrapping, hotel pairs, travel story, chronicle and reviews. Mobile gallery was visually inspected at 390 px.

WebKit is the Safari rendering engine, not the installed Safari application. Tests use Playwright 1.56.1 because its bundled browser supports this computer's macOS 14. Physical trackpad hardware and an actual iPhone were not tested. No measured 60 FPS or Core Web Vitals score is claimed.

The request dialog reuses the existing Bitrix24 form configuration. External form submission was not performed; no test lead was sent. The form has a retry/contact fallback if its external script is unavailable. No live deployment or domain change is included.

## Run

`npm ci`

`npm run dev` (http://127.0.0.1:5190)

`npx playwright install chrome webkit` once before `npm test`.

`npm run build` produces `dist/`; deploy that directory using a static host. Runtime assets are local; temporary Figma export URLs in the reference/manifest are provenance only.
