import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  addPunchItemAttachment,
  createPunchItem,
  isSupportedImage,
  normalizePunchItemFields,
  removePunchItemAttachment,
  updatePunchItemFields,
  validatePunchItemFields,
} from './punchItems';

const fields = {
  title: 'Door closer',
  description: 'Does not close fully',
  roomLocation: 'Room 210',
  category: 'Doors',
};

test('new and edited items retain their identity, status, and images', () => {
  const first = createPunchItem('item-1', fields);
  const second = createPunchItem('item-2', { ...fields, title: 'Window' });
  assert.equal(first.status, 'Open');
  assert.deepEqual(first.attachments, []);

  const photo = new File(['image data'], 'door.png', { type: 'image/png' });
  const withImage = addPunchItemAttachment([first, second], first.id, {
    id: 'image-1',
    file: photo,
  });
  const updated = updatePunchItemFields(withImage, first.id, {
    ...fields,
    title: 'Adjusted door closer',
    roomLocation: '',
  });

  assert.equal(updated[0].title, 'Adjusted door closer');
  assert.equal(updated[0].roomLocation, '');
  assert.equal(updated[0].status, 'Open');
  assert.equal(updated[0].attachments[0].file, photo);
  assert.equal(updated[1], second);
  assert.equal(first.title, 'Door closer');
});

test('removing an image affects only that attachment and item', () => {
  const first = createPunchItem('item-1', fields);
  const second = createPunchItem('item-2', { ...fields, title: 'Window' });
  const photo = new File(['image data'], 'door.png', { type: 'image/png' });
  const otherPhoto = new File(['image data'], 'hinge.jpg', { type: 'image/jpeg' });
  const withFirstImage = addPunchItemAttachment([first, second], first.id, {
    id: 'image-1', file: photo,
  });
  const withBothImages = addPunchItemAttachment(withFirstImage, first.id, {
    id: 'image-2', file: otherPhoto,
  });
  const removed = removePunchItemAttachment(withBothImages, first.id, 'image-1');

  assert.deepEqual(removed[0].attachments.map((image) => image.id), ['image-2']);
  assert.equal(removed[1], second);
  assert.deepEqual(withBothImages[0].attachments.map((image) => image.id), ['image-1', 'image-2']);
});

test('required fields and JPEG/PNG attachments are validated', () => {
  const normalized = normalizePunchItemFields({
    title: '  Door closer  ',
    description: '  Check hinge  ',
    roomLocation: '  Room 210  ',
    category: '  Doors  ',
  });
  assert.deepEqual(normalized, {
    title: 'Door closer',
    description: 'Check hinge',
    roomLocation: 'Room 210',
    category: 'Doors',
  });
  assert.equal(validatePunchItemFields(normalized), null);
  assert.ok(validatePunchItemFields({ ...normalized, description: '' }));
  assert.ok(validatePunchItemFields({ ...normalized, category: 'x'.repeat(61) }));
  assert.equal(isSupportedImage(new File(['x'], 'door.jpg', { type: 'image/jpeg' })), true);
  assert.equal(isSupportedImage(new File(['x'], 'door.png', { type: 'image/png' })), true);
  assert.equal(isSupportedImage(new File(['x'], 'door.gif', { type: 'image/gif' })), false);
  assert.equal(isSupportedImage(new File([], 'empty.png', { type: 'image/png' })), false);
});
