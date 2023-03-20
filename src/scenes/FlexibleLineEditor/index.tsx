import React, { useEffect, useState } from 'react';
import { useLoadDependencies } from './hooks';
import { Navigate, useNavigate, useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectIntl } from 'i18n';
import FlexibleLineEditorSteps from './FlexibleLineEditorSteps';
import { GlobalState } from 'reducers';
import FlexibleLine, { initFlexibleLine } from 'model/FlexibleLine';
import { filterAuthorities, filterNetexOperators } from 'model/Organisation';
import {
  currentFlexibleLineStepIsValid,
  getMaxAllowedFlexibleLineStepIndex,
  validFlexibleLine,
} from 'helpers/validation';
import { isBlank } from 'helpers/forms';
import { getFlexibleLineFromPath } from 'helpers/url';
import Loading from 'components/Loading';
import { setSavedChanges } from 'actions/editor';
import Page from 'components/Page';
import { deleteLine, saveFlexibleLine } from 'actions/flexibleLines';
import { FLEXIBLE_LINE_STEPS } from './steps';
import './styles.scss';
import LineEditorStepper from 'components/LineEditorStepper';
import { useConfig } from 'config/ConfigContext';

const EditorFrame = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [line, setLine] = useState<FlexibleLine | undefined>();
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [nextClicked, setNextClicked] = useState<boolean>(false);
  const [isSaving, setSaving] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [firstPath] = useLocation().pathname.split('/').slice(1);
  const isFlexibleLine = Boolean(
    line?.flexibleLineType || firstPath === 'flexible-lines'
  );

  const { formatMessage } = useSelector(selectIntl);
  const dispatch = useDispatch<any>();
  const { flexibleLines, organisations, networks, editor, providers } =
    useSelector<GlobalState, GlobalState>((s) => s);

  const { isLoadingDependencies, refetchFlexibleLine } = useLoadDependencies();

  const config = useConfig();

  useEffect(() => {
    if (!isBlank(params.id))
      return setLine(getFlexibleLineFromPath(flexibleLines ?? [], params));

    return setLine(initFlexibleLine());

    // eslint-disable-next-line
  }, [flexibleLines, params.id]);

  const goToLines = () =>
    navigate(isFlexibleLine ? '/flexible-lines' : '/lines');

  const isEdit = !isBlank(params.id);

  const handleOnSaveClick = () => {
    setNextClicked(true);
    setSaving(true);
    dispatch(saveFlexibleLine(line!))
      .then(() => dispatch(setSavedChanges(true)))
      .then(() => !isEdit && goToLines())
      .then(() => isEdit && refetchFlexibleLine())
      // noop just catching to avoid unhandled rejection
      // error message is handled upstream
      .catch(() => {})
      .finally(() => setSaving(false));
    setNextClicked(false);
  };

  const handleDelete = () => {
    if (line?.id) {
      setDeleting(true);
      dispatch(deleteLine(line)).then(() => goToLines());
    }
  };

  const onBackButtonClicked = () =>
    editor.isSaved ? goToLines() : setShowConfirm(true);

  const onFlexibleLineChange = (flexibleLine: FlexibleLine) => {
    setLine(flexibleLine);
    dispatch(setSavedChanges(false));
  };

  const authoritiesMissing =
    organisations &&
    filterAuthorities(
      organisations,
      providers.active,
      config.enableLegacyOrganisationsFilter
    ).length === 0;

  return (
    <Page
      backButtonTitle={
        isFlexibleLine
          ? formatMessage('navBarFlexibleLinesMenuItemLabel')
          : formatMessage('navBarLinesMenuItemLabel')
      }
      onBackButtonClick={onBackButtonClicked}
    >
      <>
        <Loading
          className=""
          isLoading={isLoadingDependencies}
          text={formatMessage('editorLoadingLineText')}
        >
          <>
            {!isLoadingDependencies && !line && (
              <Navigate to="/flexible-lines" replace />
            )}
            {!isLoadingDependencies && line && (
              <LineEditorStepper
                steps={FLEXIBLE_LINE_STEPS.map((step) => formatMessage(step))}
                isValidStepIndex={(i: number) =>
                  getMaxAllowedFlexibleLineStepIndex(line!) >= i
                }
                isLineValid={validFlexibleLine(line!)}
                currentStepIsValid={(i) =>
                  currentFlexibleLineStepIsValid(i, line)
                }
                setNextClicked={setNextClicked}
                isEdit={isEdit}
                spoilPristine={nextClicked}
                onDelete={handleDelete}
                isDeleting={isDeleting}
                onSave={handleOnSaveClick}
                isSaving={isSaving}
                isSaved={editor.isSaved}
                redirectTo="/flexible-lines"
                showConfirm={showConfirm}
                setShowConfirm={setShowConfirm}
                authoritiesMissing={authoritiesMissing}
              >
                {(activeStep) => (
                  <FlexibleLineEditorSteps
                    activeStep={activeStep}
                    flexibleLine={line!}
                    changeFlexibleLine={onFlexibleLineChange}
                    operators={filterNetexOperators(
                      organisations ?? [],
                      config.enableLegacyOrganisationsFilter
                    )}
                    networks={networks || []}
                    spoilPristine={nextClicked}
                  />
                )}
              </LineEditorStepper>
            )}
          </>
        </Loading>
      </>
    </Page>
  );
};

export default EditorFrame;
