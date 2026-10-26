import { useEffect, useState } from 'react';
import { filterPunchItems, filterValues, type PunchItemStatusFilter } from './filterPunchItems';
import { PunchItemForm } from './PunchItemForm';
import { PunchItemDetails } from './PunchItemDetails';
import {
  emptyPunchItemFields,
  punchItemStatuses,
  type PunchItem,
  type PunchItemFields,
  type PunchItemStatus,
} from './punchItems';
import './punchList.css';

type PunchListPageProps = {
  items: PunchItem[];
  onAddItem: (fields: PunchItemFields) => void;
  onEditItem: (id: string, fields: PunchItemFields) => void;
  onAttachImage: (id: string, file: File) => void;
  onRemoveImage: (id: string, attachmentId: string) => void;
  onStatusChange: (id: string, status: PunchItemStatus) => void;
};

export function PunchListPage({
  items,
  onAddItem,
  onEditItem,
  onAttachImage,
  onRemoveImage,
  onStatusChange,
}: PunchListPageProps) {
  const [statusFilter, setStatusFilter] = useState<PunchItemStatusFilter>('All');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (categoryFilter && !items.some((item) => item.category === categoryFilter)) {
      setCategoryFilter('');
    }
    if (locationFilter && !items.some((item) => item.roomLocation === locationFilter)) {
      setLocationFilter('');
    }
  }, [items, categoryFilter, locationFilter]);

  const matchingItems = filterPunchItems(
    items,
    statusFilter,
    search,
    categoryFilter,
    locationFilter
  );
  const selectedItem = items.find((item) => item.id === selectedId);

  return (
    <div className="punch-list">
      <section className="punch-list-panel" aria-labelledby="new-item-heading">
        <h2 id="new-item-heading">Add an item</h2>
        <PunchItemForm
          idPrefix="new-item"
          initialValues={emptyPunchItemFields}
          submitLabel="Add item"
          onSave={onAddItem}
          resetAfterSave
        />
      </section>

      <section className="punch-list-panel" aria-labelledby="items-heading">
        <h2 id="items-heading">Items ({items.length})</h2>
        <div className="punch-list-filters">
          <label>
            Filter by status
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as PunchItemStatusFilter)
              }
            >
              <option value="All">All</option>
              {punchItemStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label>
            Search items
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Title or description"
            />
          </label>
          <label>
            Filter by category
            <select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}>
              <option value="">All categories</option>
              {filterValues(items, 'category').map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Filter by room / location
            <select value={locationFilter} onChange={(event) => setLocationFilter(event.target.value)}>
              <option value="">All locations</option>
              {filterValues(items, 'roomLocation').map((location) => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>
          </label>
        </div>
        <p className="punch-list-count" role="status">
          {matchingItems.length} matching {matchingItems.length === 1 ? 'item' : 'items'}
        </p>
        {items.length === 0 ? (
          <p className="punch-list-empty">No items yet. Add one using the form.</p>
        ) : matchingItems.length === 0 ? (
          <p className="punch-list-empty">No items match your filters.</p>
        ) : (
          <ul className="punch-list-items">
            {matchingItems.map((item) => (
              <li key={item.id} className="punch-list-item">
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <p className="punch-list-item-meta">
                    {item.roomLocation || 'No location'} · {item.category || 'No category'}
                  </p>
                  <button
                    type="button"
                    className="punch-list-view"
                    onClick={() => setSelectedId(item.id)}
                    aria-label={`View details for ${item.title}`}
                  >
                    View details
                  </button>
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
      {selectedItem ? (
        <PunchItemDetails
          key={selectedItem.id}
          item={selectedItem}
          onEditItem={onEditItem}
          onAttachImage={onAttachImage}
          onRemoveImage={onRemoveImage}
          onStatusChange={onStatusChange}
        />
      ) : (
        <section className="punch-list-panel" aria-labelledby="item-details-heading">
          <h2 id="item-details-heading">Item details</h2>
          <p className="punch-list-empty">
            {items.length === 0
              ? 'Add an item to see its details here.'
              : 'Select an item to see its details here.'}
          </p>
        </section>
      )}
      <p className="punch-list-note">Items are kept only until this page is refreshed.</p>
    </div>
  );
}
