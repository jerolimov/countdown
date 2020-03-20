import React, { useReducer, useEffect, useMemo, useState } from 'react';
import './App.css';

import { Button, Flex, FlexModifiers, Alert, AlertProps, AlertGroup, AlertActionCloseButton } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

import TimeInput from './TimeInput';
import Countdown from './Countdown';
import { reducer, initialState } from './CountdownReducer';

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

  const cells = [
    { title: 'Lap #' },
    { title: 'Lap time' },
  ];

  const rows = [
    { cells: [ '1', '123:12' ] },
    { cells: [ '2', '123:12' ] },
    { cells: [ '3', '123:12' ] },
  ];

  const [state, dispatch] = useReducer(reducer, initialState);

  const onStart = () => {
    dispatch({ type: 'START' });
    addAlert({ variant: 'success', title: 'Start pressed' });
  }
  const onStop = () => {
    dispatch({ type: 'STOP' });
    addAlert({ variant: 'success', title: 'Stop pressed' });
  }
  const onPause = () => {
    dispatch({ type: 'PAUSE' });
    addAlert({ variant: 'success', title: 'Pause pressed' });
  }
  const onResume = () => {
    dispatch({ type: 'RESUME' });
    addAlert({ variant: 'success', title: 'Resume pressed' });
  }

  const currentTime = Date.now();

  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      if (e.shiftKey) {
        dispatch({ type: 'UNDO_NEW_LAP' });
        addAlert({ variant: 'success', title: 'Undo new lap!' });
      } else {
        dispatch({ type: 'NEW_LAP' });
        addAlert({ variant: 'success', title: 'New lap!' });  
      }
    }
  }, []);
  
  const onKeyUp = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Backspace') {
      dispatch({ type: 'UNDO_NEW_LAP' });
      addAlert({ variant: 'success', title: 'Undo new lap!' });
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

  return (
    <>
      <AlertGroup isToast>
        {alerts && alerts.map(alert => <Alert {...alert} />)}
      </AlertGroup>

      <Flex breakpointMods={[
        {
          modifier: FlexModifiers["justify-content-center"]
        }
      ]}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Flex>

      <TimeInput
        onChange={(time) => console.log('TimeInput onChange', time)}
      />
      <Countdown />

      <div>
        <Button variant="primary" onClick={onStart}>Start</Button>
        <Button variant="primary" onClick={onStop}>Stop</Button>
        <Button variant="primary" onClick={onPause}>Pause</Button>
        <Button variant="primary" onClick={onResume}>Resume</Button>
      </div>

      <Table aria-label="Laps" cells={cells} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>

    </>
  );
}
