const { test, expect } = require('@playwright/test');
const { step } = require('allure-js-commons');
const { EventWidgetPage } = require('../pages/EventWidgetPage');
const { eventsWidgetData } = require('../fixtures/eventswidget.data');

test.describe('3SNET events widget constructor', () => {
  test.beforeEach(async ({ page }, testInfo) => {
    testInfo._pageErrors = [];
    testInfo._consoleErrors = [];

    page.on('pageerror', (error) => {
      testInfo._pageErrors.push(error);
    });

    page.on('console', (message) => {
      if (message.type() === 'error') {
        testInfo._consoleErrors.push(message.text());
      }
    });
  });

  test.afterEach(async ({}, testInfo) => {
    const pageErrors = testInfo._pageErrors || [];
    const consoleErrors = testInfo._consoleErrors || [];

    if (pageErrors.length === 0 && consoleErrors.length === 0) {
      return;
    }

    const details = [
      'Page errors:',
      ...pageErrors.map((error) => `- ${error.stack || error.message || String(error)}`),
      '',
      'Console errors:',
      ...consoleErrors.map((error) => `- ${error}`),
    ].join('\n');

    await testInfo.attach('Runtime errors', {
      body: details,
      contentType: 'text/plain',
    });

    throw new Error('Detected page or console errors during the test run.');
  });

  test('loads constructor UI and default iframe embed code', async ({ page }) => {
    const eventWidgetPage = new EventWidgetPage(page);

    await step('Open the constructor page', async () => {
      await eventWidgetPage.open();
    });

    await step('Verify title and key UI elements', async () => {
      await expect(page).toHaveTitle(eventsWidgetData.expectedTitlePattern);
      await expect(eventWidgetPage.heading).toBeVisible();
      await expect(eventWidgetPage.topicSelect).toBeVisible();
      await expect(eventWidgetPage.countrySelect).toBeVisible();
      await expect(eventWidgetPage.topicSelect).toHaveValue(eventsWidgetData.defaultTopicValue);
      await expect(eventWidgetPage.countrySelect).toHaveValue(eventsWidgetData.defaultCountryValue);
    });

    await step('Validate the default embed code', async () => {
      await expect(eventWidgetPage.embedCodeTextarea).toBeVisible();
      await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(
        eventsWidgetData.embedCodePatterns.iframeTag,
      );
      await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(
        eventsWidgetData.embedCodePatterns.sourceUrl,
      );
    });
  });

  test('regenerates iframe code when custom width and height are set', async ({ page }) => {
    const eventWidgetPage = new EventWidgetPage(page);

    await step('Open the constructor page', async () => {
      await eventWidgetPage.open();
    });

    await step('Set fixed width and height', async () => {
      await eventWidgetPage.setFixedSize(
        eventsWidgetData.customSize.width,
        eventsWidgetData.customSize.height,
      );
    });

    await step('Generate preview', async () => {
      await eventWidgetPage.generatePreview();
    });

    await step('Verify updated embed code', async () => {
      await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(
        new RegExp(`width="${eventsWidgetData.customSize.width}"`),
      );
      await expect(eventWidgetPage.embedCodeTextarea).toHaveValue(
        new RegExp(`height="${eventsWidgetData.customSize.height}"`),
      );
    });
  });
});
