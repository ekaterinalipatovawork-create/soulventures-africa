import { readFileSync } from "node:fs";
import { test, expect, type Page } from "@playwright/test";
async function ready(page: Page) {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
}
async function phase(page: Page, id: string, progress: number) {
  const locator = page.locator("#" + id);
  await expect(locator).toHaveAttribute("data-pin-start");
  await locator.evaluate((el, p) => {
    const e = el as HTMLElement;
    window.scrollTo(
      0,
      Number(e.dataset.pinStart) +
        (Number(e.dataset.pinEnd) - Number(e.dataset.pinStart)) * p,
    );
  }, progress);
  await page.waitForTimeout(250);
  await expect
    .poll(async () => {
      const actual = Number(await locator.getAttribute("data-progress"));
      if (Math.abs(actual - progress) > 0.02) {
        await locator.evaluate((el, p) => {
          const e = el as HTMLElement;
          scrollTo(
            0,
            Number(e.dataset.pinStart) +
              (Number(e.dataset.pinEnd) - Number(e.dataset.pinStart)) * p,
          );
        }, progress);
      }
      return Math.abs(actual - progress);
    })
    .toBeLessThan(0.02);
}
async function alphas(page: Page, selector: string) {
  return page
    .locator(selector)
    .evaluateAll((els) =>
      els.map((el) => Number(getComputedStyle(el).opacity)),
    );
}
test("desktop: reversible pinned sequences, vertical film and staggered stories", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await ready(page);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    1440,
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(4);
  for (const id of ["hotels", "first-africa", "chronicle", "photo-stories"]) {
    await phase(page, id, 0.05);
    await phase(page, id, 0.95);
    await phase(page, id, 0.05);
    expect(
      Number(await page.locator("#" + id).getAttribute("data-progress")),
    ).toBeLessThan(0.07);
  }
  await phase(page, "chronicle", 0.05);
  const initial = await page
    .locator(".vertical-film")
    .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42);
  await phase(page, "chronicle", 0.8);
  expect(
    await page
      .locator(".vertical-film")
      .evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
  ).toBeLessThan(initial - 1000);
  await phase(page, "first-africa", 0.1);
  let a = await alphas(page, ".first-step-copy");
  expect(a[0]).toBeGreaterThan(0.9);
  expect(a[1]).toBeLessThan(0.1);
  await phase(page, "first-africa", 0.95);
  a = await alphas(page, ".first-step-copy");
  expect(a[3]).toBeGreaterThan(0.9);
  expect(a[0]).toBeLessThan(0.1);
  await phase(page, "photo-stories", 0.22);
  const selectors = ["255:3", "255:7", "255:11", "255:15"].map(
    (id) => '#photo-stories [data-node-id="' + id + '"]',
  );
  expect(
    (await alphas(page, selectors.join(","))).filter((n) => n > 0.9),
  ).toHaveLength(1);
  await phase(page, "photo-stories", 0.98);
  expect(
    (await alphas(page, selectors.join(","))).filter((n) => n > 0.9),
  ).toHaveLength(4);
  await page.mouse.wheel(0, 50000);
  await page.waitForTimeout(700);
  await expect(page.locator("#contacts")).toBeInViewport();
  expect(errors).toEqual([]);
});
test("album: three opposite tracks and real silent autoplay video", async ({
  page,
}) => {
  await ready(page);
  const section = page.locator("#lodge");
  await section.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY),
  );
  await page.waitForTimeout(700);
  await section.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY),
  );
  await page.waitForTimeout(250);
  const getY = () =>
    page
      .locator(".lodge-lane")
      .evaluateAll((els) =>
        els.map((el) => new DOMMatrix(getComputedStyle(el).transform).m42),
      );
  const first = await getY();
  await page.mouse.wheel(0, 400);
  await page.waitForTimeout(500);
  const next = await getY();
  expect(next[0]).toBeLessThan(first[0]);
  expect(next[1]).toBeGreaterThan(first[1]);
  expect(next[2]).toBeLessThan(first[2]);
  const video = page.locator("#lodge video").first();
  await video.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 150),
  );
  await page.waitForTimeout(500);
  await video.evaluate((el) =>
    scrollTo(0, el.getBoundingClientRect().top + scrollY - 150),
  );
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => v.readyState))
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused))
    .toBeTruthy();
  expect(
    await video.evaluate(
      (v: HTMLVideoElement) => v.muted && v.loop && v.autoplay && v.playsInline,
    ),
  ).toBeTruthy();
  const t = await video.evaluate((v: HTMLVideoElement) => v.currentTime);
  await page.waitForTimeout(700);
  expect(await video.evaluate((v: HTMLVideoElement) => v.currentTime)).not.toBe(
    t,
  );
  await expect(page.locator("#lodge figure")).toHaveCount(9);
});
test("mobile and reduced motion: content stays accessible without pin traps", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await ready(page);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    375,
  );
  await expect(page.locator(".chronicle-shot")).toHaveCount(6);
  await expect(page.locator(".first-step")).toHaveCount(4);
  await page.locator('[data-action="request"]').first().click();
  await expect(page.locator("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(500);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  for (const width of [768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  }
  await page.goto("/#chronicle");
  await expect(page.locator("#chronicle")).toBeInViewport();
});

test("source assets exist locally and deep-link resize restores pinned state", async ({
  page,
  request,
}) => {
  const manifest = JSON.parse(
    readFileSync(
      new URL("../src/asset-manifest.json", import.meta.url),
      "utf8",
    ),
  );
  for (const asset of manifest) {
    const response = await request.get(asset.file);
    expect(response.status(), asset.file).toBe(200);
    expect(Number(response.headers()["content-length"])).toBeGreaterThan(0);
  }
  await page.goto("/#chronicle");
  await page.waitForTimeout(700);
  await expect(page.locator("#chronicle .pin-stage")).toBeInViewport();
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.waitForTimeout(300);
  await expect(page.locator(".pin-spacer")).toHaveCount(4);
  await phase(page, "hotels", 0.5);
  await expect(page.locator("#hotels img")).toHaveCount(10);
  await page.locator("#hotels img").evaluateAll((images) =>
    Promise.all(
      images.map((image: HTMLImageElement) => {
        image.loading = "eager";
        return image.decode();
      }),
    ),
  );
  expect(
    await page
      .locator("#hotels img")
      .evaluateAll((els) =>
        els.every((e: HTMLImageElement) => e.naturalWidth > 0),
      ),
  ).toBeTruthy();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(300);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  await expect(page.locator(".pin-spacer")).toHaveCount(4);
});

test("hotels: all ten Figma photos rise vertically over the previous photograph", async ({
  page,
}) => {
  await ready(page);
  const photos = page.locator("#hotels .hotel-film-card");
  await expect(photos).toHaveCount(10);
  await expect(
    page.locator('#hotels [data-source-node="I91:321;92:317"]'),
  ).toHaveCount(1);
  await phase(page, "hotels", 0.06);
  const position = (index: number) =>
    photos.nth(index).evaluate((el) => {
      const m = new DOMMatrix(getComputedStyle(el).transform);
      return { x: m.m41, y: m.m42, z: Number(getComputedStyle(el).zIndex) };
    });
  const incoming = await position(1);
  await phase(page, "hotels", 0.1);
  const overlapping = await position(1);
  expect(overlapping.y).toBeLessThan(incoming.y - 200);
  expect(Math.abs(overlapping.x - incoming.x)).toBeLessThan(1);
  expect(overlapping.z).toBeGreaterThan((await position(0)).z);
  expect((await position(0)).x).toBeGreaterThan(440);
  await phase(page, "hotels", 0.98);
  expect((await position(9)).y).toBeLessThan(300);
  await phase(page, "hotels", 0.01);
  expect((await position(1)).y).toBeGreaterThan(1000);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".hotel-gallery")).toHaveClass(/is-static/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await expect(page.locator("#hotels img")).toHaveCount(10);
});
