import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterPunchItems, filterValues } from './filterPunchItems';
import type { PunchItem } from './punchItems';

const items: PunchItem[] = [
  { id: '1', title: 'Door closer', description: 'Needs adjustment', roomLocation: 'Room 210', category: 'Doors', status: 'Open', attachments: [] },
  { id: '2', title: 'Paint wall', description: 'North corridor', roomLocation: 'Room 210', category: 'Paint', status: 'In Progress', attachments: [] },
  { id: '3', title: 'Inspect door', description: 'Room 310', roomLocation: 'Room 310', category: 'Doors', status: 'Ready for Review', attachments: [] },
];

test('filters by status and searches titles or descriptions without changing the source list', () => {
  assert.deepEqual(filterPunchItems(items, 'All', ''), items);
  assert.deepEqual(filterPunchItems(items, 'Open', ''), [items[0]]);
  assert.deepEqual(filterPunchItems(items, 'In Progress', ''), [items[1]]);
  assert.deepEqual(filterPunchItems(items, 'Ready for Review', ''), [items[2]]);
  assert.deepEqual(filterPunchItems(items, 'All', ' DOOR '), [items[0], items[2]]);
  assert.deepEqual(filterPunchItems(items, 'In Progress', 'CORRIDOR'), [items[1]]);
  assert.deepEqual(filterPunchItems(items, 'Open', 'corridor'), []);
  assert.equal(items.length, 3);
});

test('category and location filters combine with search and status', () => {
  assert.deepEqual(filterPunchItems(items, 'All', '', 'Doors'), [items[0], items[2]]);
  assert.deepEqual(filterPunchItems(items, 'All', '', '', 'Room 210'), [items[0], items[1]]);
  assert.deepEqual(filterPunchItems(items, 'Open', 'adjustment', 'Doors', 'Room 210'), [items[0]]);
  assert.deepEqual(filterPunchItems(items, 'In Progress', 'door', 'Doors', 'Room 210'), []);
  assert.deepEqual(filterValues(items, 'category'), ['Doors', 'Paint']);
  assert.deepEqual(filterValues(items, 'roomLocation'), ['Room 210', 'Room 310']);
});
