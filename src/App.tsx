import React, { useReducer, useEffect, useMemo } from 'react';

import { Title, Button, Alert, AlertGroup, Expandable, Flex, FlexModifiers, Modal } from '@patternfly/react-core';
import { AddCircleOIcon, HelpIcon, HistoryIcon } from '@patternfly/react-icons';

import Countdown from './components/Countdown';
import TimeInput from './components/TimeInput';
import LapTable from './components/LapTable';

import useAlerts from './hooks/useAlerts';
import useModal from './hooks/useModal';

import { reducer, initialState } from './reducers/CountdownReducer';

export default function App() {

  const alerts = useAlerts();

  const [state, dispatch] = useReducer(reducer, null, () => {
    try {
      const restoredState = JSON.parse(localStorage.getItem('countdown_state') || "{}");
      return {
        startedAt: restoredState?.startedAt ? new Date(restoredState?.startedAt) : null,
        pausedAt: restoredState?.pausedAt ? new Date(restoredState?.pausedAt) : null,
        restTimeInMs: restoredState?.restTimeInMs ?? null,
        laps: restoredState?.laps?.map((lap: any) => ({ at: new Date(lap.at), timeInMs: lap.timeInMs })) ?? [],
      };
    } catch (error) {
      console.warn('error', error);
      return initialState;
    }
  });

  useEffect(() => {
    localStorage.setItem(('countdown_state'), JSON.stringify(state));
  }, [state])

  const onStart = () => {
    dispatch({ type: 'STARTED', at: new Date(), countdownInMs: 30000 });
    alerts.setAlert({ variant: 'success', title: 'Start pressed' });
  }
  const onStop = () => {
    dispatch({ type: 'STOPPED', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'Stop pressed' });
  }
  const onPause = () => {
    dispatch({ type: 'PAUSED', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'Pause pressed' });
  }
  const onResume = () => {
    dispatch({ type: 'RESUMED', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'Resume pressed' });
  }
  const onNewLap = () => {
    dispatch({ type: 'NEW_LAP', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'New lap!' });  
  }
  const onUndoNewLap = () => {
    dispatch({ type: 'UNDO_NEW_LAP' });
    alerts.setAlert({ variant: 'success', title: 'Undo new lap!' });
  }

  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.shiftKey) {
      onNewLap();
    } else if (e.code === 'Space' && e.shiftKey) {
      onUndoNewLap();
    }
  }, []);

  const onKeyUp = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Backspace') {
      onUndoNewLap();
    } else if (e.code === 'Space') {
      document.body.style.overflow = 'auto';
    }
  }, []);

  const onKeyDown = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      document.body.style.overflow = 'hidden';
    }
  }, []);

  useEffect(() => {
    console.warn('mount');
    document.addEventListener('keypress', onKeyPress);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      console.warn('unmount');
      document.removeEventListener('keypress', onKeyPress);
      document.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  const countdownUntil = state.restTimeInMs;

  const deleteModal = useModal();
  const helpModal = useModal();

  return (
    <>
      <AlertGroup isToast>
        {alerts.alerts.map(alert => <Alert {...alert} />)}
      </AlertGroup>

      <Modal
        isSmall
        title="Stop timer"
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        actions={[
          <Button key="confirm" variant="danger" onClick={() => { onStop(); deleteModal.close(); }}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={deleteModal.close}>
            Cancel
          </Button>
        ]}
      >
        Are you sure?
      </Modal>

      <Modal
        isSmall
        title="Help"
        isOpen={helpModal.isOpen}
        onClose={helpModal.close}
        actions={[
          <Button key="cancel" variant="link" onClick={helpModal.close}>
            Close
          </Button>
        ]}
      >
        Space - Create new lap<br/><br/>
        Shift Space - Undo last new lap<br/><br/>
        Backspace (Delete) - Undo last new lap<br/><br/>
      </Modal>

      <Flex breakpointMods={[
        { modifier: FlexModifiers.column },
        { modifier: FlexModifiers["align-content-center"] },
        { modifier: FlexModifiers["space-items-2xl"] },
      ]}>
        <Flex>
          <Title headingLevel="h1" size="4xl">
            Countdown coding challenge
          </Title>
        </Flex>

        {
          !state.startedAt ?
            <>
              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Title headingLevel="h2" size="3xl">
                  Countdown
                </Title>
              </Flex>
              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <TimeInput
                  onChange={(time) => console.log('TimeInput onChange', time)}
                />
              </Flex>

              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Title headingLevel="h2" size="3xl">
                  Threshold
                </Title>
              </Flex>
              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <TimeInput
                  onChange={(time) => console.log('TimeInput onChange', time)}
                />
              </Flex>

              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Button variant="primary" onClick={onStart}>
                  Start
                </Button>
              </Flex>
            </>
          :
            <>
              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Countdown paused={!!state.pausedAt} until={countdownUntil} />
              </Flex>

              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Button variant="primary" onClick={!state.pausedAt ? onPause : onResume}>
                  {!state.pausedAt ? 'Pause' : 'Resume'}
                </Button>
                <Button variant="secondary" aria-label="New lap" onClick={onNewLap}>
                  <AddCircleOIcon /> New lap
                </Button>
                <Button variant="secondary" aria-label="Undo new lap" isDisabled={state.laps.length < 1} onClick={onUndoNewLap}>
                  <HistoryIcon /> Undo new lap
                </Button>
                <Button variant="danger" onClick={deleteModal.open}>
                  Stop
                </Button>
                <Button variant="link" aria-label="Open help" onClick={helpModal.open}>
                  <HelpIcon />
                </Button>
              </Flex>

              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <LapTable laps={state.laps} />
              </Flex>
            </>
        }

        <br/><br/>
        <Expandable toggleText="Internal state (for debugging only)">
          <pre style={{ margin: '20px', border: '1px solid gray', padding: '10px' }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        </Expandable>
      </Flex>
    </>
  );
}
