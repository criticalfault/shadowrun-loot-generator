import React from 'react';

function LootListSelector({ lootLists, selectedLists, onSelectionChange }) {
  const handleCheckboxChange = (listId) => {
    try {
      onSelectionChange(listId);
    } catch (error) {
      console.error('Error changing selection:', error);
    }
  };

  // Handle empty or invalid loot lists
  if (!lootLists || !Array.isArray(lootLists)) {
    return (
      <div className="loot-list-selector">
        <h5 className="mb-3">Select Loot Lists:</h5>
        <p className="text-muted">No loot lists available.</p>
      </div>
    );
  }

  if (lootLists.length === 0) {
    return (
      <div className="loot-list-selector">
        <h5 className="mb-3">Select Loot Lists:</h5>
        <p className="text-muted">No loot lists configured. Please add loot lists to get started.</p>
      </div>
    );
  }

  return (
    <div className="loot-list-selector">
      <h5 className="mb-3">Select Loot Lists:</h5>
      {lootLists.map((list) => {
        // Validate list data
        if (!list || !list.id || !list.name) {
          console.warn('Invalid list data:', list);
          return null;
        }

        return (
          <div key={list.id} className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id={`list-${list.id}`}
              checked={selectedLists.includes(list.id)}
              onChange={() => handleCheckboxChange(list.id)}
            />
            <label className="form-check-label" htmlFor={`list-${list.id}`}>
              {list.name}
              {list.items && list.items.length > 0 && (
                <span className="text-muted ms-2">({list.items.length} items)</span>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default LootListSelector;
