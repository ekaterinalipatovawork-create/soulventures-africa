import { test, expect } from "@playwright/test";
test("floating Africa: yacht chronicle removed; original photos move upward with no scroll", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/#floating-africa");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  await expect(page.locator("#chronicle")).toHaveCount(0);
  await expect(page.locator(".chronicle-count")).toHaveCount(0);
  await expect(page.locator("#falling-photos")).toHaveCount(0);
  const block = page.locator("#floating-africa");
  await expect(block).toHaveClass(/is-running/);
  await expect(block.locator("h2")).toHaveText("АФРИКА");
  expect(
    await block.evaluate((e) =>
      e.previousElementSibling?.getAttribute("aria-label"),
    ),
  ).toBe("ClosingScene");
  const originals = block.locator(".floating-africa-group").first();
  await expect(originals.locator("img")).toHaveCount(6);
  expect(
    await originals
      .locator("[data-source-node]")
      .evaluateAll((es) =>
        es.map((e) => e.getAttribute("data-source-node")).sort(),
      ),
  ).toEqual(["342:215", "342:216", "342:217", "342:223", "342:224", "342:238"]);
  await originals.locator("img").evaluateAll((es) =>
    Promise.all(
      es.map((e: HTMLImageElement) => {
        e.loading = "eager";
        return e.decode();
      }),
    ),
  );
  const track = block.locator(".floating-africa-track");
  const y = () =>
    track.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42);
  const scroll = await page.evaluate(() => scrollY);
  const start = await y();
  await page.waitForTimeout(1000);
  expect(await y()).toBeLessThan(start - 5);
  expect(await page.evaluate(() => scrollY)).toBe(scroll);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    1440,
  );
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator("#contacts")).toBeInViewport();
  await page.evaluate(() => scrollTo(0, 0));
  await expect(block).not.toHaveClass(/is-running/);
  expect(errors).toEqual([]);
});
test("floating Africa: mobile loop has no bottom gap and reduced motion exposes six originals", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#floating-africa");
  await page.waitForTimeout(500);
  const track = page.locator(".floating-africa-track");
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  expect(
    await track.evaluate((e) => (e.getBoundingClientRect().height / 3) * 2),
  ).toBeGreaterThan(
    await page
      .locator("#floating-africa")
      .evaluate((e) => e.getBoundingClientRect().height),
  );
  const before = await track.evaluate(
    (e) => new DOMMatrix(getComputedStyle(e).transform).m42,
  );
  await page.waitForTimeout(800);
  expect(
    await track.evaluate(
      (e) => new DOMMatrix(getComputedStyle(e).transform).m42,
    ),
  ).toBeLessThan(before - 3);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(track).toHaveCSS("animation-name", "none");
  await expect(page.locator("#floating-africa img:visible")).toHaveCount(6);
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator("#contacts")).toBeInViewport();
});
