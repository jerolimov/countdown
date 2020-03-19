import React from 'react';
import './App.css';

import { Button, TextInput, Form } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

function App() {

  const cells = [
    { title: 'Lap #' },
    { title: 'Lap time' },
  ];

  const rows = [
    { cells: [ '1', '123:12' ] },
    { cells: [ '2', '123:12' ] },
    { cells: [ '3', '123:12' ] },
  ];

  const onStart = () => console.warn('onStart');
  const onStop = () => console.warn('onStop');
  const onPause = () => console.warn('onPause');
  const onResume = () => console.warn('onResume');

  return (
    <div>

      <Form>
        <TextInput
          aria-label="Time input"
          type="time"
          css=""
          onChange={() => console.warn('x')}
        />

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

export default App;
