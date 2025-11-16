import PropTypes from 'prop-types'
import ResultItem from './ResultItem'

function ResultsList({ results, onReorder, onDelete, onExport, onClear }) {
  // Handle invalid results prop
  if (!results || !Array.isArray(results)) {
    return (
      <div>
        <p className="text-danger">Error: Invalid results data</p>
      </div>
    )
  }

  // Display empty state message when no results exist
  if (results.length === 0) {
    return (
      <div>
        <p className="text-muted">No results yet. Select lists and roll to generate loot!</p>
      </div>
    )
  }

  return (
    <div>
      {/* Render list of ResultItem components */}
      <div className="list-group mb-3">
        {results.map((result, index) => {
          // Validate result data before rendering
          if (!result || !result.id) {
            console.warn('Invalid result at index', index, result);
            return null;
          }

          return (
            <ResultItem
              key={result.id}
              result={result}
              index={index}
              isFirst={index === 0}
              isLast={index === results.length - 1}
              onMoveUp={onReorder}
              onMoveDown={onReorder}
              onDelete={onDelete}
            />
          );
        })}
      </div>

      {/* Render export and clear buttons at bottom with Bootstrap styling */}
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onExport}
        >
          <i className="bi bi-download me-2"></i>
          Save to File
        </button>
        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onClear}
        >
          <i className="bi bi-trash me-2"></i>
          Clear All
        </button>
      </div>
    </div>
  )
}

ResultsList.propTypes = {
  results: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      itemName: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      values: PropTypes.arrayOf(PropTypes.number).isRequired,
      timestamp: PropTypes.number.isRequired
    })
  ).isRequired,
  onReorder: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onExport: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired
}

export default ResultsList
