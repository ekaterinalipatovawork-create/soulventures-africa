import { test, expect, type Page } from "@playwright/test";
async function phase(page: Page, p: number) {
  const root = page.locator("#lodge-journey");
  await expect(root).toHaveAttribute("data-pin-start");
  await root.evaluate((e, p) => {
    const el = e as HTMLElement;
    scrollTo(
      0,
      Number(el.dataset.pinStart) +
        (Number(el.dataset.pinEnd) - Number(el.dataset.pinStart)) * p,
    );
  }, p);
  await expect
    .poll(async () =>
      Math.abs(Number(await root.getAttribute("data-progress")) - p),
    )
    .toBeLessThan(0.015);
  await page.waitForTimeout(120);
}
test("dolphin film: originals, uninterrupted fullscreen expansion, overlay and reverse", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await expect(
    page.locator('#lodge [data-source-node="339:241"] img'),
  ).toHaveAttribute("src", "/assets/lodge/sunset.webp");
  await expect(
    page.locator('#lodge [data-source-node="339:223"] img'),
  ).toHaveAttribute("src", "/assets/lodge/flamingos.webp");
  await expect(page.locator("#lodge video")).toHaveCount(3);
  await expect(page.locator("#lodge figure")).toHaveCount(9);
  const v = page.locator(".lodge-shot--hero video");
  await phase(page, 0.01);
  await expect
    .poll(() => v.evaluate((e: HTMLVideoElement) => e.readyState))
    .toBeGreaterThanOrEqual(2);
  await v.evaluate((e: HTMLVideoElement) => {
    (window as any).__film = e;
    (window as any).__loads = 0;
    e.addEventListener("loadstart", () => {
      (window as any).__loads++;
    });
  });
  const original = await page.locator(".lodge-shot--hero").boundingBox();
  await phase(page, 0.54);
  const full = await page.locator(".lodge-shot--hero").boundingBox();
  expect(full!.width).toBeCloseTo(1440, 0);
  expect(full!.height).toBeCloseTo(900, 0);
  expect(Math.abs(full!.x)).toBeLessThan(2);
  expect(Math.abs(full!.y)).toBeLessThan(2);
  expect(
    await v.evaluate(
      (e: HTMLVideoElement) =>
        e.muted &&
        e.loop &&
        e.autoplay &&
        e.playsInline &&
        !e.controls &&
        !e.paused,
    ),
  ).toBeTruthy();
  const time = await v.evaluate((e: HTMLVideoElement) => e.currentTime);
  await phase(page, 0.86);
  const next = await page.locator(".lodge-next").boundingBox();
  expect(next!.y).toBeGreaterThan(0);
  expect(next!.y).toBeLessThan(900);
  await page.waitForTimeout(500);
  expect(await v.evaluate((e: HTMLVideoElement) => e.currentTime)).not.toBe(
    time,
  );
  await phase(page, 0.99);
  expect(
    Math.abs((await page.locator(".lodge-next").boundingBox())!.y),
  ).toBeLessThan(2);
  await phase(page, 0.01);
  const back = await page.locator(".lodge-shot--hero").boundingBox();
  expect(back!.width).toBeCloseTo(original!.width, 0);
  expect(
    await v.evaluate(
      (e) => e === (window as any).__film && (window as any).__loads === 0,
    ),
  ).toBeTruthy();
  await phase(page, 0.99);
  await page.mouse.wheel(0, 1200);
  await page.waitForTimeout(300);
  expect(
    await page
      .locator("#first-africa")
      .evaluate((e) => e.getBoundingClientRect().top),
  ).toBeLessThan(900);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    1440,
  );
  expect(errors).toEqual([]);
});
test("mobile and reduced motion retain all nine materials and the next section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator("#lodge-journey")).not.toHaveClass(
    /has-film-transition/,
  );
  await expect(page.locator("#lodge figure")).toHaveCount(9);
  await expect(page.locator("#lodge-journey .pin-spacer")).toHaveCount(0);
  await page.locator(".lodge-shot--hero").scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page
        .locator(".lodge-shot--hero video")
        .evaluate((e: HTMLVideoElement) => !e.paused && e.readyState >= 2),
    )
    .toBeTruthy();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  await expect(page.locator("#lodge-journey")).not.toHaveClass(
    /has-film-transition/,
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.locator(".lodge-next").scrollIntoViewIfNeeded();
  await expect(page.locator(".lodge-next")).toBeInViewport();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(400);
  await expect(page.locator(".pin-spacer")).toHaveCount(4);
});
