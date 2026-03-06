import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import trTranslations from "./tr/translation.json";
import trTemplates from "./tr/templates.json";

export type AppLanguage = "tr";

export const resources = {
  tr: {
    translation: trTranslations,
    templates: trTemplates,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "tr",
    supportedLngs: ["tr"],
    ns: ["translation", "templates"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
