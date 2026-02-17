const { test, expect } = require('@playwright/test');

const PAGE_PATH = '/eventswidget/';

test.describe('3SNET events widget constructor', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_PATH, { waitUntil: 'domcontentloaded' });
  });

  test('loads constructor UI and default iframe embed code', async ({ page }) => {
    await expect(page).toHaveTitle(/Конструктор календаря мероприятий/i);
    await expect(
      page.getByRole('heading', {
        name: 'Начните создавать свой календарь мероприятий!',
      }),
    ).toBeVisible();

    const topicSelect = page.locator('select').nth(0);
    const countrySelect = page.locator('select').nth(1);

    await expect(topicSelect).toBeVisible();
    await expect(countrySelect).toBeVisible();
    await expect(topicSelect).toHaveValue('Выбрать тематику');
    await expect(countrySelect).toHaveValue('Все страны');

    const iframeCode = page.locator('#code');
    await expect(iframeCode).toBeVisible();
    await expect(iframeCode).toHaveValue(/<iframe id="3snet-frame"/);
    await expect(iframeCode).toHaveValue(/src="https:\/\/3snet\.info\/widget-active-events\//);
  });

  test('regenerates iframe code when custom width and height are set', async ({ page }) => {
    const fullWidthCheckbox = page.locator('input[name="full-width"]');
    const autoHeightCheckbox = page.locator('input[name="auto-height"]');

    if (await fullWidthCheckbox.isChecked()) {
      await fullWidthCheckbox.uncheck({ force: true });
    }

    if (await autoHeightCheckbox.isChecked()) {
      await autoHeightCheckbox.uncheck({ force: true });
    }

    await page.locator('input[name="width"]').fill('320');
    await page.locator('input[name="height"]').fill('360');

    await page.getByRole('button', { name: 'Сгенерировать превью' }).click();

    const iframeCode = page.locator('#code');
    await expect(iframeCode).toHaveValue(/width="320"/);
    await expect(iframeCode).toHaveValue(/height="360"/);
  });
});
