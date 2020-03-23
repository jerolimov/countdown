import React, { useState, useReducer, useEffect, useMemo } from 'react';

import { Title, Button, Alert, AlertGroup, Expandable, Flex, FlexModifiers, Modal } from '@patternfly/react-core';
import { AddCircleOIcon, HelpIcon, HistoryIcon } from '@patternfly/react-icons';

import Countdown from './components/Countdown';
import TimeInput from './components/TimeInput';
import LapTable from './components/LapTable';

import useAlerts from './hooks/useAlerts';
import useModal from './hooks/useModal';
import useKeyboard from './hooks/useKeyboard';

import { reducer, initialState } from './reducers/CountdownReducer';

import { Time } from './types';

export default function App() {
  // UI state
  const alerts = useAlerts();
  const deleteModal = useModal();
  const helpModal = useModal();

  // Input countdown and threshold
  const [countdown, setCountdown] = useState<Time>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [threshold, setThreshold] = useState<Time>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Running countdown
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

  // Button callbacks
  const onStart = useMemo(() => () => {
    const countdownInMs =
        countdown.days * 24 * 60 * 60 * 1000 +
        countdown.hours * 60 * 60 * 1000 +
        countdown.minutes * 60 * 1000 +
        countdown.seconds * 1000;
    dispatch({ type: 'STARTED', at: new Date(), countdownInMs });
    alerts.setAlert({ variant: 'success', title: 'Start pressed' });
  }, [alerts, countdown]);
  const onStop = useMemo(() => () => {
    dispatch({ type: 'STOPPED', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'Stop pressed' });
  }, [alerts]);
  const onPause = useMemo(() => () => {
    dispatch({ type: 'PAUSED', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'Pause pressed' });
  }, [alerts]);
  const onResume = useMemo(() => () => {
    dispatch({ type: 'RESUMED', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'Resume pressed' });
  }, [alerts]);
  const onNewLap = useMemo(() => () => {
    dispatch({ type: 'NEW_LAP', at: new Date() });
    alerts.setAlert({ variant: 'success', title: 'New lap!' });  
  }, [alerts]);
  const onUndoNewLap = useMemo(() => () => {
    dispatch({ type: 'UNDO_NEW_LAP' });
    alerts.setAlert({ variant: 'success', title: 'Undo new lap!' });
  }, [alerts]);

  // Keyboard hooks
  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.shiftKey) {
      onNewLap();
    } else if (e.code === 'Space' && e.shiftKey) {
      onUndoNewLap();
    }
  }, [onNewLap, onUndoNewLap]);
  const onKeyUp = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Backspace') {
      onUndoNewLap();
    } else if (e.code === 'Space') {
      document.body.style.overflow = 'auto';
    }
  }, [onUndoNewLap]);
  const onKeyDown = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      document.body.style.overflow = 'hidden';
    }
  }, []);
  useKeyboard('keypress', onKeyPress);
  useKeyboard('keyup', onKeyUp);
  useKeyboard('keydown', onKeyDown);

  const countdownUntil = state.restTimeInMs;

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
          <Title headingLevel="h1" size="4xl" style={{ textAlign: 'center', marginTop: '20px' }}>
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
                  value={countdown}
                  onChange={setCountdown}
                />
              </Flex>

              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Title headingLevel="h2" size="3xl">
                  Threshold
                </Title>
              </Flex>
              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <TimeInput
                  value={threshold}
                  onChange={setThreshold}
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

              <Flex
                breakpointMods={[
                  { modifier: FlexModifiers["align-self-center"] },
                  { modifier: FlexModifiers["justify-content-center"] },
                ]}
              >
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
