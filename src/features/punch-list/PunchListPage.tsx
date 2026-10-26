import { useState, type FormEvent } from 'react';
import './punchList.css';

export const punchItemStatuses = [
  'Open',
  'In Progress',
  'Ready for Review',
] as const;

export type PunchItemStatus = (typeof punchItemStatuses)[number];

export type PunchItem = {
  id: string;
  title: string;
  description: string;
  status: PunchItemStatus;
};

type PunchListPageProps = {
  items: PunchItem[];
  onAddItem: (title: string, description: string) => void;
  onStatusChange: (id: string, status: PunchItemStatus) => void;
};

export function PunchListPage({
  items,
  onAddItem,
  onStatusChange,
}: PunchListPageProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  function addItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription) {
      setError('Enter a title and description.');
      return;
    }

    onAddItem(trimmedTitle, trimmedDescription);
    setTitle('');
    setDescription('');
    setError('');
  }

  return (
    <div className="punch-list">
      <section className="punch-list-panel" aria-labelledby="new-item-heading">
        <h2 id="new-item-heading">Add an item</h2>
        <form onSubmit={addItem}>
          <label htmlFor="punch-title">Title</label>
          <input
            id="punch-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={150}
            required
          />
          <label htmlFor="punch-description">Description</label>
          <textarea
            id="punch-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={4}
            required
          />
          {error && <p className="punch-list-error" role="alert">{error}</p>}
          <button type="submit">Add item</button>
        </form>
      </section>

      <section className="punch-list-panel" aria-labelledby="items-heading">
        <h2 id="items-heading">Items ({items.length})</h2>
        {items.length === 0 ? (
          <p className="punch-list-empty">No items yet. Add one using the form.</p>
        ) : (
          <ul className="punch-list-items">
            {items.map((item) => (
              <li key={item.id} className="punch-list-item">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
                <label>
                  Status
                  <select
                    value={item.status}
                    onChange={(event) =>
                      onStatusChange(
                        item.id,
                        event.target.value as PunchItemStatus
                      )
                    }
                  >
                    {punchItemStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="punch-list-note">Items are kept only until this page is refreshed.</p>
    </div>
  );
}
