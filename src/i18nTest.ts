import i18n from "i18next";
import {initReactI18next} from "react-i18next";

import translationTr from "./i18n/tr/translation.json";

export const resources = {
  tr: {
    translation: translationTr,
  },
};

i18n.use(initReactI18next).init({
  resources,
  initImmediate: false,
  lng: "tr",
  debug: false,
  react: {
    useSuspense: false,
  },
});

export default i18n;
