import { IntlShape } from 'react-intl';
import 'moment/locale/nb';
import '@formatjs/intl-pluralrules/polyfill';
import '@formatjs/intl-pluralrules/dist/locale-data/nb';

export const defaultLocale = 'nb';
export const SUPPORTED_LOCALES = ['nb', 'en', 'sv'];

export const LOCALE_KEY = 'OT::locale';

const removeRegionCode = (locale: string) =>
  locale ? locale.toLowerCase().split(/[_-]+/)[0] : defaultLocale;

export const isLocaleSupported = (locale: string) =>
  locale ? SUPPORTED_LOCALES.indexOf(locale) > -1 : false;

export const getLocale = () => {
  const savedLocale =
    process.env.NODE_ENV !== 'test' && localStorage.getItem(LOCALE_KEY);
  const navigatorLang =
    process.env.NODE_ENV !== 'test' &&
    ((navigator.languages && navigator.languages[0]) || navigator.language);
  const locale = savedLocale || navigatorLang || defaultLocale;
  const localeWithoutRegionCode = removeRegionCode(locale);

  if (isLocaleSupported(localeWithoutRegionCode)) {
    return localeWithoutRegionCode;
  }
  return defaultLocale;
};

export const getMessages = (locale: string) =>
  require('./translations/' + locale + '.ts');

export type FormatMessage = IntlShape['formatMessage'];
