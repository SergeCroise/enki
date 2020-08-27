import React, { ReactElement, useState, useRef } from 'react';
import ServiceJourney from 'model/ServiceJourney';
import { Modal } from '@entur/modal';
import { selectIntl } from 'i18n';
import { useSelector } from 'react-redux';
import { InputGroup, TextField } from '@entur/form';
import { SecondaryButton, PrimaryButton } from '@entur/button';
import {
  replaceElement,
  removeElementByIndex,
  useUniqueKeys,
} from 'helpers/arrays';
import ScrollToTop from 'components/ScrollToTop';
import { Heading1, LeadParagraph } from '@entur/typography';
import StopPoint from 'model/StopPoint';
import { ExpandablePanel } from '@entur/expand';
import AddButton from 'components/AddButton/AddButton';
import './styles.scss';

type Props = {
  serviceJourneys: ServiceJourney[];
  onChange: (serviceJourneys: ServiceJourney[]) => void;
  stopPoints: StopPoint[];
  children: (
    serviceJourney: ServiceJourney,
    key: string,
    stopPoints: StopPoint[],
    handleUpdate: (serviceJourney: ServiceJourney) => void,
    handleDelete: () => void
  ) => ReactElement;
};

export default ({ serviceJourneys, onChange, stopPoints, children }: Props) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const { formatMessage } = useSelector(selectIntl);
  const textFieldRef = useRef<HTMLInputElement>(null);

  const keys = useUniqueKeys(serviceJourneys);

  const updateServiceJourney = (index: number) => {
    return (serviceJourney: ServiceJourney) => {
      onChange(replaceElement(serviceJourneys, index, serviceJourney));
    };
  };

  const deleteServiceJourney = (index: number) => {
    return () => {
      if (serviceJourneys.length > 1) {
        onChange(removeElementByIndex(serviceJourneys, index));
      }
    };
  };

  const addNewServiceJourney = (name: string) => {
    const newServiceJourneys = [
      ...serviceJourneys,
      {
        name,
        passingTimes: stopPoints.map((_) => ({})),
      },
    ];
    onChange(newServiceJourneys);
    setShowModal(false);
    setTimeout(
      () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
      100
    );
  };

  return (
    <>
      <Modal
        size="small"
        open={showModal}
        title={formatMessage('newServiceJourneyModalTitle')}
        onDismiss={() => setShowModal(false)}
        className="modal"
      >
        {formatMessage('newServiceJourneyModalSubTitle')}
        <div className="modal-content">
          <InputGroup
            label={formatMessage('newServiceJourneyModalLabel')}
            className="modal-input"
          >
            <TextField
              placeholder={formatMessage('newServiceJourneyModalPlaceholder')}
              ref={textFieldRef}
            />
          </InputGroup>
          <div>
            <SecondaryButton
              onClick={() => setShowModal(false)}
              className="margin-right"
            >
              {formatMessage('newServiceJourneyModalCancel')}
            </SecondaryButton>
            <PrimaryButton
              onClick={() =>
                addNewServiceJourney(textFieldRef?.current?.value ?? '')
              }
            >
              {formatMessage('newServiceJourneyModalCreate')}
            </PrimaryButton>
          </div>
        </div>
      </Modal>

      <ScrollToTop>
        <div className="service-journeys-editor">
          <Heading1>{formatMessage('editorServiceJourneys')}</Heading1>
          <LeadParagraph>{formatMessage('serviceJourneysInfo')}</LeadParagraph>
          {serviceJourneys.length === 1
            ? children(
                serviceJourneys[0],
                keys[0],
                stopPoints,
                updateServiceJourney(0),
                deleteServiceJourney(0)
              )
            : serviceJourneys.map((sj, index) => (
                <ExpandablePanel
                  key={keys[index]}
                  title={sj.name}
                  defaultOpen={!sj.id && index === serviceJourneys.length - 1}
                >
                  {children(
                    sj,
                    keys[index],
                    stopPoints,
                    updateServiceJourney(index),
                    deleteServiceJourney(index)
                  )}
                </ExpandablePanel>
              ))}
          <AddButton
            onClick={() => setShowModal(true)}
            buttonTitle={formatMessage('editorAddServiceJourneys')}
          />
        </div>
      </ScrollToTop>
    </>
  );
};
