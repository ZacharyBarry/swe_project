export const punchItemStatuses = [
  'Open',
  'In Progress',
  'Ready for Review',
] as const;

export type PunchItemStatus = (typeof punchItemStatuses)[number];

export type PunchItemFields = {
  title: string;
  description: string;
  roomLocation: string;
  category: string;
};

export type PunchItemAttachment = {
  id: string;
  file: File;
};

export type PunchItem = PunchItemFields & {
  id: string;
  status: PunchItemStatus;
  attachments: PunchItemAttachment[];
};

export const emptyPunchItemFields: PunchItemFields = {
  title: '',
  description: '',
  roomLocation: '',
  category: '',
};

export function normalizePunchItemFields(fields: PunchItemFields): PunchItemFields {
  return {
    title: fields.title.trim(),
    description: fields.description.trim(),
    roomLocation: fields.roomLocation.trim(),
    category: fields.category.trim(),
  };
}

export function validatePunchItemFields(fields: PunchItemFields): string | null {
  if (!fields.title || !fields.description) {
    return 'Enter a title and description.';
  }
  if (fields.title.length > 150 || fields.roomLocation.length > 150 || fields.category.length > 60) {
    return 'Title and room/location must be 150 characters or less; category must be 60 characters or less.';
  }
  return null;
}

export function createPunchItem(id: string, fields: PunchItemFields): PunchItem {
  return { id, ...fields, status: 'Open', attachments: [] };
}

export function updatePunchItemFields(
  items: PunchItem[],
  id: string,
  fields: PunchItemFields
): PunchItem[] {
  return items.map((item) => (item.id === id ? { ...item, ...fields } : item));
}

export function addPunchItemAttachment(
  items: PunchItem[],
  id: string,
  attachment: PunchItemAttachment
): PunchItem[] {
  return items.map((item) =>
    item.id === id
      ? { ...item, attachments: [...item.attachments, attachment] }
      : item
  );
}

export function removePunchItemAttachment(
  items: PunchItem[],
  id: string,
  attachmentId: string
): PunchItem[] {
  return items.map((item) =>
    item.id === id
      ? {
          ...item,
          attachments: item.attachments.filter((attachment) => attachment.id !== attachmentId),
        }
      : item
  );
}

export function isSupportedImage(file: File): boolean {
  return file.size > 0 && (file.type === 'image/jpeg' || file.type === 'image/png');
}
