import React, { useMemo } from 'react';

import { Table, TableHeader, TableBody } from '@patternfly/react-table';

import { Lap } from '../types';
import { getTimeWithMilliseconds } from '../utils/date';

interface LapTableProps {
  laps: Lap[],
}

const cells = [
  { title: 'Lap #' },
  { title: 'Lap delta' },
  { title: 'Lap date' },
  { title: 'Lap time' },
];

export default function LapTable({ laps }: LapTableProps) {

  const rows = useMemo(() => laps.map((lap, index) => ({
    cells: [
      laps.length - index,
      getTimeWithMilliseconds(lap.timeInMs),
      lap.at.toLocaleDateString(),
      lap.at.toLocaleTimeString(),
    ],
  })), [laps]);

  return (
    <Table aria-label="Laps" cells={cells} rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  )
}