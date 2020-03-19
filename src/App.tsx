import React from 'react';
import './App.css';

import { Button, TextInput, Form } from '@patternfly/react-core';
import { Table, TableHeader, TableBody } from '@patternfly/react-table';

function App() {

  const cells = [
    { title: 'Lab #' },
    { title: 'Lab time' },
  ];

  const rows = [
    { cells: [ '1', '123:12' ] },
    { cells: [ '2', '123:12' ] },
    { cells: [ '3', '123:12' ] },
  ];

  return (
    <div>

      <Form>
        <TextInput type="time" css="" onChange={() => console.warn('x')} />

        <Button variant="primary">Start</Button>
        <Button variant="primary">Stop</Button>
        <Button variant="primary">Pause</Button>
        <Button variant="primary">Resume</Button>
      </Form>

      <Table cells={cells} rows={rows}>
        <TableHeader />
        <TableBody />
      </Table>

    </div>
  );
}

export default App;
