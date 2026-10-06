import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
});

test("all varieties, weights and botanical atmospheres are explorable", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const shop = page.locator("#medus");
  await shop.scrollIntoViewIfNeeded();
  const varieties = ["Pļavu ziedu", "Liepu", "Griķu", "Krēmveida"];
  for (let i = 0; i < varieties.length; i++) {
    await expect(shop.getByRole("heading", { level: 3 })).toContainText(
      varieties[i],
    );
    if (i < varieties.length - 1)
      await shop.getByRole("button", { name: "Nākamais medus" }).click();
  }
  await shop.getByRole("button", { name: "1 kg", exact: true }).click();
  await expect(shop.locator(".product-price")).toContainText("14,40");
  await expect(shop.locator(".jar-object")).toContainText("1 kg");
  const width = await page.evaluate(() => ({
    content: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  expect(width.content).toBeLessThanOrEqual(width.viewport);
  expect(errors).toEqual([]);
});

test("product detail and receipt agree on quantities, weights and prices", async ({
  page,
}) => {
  await page.locator("#medus .product-open").click();
  const detail = page.getByRole("dialog");
  await expect(detail.getByRole("heading", { level: 2 })).toContainText(
    "Pļavu ziedu",
  );
  await detail.getByRole("button", { name: "1 kg", exact: true }).click();
  await detail
    .getByRole("button", { name: "Palielināt daudzumu", exact: true })
    .click();
  await expect(detail.locator(".detail-price")).toContainText("27,00");
  await detail.getByRole("button", { name: "Pievienot grozam" }).click();
  const receipt = page.getByRole("dialog");
  await expect(receipt.locator(".receipt-total")).toContainText("27,00");
  await expect(receipt.locator(".receipt-item-copy")).toContainText("1 kg");
  await expect(
    receipt.getByRole("button", { name: "Noformēt pasūtījumu" }),
  ).toBeDisabled();
  await receipt
    .getByRole("button", { name: "Samazināt: Pļavu ziedu, 1000 g" })
    .click();
  await expect(receipt.locator(".receipt-total")).toContainText("13,50");
  await receipt
    .getByRole("button", { name: "Izņemt: Pļavu ziedu, 1000 g" })
    .click();
  await expect(receipt.getByText("Pagaidām te ir klusums.")).toBeVisible();
  await expect(receipt.locator(".receipt-total")).toContainText("0,00");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".page-shell")).not.toHaveAttribute("inert", "");
});

test("hive cells and the seasonal instrument respond to selection and keyboard", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Izpētīt: Vasks", exact: true })
    .click();
  await expect(page.locator(".comb-description h3")).toHaveText(
    "Sešas malas. Viena kārtība.",
  );
  await page.getByRole("button", { name: "JŪL", exact: true }).click();
  await expect(page.locator(".season-note h3")).toHaveText("Liepas dūc.");
  const dial = page.getByRole("slider", { name: "Izvēlēties mēnesi" });
  await dial.focus();
  await page.keyboard.press("ArrowRight");
  await expect(dial).toHaveAttribute("aria-valuetext", "Augusts");
  await expect(page.locator(".season-note h3")).toHaveText(
    "Vasara kļūst dziļāka.",
  );
  await page.keyboard.press("Home");
  await expect(dial).toHaveAttribute("aria-valuetext", "Aprīlis");
});

test("menu and receipt contain focus and restore page interaction", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Atvērt izvēlni" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Aizvērt", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByRole("link", { name: "05 Kontakti" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Aizvērt", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Atvērt izvēlni" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Atvērt grozu, 0 burciņas" }).click();
  await expect(
    page.getByRole("dialog").getByText("Pagaidām te ir klusums."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Aizvērt", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("reduced motion retains the complete shopping experience", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  await page
    .locator("#medus")
    .getByRole("button", { name: "Pievienot grozam" })
    .click();
  await expect(
    page.getByRole("dialog").locator(".receipt-item-copy"),
  ).toContainText("Pļavu ziedu medus");
  await expect(
    page.getByRole("dialog").locator(".receipt-total"),
  ).toContainText("7,50");
  const duration = await page
    .locator(".receipt")
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(duration).toBe("0s");
});

test("a real touch swipe changes the jar without opening a detail modal", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "Touch-specific mobile interpretation");
  await page.locator("#medus").scrollIntoViewIfNeeded();
  await page.locator(".product-object").scrollIntoViewIfNeeded();
  const bounds = await page.locator(".product-object").boundingBox();
  if (!bounds) throw new Error("Product stage is missing");
  const session = await page.context().newCDPSession(page);
  const x = bounds.x + bounds.width * 0.75,
    y = bounds.y + bounds.height * 0.5;
  await session.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x, y }],
  });
  for (let i = 1; i <= 8; i++) {
    await session.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - i * 19, y: y + i }],
    });
  }
  await session.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator("#medus h3")).toContainText("Liepu");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});
