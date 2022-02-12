const i18next = require('i18next');
const Backend = require('i18next-fs-backend');
const middleware = require('i18next-http-middleware')
const dotenv = require('dotenv');

dotenv.config({ path: '.env' });






//i18n
i18next
    .use(middleware.LanguageDetector)
    .use(Backend)
    .init({
        locales: process.env.LOCALES?.split(","), // ['fr', 'en', 'ar'],
        fallbackLng: process.env.FALLBACK_LANG,

        backend: {
            loadPath: './locales/{{lng}}/translation.json'
        },
    });

module.exports = i18next;
