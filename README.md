# Soul Ventures Africa

Responsive React implementation of the approved Figma Desktop / 1440 homepage.

## Development

`npm install` then `npm run dev`.

`npm run build` creates the production bundle. `npm test` checks scroll interactions and media in Google Chrome and WebKit. Install those browsers with `npx playwright install chrome webkit` first.

The implementation uses the existing React / TypeScript / CSS direction. GSAP ScrollTrigger drives five separate reversible editorial sequences. Assets are local exports from the supplied Figma file and user-provided source media; no generated or stock substitutes.

Figma: https://www.figma.com/design/0WM1APchlt7hbW9ET0zC46/?node-id=13-3

Detailed implementation and verification notes are recorded in `VALIDATION.md`.

## Color-only copy

- Original design: `/`
- Palette from the current Soul Ventures Africa website: `/heritage/`

Both entries render the same React page and media. The second entry selects warm palette variables and recolored decorative SVG files; there are no duplicated photo/video files or alternative layouts. `npm run build` creates both HTML entries in `dist/`.
