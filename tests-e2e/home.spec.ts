import { expect, test } from "@playwright/test";

test("has title and main heading", async ({ page }) => {
  await page.goto("/");

  // Validar el título del documento (SEO)
  await expect(page).toHaveTitle(/Piano Claro/);

  // Validar que el título principal de la página está presente
  const mainHeading = page.locator("h1", { hasText: "Aprende piano leyendo música" });
  await expect(mainHeading).toBeVisible();

  // Validar que hay un botón de "Comenzar gratis"
  const startButton = page.locator("a", { hasText: "Comenzar gratis" }).first();
  await expect(startButton).toBeVisible();
});
