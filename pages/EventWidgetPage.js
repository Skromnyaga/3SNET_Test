class EventWidgetPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', {
      name: 'Начните создавать свой календарь мероприятий!',
    });
    this.topicSelect = page.locator('select').nth(0);
    this.countrySelect = page.locator('select').nth(1);
    this.widthInput = page.locator('input[name="width"]');
    this.heightInput = page.locator('input[name="height"]');
    this.fullWidthCheckbox = page.locator('input[name="full-width"]');
    this.autoHeightCheckbox = page.locator('input[name="auto-height"]');
    this.generatePreviewButton = page.getByRole('button', { name: 'Сгенерировать превью' });
    this.embedCodeTextarea = page.locator('#code');
  }

  async open() {
    await this.page.goto('/eventswidget/', { waitUntil: 'domcontentloaded' });
  }

  async setFixedSize(width, height) {
    if (await this.fullWidthCheckbox.isChecked()) {
      await this.fullWidthCheckbox.uncheck({ force: true });
    }

    if (await this.autoHeightCheckbox.isChecked()) {
      await this.autoHeightCheckbox.uncheck({ force: true });
    }

    await this.widthInput.fill(String(width));
    await this.heightInput.fill(String(height));
  }

  async generatePreview() {
    await this.generatePreviewButton.click();
  }
}

module.exports = { EventWidgetPage };
