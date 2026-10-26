import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterPunchItems } from './filterPunchItems';
import type { PunchItem } from './PunchListPage';

const items: PunchItem[] = [
  { id: '1', title: 'Door closer', description: 'Room 210', status: 'Open' },
  { id: '2', title: 'Paint wall', description: 'North corridor', status: 'In Progress' },
  { id: '3', title: 'Inspect door', description: 'Room 310', status: 'Ready for Review' },
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
