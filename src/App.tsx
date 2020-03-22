import React, { useReducer, useEffect, useMemo, useState } from 'react';
import './App.css';

import { Button, Flex, FlexModifiers, Alert, AlertProps, AlertGroup, AlertActionCloseButton, Expandable, Modal } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

import { reducer, initialState } from './CountdownReducer';
import Countdown from './Countdown';
import TimeInput from './TimeInput';

export default function App() {

  const [alerts, setAlerts] = useState<AlertProps[]>([]);

  const addAlert = (alert: AlertProps, timeout = 3000) => {
    const key = Date.now();
    setAlerts(alerts => [
      ...alerts,
      {
        ...alert,
        key,
        action: (
          <AlertActionCloseButton onClose={() => removeAlert(key)} />
        ),
      }
    ]);
    if (timeout > 0) {
      setTimeout(() => removeAlert(key), timeout);
    }
  };

  const removeAlert = (key: string | number) => {
    console.warn('removeAlert', key, alerts);
    setAlerts(alerts => alerts.filter(alert => alert.key !== key));
  }

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
    addAlert({ variant: 'success', title: 'Start pressed' });
  }
  const onStop = () => {
    dispatch({ type: 'STOPPED', at: new Date() });
    addAlert({ variant: 'success', title: 'Stop pressed' });
  }
  const onPause = () => {
    dispatch({ type: 'PAUSED', at: new Date() });
    addAlert({ variant: 'success', title: 'Pause pressed' });
  }
  const onResume = () => {
    dispatch({ type: 'RESUMED', at: new Date() });
    addAlert({ variant: 'success', title: 'Resume pressed' });
  }
  const onNewLap = () => {
    dispatch({ type: 'NEW_LAP', at: new Date() });
    addAlert({ variant: 'success', title: 'New lap!' });  
  }
  const onUndoNewLap = () => {
    dispatch({ type: 'UNDO_NEW_LAP' });
    addAlert({ variant: 'success', title: 'Undo new lap!' });
  }

  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space' && !e.shiftKey) {
      if (e.shiftKey) {
        onUndoNewLap();
      } else {
        onNewLap();
      }
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

  const [isOpen, setIsOpen] = useState(false);
  const showDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return (
    <>
      <AlertGroup isToast>
        {alerts && alerts.map(alert => <Alert {...alert} />)}
      </AlertGroup>
      <Modal
        isSmall
        title="Stop timer"
        isOpen={isOpen}
        onClose={closeDialog}
        actions={[
          <Button key="confirm" variant="danger" onClick={() => { onStop(); closeDialog(); }}>
            Confirm
          </Button>,
          <Button key="cancel" variant="link" onClick={closeDialog}>
            Cancel
          </Button>
        ]}
        isFooterLeftAligned
      >
        Are you sure?
      </Modal>

      <Flex breakpointMods={[
        {
          modifier: FlexModifiers["justify-content-flex-start"],
        },
        {
          modifier: FlexModifiers["justify-content-center"]
        }
      ]}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Flex>

      <h1>Countdown coding challenge</h1>

      <h2>Countdown</h2>
      <TimeInput
        onChange={(time) => console.log('TimeInput onChange', time)}
      />

      <h2>Threshold</h2>
      <TimeInput
        onChange={(time) => console.log('TimeInput onChange', time)}
      />

      <Countdown paused={!!state.pausedAt} until={countdownUntil} />

      <div>
        {
          !state.startedAt ?
            <>
              <Button variant="primary" onClick={onStart}>
                Start
              </Button>
            </>
          :
            <>
              <Button variant="primary" onClick={!state.pausedAt ? onPause : onResume}>
                {!state.pausedAt ? 'Pause' : 'Resume'}
              </Button>
              <Button variant="secondary" onClick={onNewLap}>
                New lap
              </Button>
              <Button variant="secondary" isDisabled={state.laps.length < 1} onClick={onUndoNewLap}>
                Undo new lap
              </Button>

              <br/><br/>
              <Button variant="danger" onClick={showDialog}>
                Stop
              </Button>
            </>
        }
      </div>

      <Table aria-label="Laps" cells={cells} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>

      <Expandable toggleText="Internal state (for debugging only)">
        <pre style={{ margin: '20px', border: '1px solid gray', padding: '10px' }}>
          {JSON.stringify(state, null, 2)}
        </pre>
      </Expandable>
    </>
  );
}
