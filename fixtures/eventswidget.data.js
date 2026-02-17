const eventsWidgetData = {
  expectedTitlePattern: /Конструктор календаря мероприятий/i,
  defaultTopicValue: 'Выбрать тематику',
  defaultCountryValue: 'Все страны',
  embedCodePatterns: {
    iframeTag: /<iframe id="3snet-frame"/,
    sourceUrl: /src="https:\/\/3snet\.info\/widget-active-events\//,
  },
  customSize: {
    width: 320,
    height: 360,
  },
};

module.exports = { eventsWidgetData };
