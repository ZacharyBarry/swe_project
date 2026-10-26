import { useState, type FormEvent } from 'react';
import {
  normalizePunchItemFields,
  validatePunchItemFields,
  type PunchItemFields,
} from './punchItems';

type PunchItemFormProps = {
  idPrefix: string;
  initialValues: PunchItemFields;
  submitLabel: string;
  onSave: (fields: PunchItemFields) => void;
  onCancel?: () => void;
  resetAfterSave?: boolean;
};

export function PunchItemForm({
  idPrefix,
  initialValues,
  submitLabel,
  onSave,
  onCancel,
  resetAfterSave = false,
}: PunchItemFormProps) {
  const [fields, setFields] = useState(initialValues);
  const [error, setError] = useState('');

  function updateField(field: keyof PunchItemFields, value: string) {
    setFields((current) => ({ ...current, [field]: value }));
    setError('');
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizePunchItemFields(fields);
    const validationError = validatePunchItemFields(normalized);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSave(normalized);
    setError('');
    if (resetAfterSave) setFields(initialValues);
  }

  return (
    <form onSubmit={submit}>
      <label htmlFor={`${idPrefix}-title`}>Title</label>
      <input
        id={`${idPrefix}-title`}
        value={fields.title}
        onChange={(event) => updateField('title', event.target.value)}
        maxLength={150}
        required
      />
      <label htmlFor={`${idPrefix}-description`}>Description</label>
      <textarea
        id={`${idPrefix}-description`}
        value={fields.description}
        onChange={(event) => updateField('description', event.target.value)}
        rows={4}
        required
      />
      <label htmlFor={`${idPrefix}-room-location`}>Room / location (optional)</label>
      <input
        id={`${idPrefix}-room-location`}
        value={fields.roomLocation}
        onChange={(event) => updateField('roomLocation', event.target.value)}
        maxLength={150}
      />
      <label htmlFor={`${idPrefix}-category`}>Category (optional)</label>
      <input
        id={`${idPrefix}-category`}
        value={fields.category}
        onChange={(event) => updateField('category', event.target.value)}
        maxLength={60}
      />
      {error && <p className="punch-list-error" role="alert">{error}</p>}
      <div className="punch-list-actions">
        <button type="submit">{submitLabel}</button>
        {onCancel && (
          <button type="button" className="punch-list-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
