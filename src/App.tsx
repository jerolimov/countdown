import React, { useReducer, useEffect, useMemo } from 'react';

import { Title, Button, Alert, AlertGroup, Expandable, Flex, FlexModifiers, Modal, FlexItem } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

import useAlerts from './hooks/useAlerts';
import useModal from './hooks/useModal';

import { reducer, initialState } from './CountdownReducer';
import Countdown from './Countdown';
import TimeInput from './TimeInput';

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

  const cells = [
    { title: 'Lap #' },
    { title: 'Lap delta' },
    { title: 'Lap date' },
    { title: 'Lap time' },
  ];

  const rows = state.laps.map((lap, index) => ([
    index + 1,
    lap.timeInMs,
    lap.at.toLocaleDateString(),
    lap.at.toLocaleTimeString(),
  ]));

  const countdownUntil = state.restTimeInMs;

  const deleteModal = useModal();

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
        isFooterLeftAligned
      >
        Are you sure?
      </Modal>

      <Flex breakpointMods={[
        { modifier: FlexModifiers.column },
        { modifier: FlexModifiers["align-content-center"] },
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
                <Button variant="secondary" onClick={onNewLap}>
                  New lap
                </Button>
                <Button variant="secondary" isDisabled={state.laps.length < 1} onClick={onUndoNewLap}>
                  Undo new lap
                </Button>
                <Button variant="danger" onClick={deleteModal.open}>
                  Stop
                </Button>
              </Flex>

              <Flex breakpointMods={[{ modifier: FlexModifiers["align-self-center"] }]}>
                <Table aria-label="Laps" cells={cells} rows={rows}>
                  <TableHeader />
                  <TableBody />
                </Table>
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
