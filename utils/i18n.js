const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware')







//i18n
i18next
    .use(middleware.LanguageDetector)
    .use(Backend)
    .init({
        locales: ['fr', 'en', 'ar'],

        fallbackLng: 'en',

        backend: {
            loadPath: './locales/{{lng}}/translation.json'
        },
    });

module.exports = i18next;
