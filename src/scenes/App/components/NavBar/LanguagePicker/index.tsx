import { useCallback, useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FloatingButton } from '@entur/button';
import { DownArrowIcon, CheckIcon, UpArrowIcon } from '@entur/icons';
import { NorwayIcon, UKIcon, SwedenIcon } from '@entur/icons';
import { SUPPORTED_LOCALES, LOCALE_KEY } from 'i18n';
import './styles.scss';
import { MessagesKey } from 'i18n/translations/translationKeys';
import { useIntl } from 'react-intl';
import { updateLocale } from 'features/app/intlSlice';

const getFlagIcon = (locale: string) => {
  switch (locale) {
    case 'nb':
      return <NorwayIcon inline />;
    case 'sv':
      return <SwedenIcon inline />;
    case 'en':
      return <UKIcon inline />;
    default: {
      return <NorwayIcon inline />;
    }
  }
};

const getLocaleString = (locale: string): keyof MessagesKey => {
  switch (locale) {
    case 'en':
      return 'userMenuMenuItemTextEnglish';
    case 'sv':
      return 'userMenuMenuItemTextSwedish';
    case 'nb':
      return 'userMenuMenuItemTextNorwegian';
    default:
      return 'userMenuMenuItemTextNorwegian';
  }
};

const LanguagePicker = () => {
  const [toggled, setToggle] = useState<boolean>(false);
  const dispatch = useDispatch();
  const { formatMessage, locale: selectedLocale } = useIntl();

  const handleChangeLocale = useCallback(
    (locale: string) => {
      dispatch(updateLocale(locale));
      localStorage.setItem(LOCALE_KEY, locale);
    },
    [dispatch]
  );

  const arrowIcon = useMemo(
    () => (
      <div className="language-picker__icon-container__arrow">
        {toggled ? <UpArrowIcon /> : <DownArrowIcon />}
      </div>
    ),
    [toggled]
  );

  const checkIcon = useCallback(
    (locale: string) => {
      if (locale === selectedLocale)
        return (
          <div className="language-picker__icon-container language-picker__icon-container__check">
            <CheckIcon />
          </div>
        );
    },
    [selectedLocale]
  );

  const flagIcon = useCallback((locale: string) => {
    return (
      <div className="language-picker__icon-container language-picker__icon-container__flag">
        {getFlagIcon(locale)}
      </div>
    );
  }, []);

  return (
    <div className="language-picker-wrapper">
      {toggled && (
        <div className="language-picker__dropdown">
          {SUPPORTED_LOCALES.map((locale: string) => (
            <FloatingButton
              key={locale}
              className="language-picker__item"
              onClick={() => handleChangeLocale(locale)}
              aria-label={locale}
              size="small"
            >
              {flagIcon(locale)}
              <span>{formatMessage({ id: getLocaleString(locale) })}</span>
              {checkIcon(locale)}
            </FloatingButton>
          ))}
        </div>
      )}
      <FloatingButton
        onClick={() => setToggle(!toggled)}
        aria-label={formatMessage({ id: 'languagePickerAriaLabel' })}
        className="language-picker"
        size="small"
      >
        {flagIcon(selectedLocale)}
        {formatMessage({ id: getLocaleString(selectedLocale) })}
        {arrowIcon}
      </FloatingButton>
    </div>
  );
};

export default LanguagePicker;
