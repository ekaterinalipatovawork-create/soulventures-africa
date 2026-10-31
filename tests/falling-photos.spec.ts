import { test, expect } from "@playwright/test";
test("falling photo spread follows final CTA, uses five source images and reverses", async ({
  page,
}) => {
  await page.goto("/#falling-photos");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const section = page.locator("#falling-photos");
  await expect(section.locator("img")).toHaveCount(5);
  expect(
    await section.evaluate((e) =>
      e.previousElementSibling?.getAttribute("aria-label"),
    ),
  ).toBe("ClosingScene");
  expect(
    await section.evaluate((e) => e.closest("main")?.nextElementSibling?.id),
  ).toBe("contacts");
  const ids = await section
    .locator("[data-source-node]")
    .evaluateAll((es) =>
      es.map((e) => e.getAttribute("data-source-node")).sort(),
    );
  expect(ids).toEqual(["342:228", "342:230", "342:232", "342:233", "342:234"]);
  await section.locator("img").evaluateAll((es) =>
    Promise.all(
      es.map((e: HTMLImageElement) => {
        e.loading = "eager";
        return e.decode();
      }),
    ),
  );
  const row = section.locator(".falling-photo-row").first();
  const portrait = section.locator(".falling-photo-portrait").first();
  const scroll = async (p: number) => {
    await row.evaluate(
      (e, p) =>
        scrollTo(
          0,
          e.getBoundingClientRect().top +
            scrollY -
            innerHeight * 0.48 +
            (e as HTMLElement).offsetHeight * 0.84 * p,
        ),
      p,
    );
    await page.waitForTimeout(250);
  };
  const y = () =>
    portrait.evaluate((e) => new DOMMatrix(getComputedStyle(e).transform).m42);
  await scroll(0);
  const start = await y();
  await scroll(0.8);
  await expect.poll(y).toBeGreaterThan(start + 200);
  await scroll(0);
  await expect.poll(y).toBeLessThan(start + 3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    1440,
  );
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator("#contacts")).toBeInViewport();
});
test("falling photo spread: mobile and reduced motion keep original media accessible", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#falling-photos");
  await expect(page.locator("#falling-photos img")).toHaveCount(5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  expect(
    await page
      .locator(".falling-photo-portrait")
      .evaluateAll((es) =>
        es.every((e) => getComputedStyle(e).transform === "none"),
      ),
  ).toBeTruthy();
  await page.locator("#contacts").scrollIntoViewIfNeeded();
  await expect(page.locator("#contacts")).toBeInViewport();
});
