import React, { useReducer, useEffect, useMemo } from 'react';
import './App.css';

import { Button, Form } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

import TimeInput from './TimeInput';

export default function App() {

  const cells = [
    { title: 'Lap #' },
    { title: 'Lap time' },
  ];

  const rows = [
    { cells: [ '1', '123:12' ] },
    { cells: [ '2', '123:12' ] },
    { cells: [ '3', '123:12' ] },
  ];

  const [state, dispatch] = useReducer((prevState: any, action: any) => {
    console.log('reduce', {
      action,
      prevState,
    })
    switch (action.type) {
      case 'START':
        return { started: true };
      case 'STOP':
        return { started: false };
      case 'PAUSE':
        return { started: false };
      case 'RESUME':
        return { started: true };
      case 'SPACE_PRESSED':
        return { started: true };
      case 'BACKSPACE_PRESSED':
        return { started: true };
      default:
        console.warn(`Unknown action type: ${action.type}`, action);
        return prevState;
    }
  }, { started: false });

  const onStart = () => dispatch({ type: 'START' });
  const onStop = () => dispatch({ type: 'STOP' });
  const onPause = () => dispatch({ type: 'PAUSE' });
  const onResume = () => dispatch({ type: 'RESUME' });

  const currentTime = Date.now();

  const onKeyPress = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      dispatch({ type: 'SPACE_PRESSED' });
    }
  }, []);

  const onKeyUp = useMemo(() => (e: KeyboardEvent) => {
    if (e.code === 'Backspace') {
      dispatch({ type: 'BACKSPACE_PRESSED' });
    }
  }, []);

  useEffect(() => {
    console.warn('mount');
    document.addEventListener('keypress', onKeyPress);
    document.addEventListener('keyup', onKeyUp);
    return () => {
      console.warn('unmount');
      document.removeEventListener('keypress', onKeyPress);
      document.removeEventListener('keyup', onKeyUp);
    };
  });

  return (
    <div>

      <Form>

        <TimeInput
          onChange={(time) => console.log('TimeInput onChange', time)}
        />

        <div>
          Last rendered
          {currentTime}
        </div>
        <div>
          {JSON.stringify(state)}
        </div>

        <Button variant="primary" onClick={onStart}>Start</Button>
        <Button variant="primary" onClick={onStop}>Stop</Button>
        <Button variant="primary" onClick={onPause}>Pause</Button>
        <Button variant="primary" onClick={onResume}>Resume</Button>
      </Form>

      <Table aria-label="Laps" cells={cells} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>

    </div>
  );
}
