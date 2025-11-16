import PropTypes from 'prop-types'

function ResultItem({ result, index, isFirst, isLast, onMoveUp, onMoveDown, onDelete }) {
  // Validate result data
  if (!result) {
    return (
      <div className="list-group-item">
        <span className="text-danger">Error: Invalid result data</span>
      </div>
    );
  }

  const itemName = result.itemName || 'Unknown Item';
  const listName = result.listName || null;
  const quantity = typeof result.quantity === 'number' ? result.quantity : 0;
  const values = Array.isArray(result.values) ? result.values : [];

  const handleMoveUp = () => {
    try {
      onMoveUp(index, 'up');
    } catch (error) {
      console.error('Error moving item up:', error);
    }
  };

  const handleMoveDown = () => {
    try {
      onMoveDown(index, 'down');
    } catch (error) {
      console.error('Error moving item down:', error);
    }
  };

  const handleDelete = () => {
    try {
      onDelete(index);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <div className="list-group-item">
      <div className="d-flex justify-content-between align-items-start">
        <div className="flex-grow-1">
          <strong>{listName && `[${listName}] `}{itemName}</strong> x{quantity}
          <div className="text-muted small">
            {values.length > 0 ? (
              <>Values: {values.map(v => `${v}¥`).join(', ')}</>
            ) : (
              <span className="text-warning">No values</span>
            )}
          </div>
        </div>
        
        <div className="btn-group btn-group-sm ms-3" role="group">
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleMoveUp}
            disabled={isFirst}
            title="Move up"
          >
            <i className="bi bi-arrow-up"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleMoveDown}
            disabled={isLast}
            title="Move down"
          >
            <i className="bi bi-arrow-down"></i>
          </button>
          <button
            type="button"
            className="btn btn-outline-danger"
            onClick={handleDelete}
            title="Delete"
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>
  )
}

ResultItem.propTypes = {
  result: PropTypes.shape({
    id: PropTypes.string.isRequired,
    itemName: PropTypes.string.isRequired,
    listName: PropTypes.string,
    quantity: PropTypes.number.isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    timestamp: PropTypes.number.isRequired
  }).isRequired,
  index: PropTypes.number.isRequired,
  isFirst: PropTypes.bool.isRequired,
  isLast: PropTypes.bool.isRequired,
  onMoveUp: PropTypes.func.isRequired,
  onMoveDown: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default ResultItem
