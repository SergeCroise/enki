import React from 'react';
import { Heading4, Paragraph } from '@entur/typography';
import { PassingTimesEditorProps } from '..';
import { changeElementAtIndex } from 'helpers/arrays';
import { MixedFlexiblePassingTimeEditor } from './MixedFlexiblePassingTimeEditor';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { PassingTimesError } from '../common/PassingTimesError';
import useUniqueKeys from 'hooks/useUniqueKeys';

export const MixedFlexiblePassingTimesEditor = ({
  passingTimes,
  stopPoints,
  onChange,
  spoilPristine,
}: PassingTimesEditorProps) => {
  const { formatMessage } = useIntl();
  const uniqueKeys = useUniqueKeys(passingTimes);
  return (
    <>
      <Heading4>
        {formatMessage({ id: 'serviceJourneyMixedFlexiblePassingTimes' })}
      </Heading4>
      <Paragraph>
        {formatMessage({ id: 'passingTimesInfoMixedFlexible' })}
      </Paragraph>
      <PassingTimesError
        passingTimes={passingTimes}
        spoilPristine={spoilPristine}
      />
      <div className="passing-times-editor">
        {passingTimes.map((passingTime, index) => (
          <div key={uniqueKeys[index]} className="passing-time">
            <div className="time-number">{index + 1}</div>
            <MixedFlexiblePassingTimeEditor
              passingTime={passingTime}
              stopPoint={stopPoints[index]}
              index={index}
              isLast={index === stopPoints.length - 1}
              onChange={(changedPassingTime) => {
                onChange(
                  changeElementAtIndex(passingTimes, changedPassingTime, index)
                );
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
