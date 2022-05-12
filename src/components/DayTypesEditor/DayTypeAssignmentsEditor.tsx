import React from 'react';
import { useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import moment from 'moment/moment';
import { AddIcon, DeleteIcon } from '@entur/icons';
import { IconButton, TertiaryButton } from '@entur/button';
import DayTypeAssignment from 'model/DayTypeAssignment';
import { removeElementByIndex, replaceElement } from 'helpers/arrays';
import { DatePicker } from '@entur/datepicker';
import OperatingPeriod from 'model/OperatingPeriod';
import { getErrorFeedback } from 'helpers/errorHandling';
import './styles.scss';
import useUniqueKeys from 'hooks/useUniqueKeys';
import { Switch } from '@entur/form';
import { DataCell, Table, TableBody, TableRow } from '@entur/table';

type Props = {
  dayTypeAssignments: DayTypeAssignment[];
  onChange: (dayTypeAssignment: DayTypeAssignment[]) => void;
};

const DayTypeAssignmentsEditor = ({ dayTypeAssignments, onChange }: Props) => {
  const { formatMessage } = useSelector(selectIntl);

  const addNewDayTypeAssignment = () => {
    const today: string = moment().format('YYYY-MM-DD');
    const dayTypeAssignment = {
      isAvailable: true,
      operatingPeriod: {
        fromDate: today,
        toDate: today,
      },
    };
    onChange([...dayTypeAssignments, dayTypeAssignment]);
  };

  const changeDay = (op: OperatingPeriod, index: number) => {
    const updated = { ...dayTypeAssignments[index], operatingPeriod: op };
    onChange(replaceElement(dayTypeAssignments, index, updated));
  };

  const changeIsAvailable = (isAvailable: boolean, index: number) => {
    const updated = { ...dayTypeAssignments[index], isAvailable };
    onChange(replaceElement(dayTypeAssignments, index, updated));
  };

  const isNotBefore = (toDate: string, fromDate: string): boolean =>
    !moment(toDate).isBefore(moment(fromDate));

  if (dayTypeAssignments.length === 0) addNewDayTypeAssignment();

  const uniqueKeys = useUniqueKeys(dayTypeAssignments);

  const dateJsToIso = (date: Date | null): string => {
    const dateOrNow = date ?? new Date();
    const y = dateOrNow.getFullYear();
    const m = dateOrNow?.getMonth() + 1;
    const d = dateOrNow?.getDate();
    return `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`;
  };

  return (
    <>
      <div className="day-type-assignments-editor">
        <Table>
          <TableBody>
            {dayTypeAssignments.map((dta, index) => (
              <TableRow key={uniqueKeys[index]} className="day-type-assignment">
                <DataCell>
                  <DatePicker
                    label={formatMessage('dayTypeEditorFromDate')}
                    selectedDate={moment(dta.operatingPeriod.fromDate).toDate()}
                    onChange={(date: Date | null) => {
                      changeDay(
                        { ...dta.operatingPeriod, fromDate: dateJsToIso(date) },
                        index
                      );
                    }}
                  />
                </DataCell>

                <DataCell>
                  <DatePicker
                    label={formatMessage('dayTypeEditorToDate')}
                    {...getErrorFeedback(
                      formatMessage('dayTypeEditorToDateValidation'),
                      isNotBefore(
                        dta.operatingPeriod.toDate ?? '',
                        dta.operatingPeriod.fromDate ?? ''
                      ),
                      false
                    )}
                    selectedDate={moment(dta.operatingPeriod.toDate).toDate()}
                    onChange={(date: Date | null) => {
                      changeDay(
                        { ...dta.operatingPeriod, toDate: dateJsToIso(date) },
                        index
                      );
                    }}
                  />
                </DataCell>

                <DataCell>
                  <Switch
                    checked={dta.isAvailable}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      changeIsAvailable(e.target.checked, index);
                    }}
                  >
                    {formatMessage('dayTypeAssignmentAvailableLabel')}
                  </Switch>
                </DataCell>

                <DataCell>
                  {dayTypeAssignments.length > 1 && (
                    <IconButton
                      onClick={() =>
                        onChange(
                          removeElementByIndex(dayTypeAssignments, index)
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </DataCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <TertiaryButton onClick={() => addNewDayTypeAssignment()}>
        <AddIcon />
        {formatMessage('dayTypeEditorAddDayTypeAssignment')}
      </TertiaryButton>
    </>
  );
};

export default DayTypeAssignmentsEditor;
