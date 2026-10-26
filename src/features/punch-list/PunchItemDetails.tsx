import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { PunchItemForm } from './PunchItemForm';
import {
  isSupportedImage,
  punchItemStatuses,
  type PunchItem,
  type PunchItemAttachment,
  type PunchItemFields,
  type PunchItemStatus,
} from './punchItems';

type PunchItemDetailsProps = {
  item: PunchItem;
  onEditItem: (id: string, fields: PunchItemFields) => void;
  onAttachImage: (id: string, file: File) => void;
  onRemoveImage: (id: string, attachmentId: string) => void;
  onStatusChange: (id: string, status: PunchItemStatus) => void;
};

function ImagePreview({
  attachment,
  onRemove,
}: {
  attachment: PunchItemAttachment;
  onRemove: () => void;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const previewUrl = URL.createObjectURL(attachment.file);
    setUrl(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [attachment.file]);

  return (
    <li className="punch-list-attachment">
      {error ? (
        <p role="alert">Preview unavailable for {attachment.file.name}.</p>
      ) : url ? (
        <img
          src={url}
          alt={`Attached image: ${attachment.file.name}`}
          onError={() => setError(true)}
        />
      ) : (
        <p>Loading preview...</p>
      )}
      <span>{attachment.file.name}</span>
      <button
        type="button"
        className="punch-list-secondary"
        onClick={onRemove}
        aria-label={`Remove ${attachment.file.name}`}
      >
        Remove image
      </button>
    </li>
  );
}

export function PunchItemDetails({
  item,
  onEditItem,
  onAttachImage,
  onRemoveImage,
  onStatusChange,
}: PunchItemDetailsProps) {
  const [editing, setEditing] = useState(false);
  const [imageError, setImageError] = useState('');
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    heading.current?.focus();
  }, []);

  function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (!isSupportedImage(file)) {
      setImageError('Choose a non-empty JPEG or PNG image.');
      return;
    }
    setImageError('');
    onAttachImage(item.id, file);
  }

  function save(fields: PunchItemFields) {
    onEditItem(item.id, fields);
    setEditing(false);
  }

  return (
    <section className="punch-list-panel punch-list-details" aria-labelledby="item-details-heading">
      <h2 id="item-details-heading" ref={heading} tabIndex={-1}>Item details</h2>
      {editing ? (
        <PunchItemForm
          key={item.id}
          idPrefix="edit-item"
          initialValues={item}
          submitLabel="Save changes"
          onSave={save}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <>
          <h3>{item.title}</h3>
          <dl className="punch-list-details-fields">
            <div>
              <dt>Description</dt>
              <dd>{item.description}</dd>
            </div>
            <div>
              <dt>Room / location</dt>
              <dd>{item.roomLocation || 'Not specified'}</dd>
            </div>
            <div>
              <dt>Category</dt>
              <dd>{item.category || 'Not specified'}</dd>
            </div>
          </dl>
          <label className="punch-list-detail-status">
            Status
            <select
              value={item.status}
              onChange={(event) =>
                onStatusChange(item.id, event.target.value as PunchItemStatus)
              }
            >
              {punchItemStatuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </label>
          <button type="button" className="punch-list-edit" onClick={() => setEditing(true)}>
            Edit item
          </button>
        </>
      )}
      <div className="punch-list-attachments">
        <h3>Images ({item.attachments.length})</h3>
        <label htmlFor="punch-item-image">Attach a JPEG or PNG image</label>
        <input
          id="punch-item-image"
          type="file"
          accept="image/jpeg,image/png"
          onChange={chooseImage}
        />
        {imageError && <p className="punch-list-error" role="alert">{imageError}</p>}
        {item.attachments.length === 0 ? (
          <p className="punch-list-empty">No images attached to this item.</p>
        ) : (
          <ul className="punch-list-attachment-list">
            {item.attachments.map((attachment) => (
              <ImagePreview
                key={attachment.id}
                attachment={attachment}
                onRemove={() => onRemoveImage(item.id, attachment.id)}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
