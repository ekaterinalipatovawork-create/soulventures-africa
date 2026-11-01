import { test, expect, type Page } from "@playwright/test";
async function load(page: Page, path: string) {
  await page.goto(path);
  await page.locator("main section").first().waitFor({ state: "attached" });
  await page.evaluate(async () => {
    await Promise.all([
      document.fonts.load("400 16px Inter", "Путешествие Safari"),
      document.fonts.load("600 24px Inter", "Путешествие Safari"),
      document.fonts.load("700 100px Oswald", "ЛУЧШИЕ ОТЕЛИ"),
      document.fonts.load("500 64px Oswald", "ПАМЯТНЫЕ МГНОВЕНИЯ"),
      document.fonts.load("400 29px Caveat", "Здесь продолжается путешествие"),
    ]);
    await document.fonts.ready;
  });
  await page.waitForTimeout(500);
}
async function snapshot(page: Page) {
  return page.locator("main").evaluate((root) => {
    const rect = (e: Element) => {
      const r = e.getBoundingClientRect();
      return [r.x, r.y + scrollY, r.width, r.height].map(
        (n) => Math.round(n * 10) / 10,
      );
    };
    return {
      text: root.textContent,
      sections: Array.from(root.querySelectorAll("section")).map((e) => ({
        label: e.getAttribute("aria-label"),
        rect: rect(e),
      })),
      nodes: Array.from(root.querySelectorAll("[data-node-id]")).map((e) => ({
        id: e.getAttribute("data-node-id"),
        rect: rect(e),
        font: getComputedStyle(e).font,
      })),
      images: Array.from(root.querySelectorAll("img")).map((e) =>
        (e.getAttribute("src") || "").replace("/assets/heritage/", "/assets/"),
      ),
      videos: Array.from(root.querySelectorAll("video")).map((e) => ({
        src: e.getAttribute("src"),
        poster: e.getAttribute("poster"),
        muted: e.muted,
        loop: e.loop,
        inline: e.playsInline,
      })),
    };
  });
}
test("palette copy: desktop geometry, text and media match while colors are different", async ({
  page,
  context,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page, "/");
  const original = await snapshot(page);
  expect(
    await page
      .locator("#hotels")
      .evaluate((e) => getComputedStyle(e).backgroundColor),
  ).toBe("rgb(89, 181, 238)");
  const copy = await context.newPage();
  await copy.emulateMedia({ reducedMotion: "reduce" });
  await load(copy, "/heritage/");
  expect(await snapshot(copy)).toEqual(original);
  expect(await copy.locator("html").getAttribute("data-palette")).toBe(
    "heritage",
  );
  await expect(copy.locator("#hotels")).toHaveCSS(
    "background-color",
    "rgb(245, 244, 243)",
  );
  await expect(copy.locator(".hotel-cta")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  await expect(copy.locator("#hotels h2")).toHaveCSS(
    "color",
    "rgb(121, 89, 61)",
  );
  await expect(copy.locator("#first-africa")).toHaveCSS(
    "background-color",
    "rgb(121, 89, 61)",
  );
  await expect(copy.locator(".first-title span")).toHaveCSS(
    "color",
    "rgb(255, 255, 255)",
  );
  for (const selector of [".d0077", ".d0091", ".d0322"]) {
    for (const heading of await copy.locator(selector).all()) {
      await expect(heading).toHaveCSS("color", "rgb(255, 255, 255)");
    }
  }
  await expect(copy.locator(".d0134")).toHaveCSS("color", "rgb(174, 49, 23)");
  await copy.locator("#intro img").evaluateAll((es) =>
    Promise.all(
      es.map((e: HTMLImageElement) => {
        e.loading = "eager";
        return e.decode();
      }),
    ),
  );
  await copy.close();
});
test("palette copy: the same scroll timelines and autonomous strip run", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await load(page, "/heritage/");
  await expect(page.locator(".pin-spacer")).toHaveCount(4);
  for (const id of ["hotels", "first-africa", "photo-stories"]) {
    const el = page.locator("#" + id);
    await el.evaluate((e) => {
      const n = e as HTMLElement;
      scrollTo(
        0,
        Number(n.dataset.pinStart) +
          (Number(n.dataset.pinEnd) - Number(n.dataset.pinStart)) * 0.9,
      );
    });
    await expect
      .poll(async () => Number(await el.getAttribute("data-progress")))
      .toBeGreaterThan(0.85);
  }
  await page
    .locator("#floating-africa")
    .evaluate((e) => scrollTo(0, e.getBoundingClientRect().top + scrollY));
  await expect(page.locator("#floating-africa")).toHaveClass(/is-running/);
  const track = page.locator(".floating-africa-track");
  const y = await track.evaluate(
    (e) => new DOMMatrix(getComputedStyle(e).transform).m42,
  );
  await page.waitForTimeout(700);
  expect(
    await track.evaluate(
      (e) => new DOMMatrix(getComputedStyle(e).transform).m42,
    ),
  ).toBeLessThan(y);
  expect(errors).toEqual([]);
});
test("palette copy: mobile layout and content are identical", async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await load(page, "/");
  // Reserve all intrinsic media before comparing document positions.
  await page.locator("img").evaluateAll((es) =>
    Promise.all(
      es.map((e: HTMLImageElement) => {
        e.loading = "eager";
        return e.decode();
      }),
    ),
  );
  const original = await snapshot(page);
  const copy = await context.newPage();
  await copy.setViewportSize({ width: 390, height: 844 });
  await copy.emulateMedia({ reducedMotion: "reduce" });
  await load(copy, "/heritage/");
  await copy.locator("img").evaluateAll((es) =>
    Promise.all(
      es.map((e: HTMLImageElement) => {
        e.loading = "eager";
        return e.decode();
      }),
    ),
  );
  expect(await snapshot(copy)).toEqual(original);
  expect(await copy.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await copy.close();
});
