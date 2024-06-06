/** @type {import('next-i18next').UserConfig} */

const capitalizeFirstLetter = (value, language) => {
  const firstLetter = value.charAt(0).toLocaleUpperCase(language);
  const restOfString = value.slice(1);
  return `${firstLetter}${restOfString}`;
};

module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  serializeConfig: false,
  use: [
    {
      init: (i18next) => {
        i18next.services.formatter.add('format', (value, language) => {
          return 10;
        });
      },
      type: '3rdParty',
    },
  ],
};
