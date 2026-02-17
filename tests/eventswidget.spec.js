const { test, expect } = require('@playwright/test');
const { EventWidgetPage } = require('../pages/EventWidgetPage');
const { eventsWidgetData } = require('../fixtures/eventswidget.data');

test.describe('3SNET events widget constructor', () => {
  test('loads constructor UI and default iframe embed code', async ({ page }) => {
    const eventWidgetPage = new EventWidgetPage(page);

    await eventWidgetPage.open();
    await expect(page).toHaveTitle(eventsWidgetData.expectedTitlePattern);
    await expect(eventWidgetPage.heading).toBeVisible();
    await expect(eventWidgetPage.topicSelect).toBeVisible();
    await expect(eventWidgetPage.countrySelect).toBeVisible();
    await expect(eventWidgetPage.topicSelect).toHaveValue(eventsWidgetData.defaultTopicValue);
    await expect(eventWidgetPage.countrySelect).toHaveValue(eventsWidgetData.defaultCountryValue);
    await expect(eventWidgetPage.embedCodeTextarea).toBeVisible();
    await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(eventsWidgetData.embedCodePatterns.iframeTag);
    await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(eventsWidgetData.embedCodePatterns.sourceUrl);
  });

  test('regenerates iframe code when custom width and height are set', async ({ page }) => {
    const eventWidgetPage = new EventWidgetPage(page);

    await eventWidgetPage.open();
    await eventWidgetPage.setFixedSize(
      eventsWidgetData.customSize.width,
      eventsWidgetData.customSize.height,
    );
    await eventWidgetPage.generatePreview();

    await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(
      new RegExp(`width="${eventsWidgetData.customSize.width}"`),
    );
    await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(
      new RegExp(`height="${eventsWidgetData.customSize.height}"`),
    );
  });
});
