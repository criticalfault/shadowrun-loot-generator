import { useState } from 'react';

function RollButton({ onRoll, disabled }) {
  const [rollCount, setRollCount] = useState(1);

  const handleRoll = () => {
    onRoll(rollCount);
  };

  const incrementCount = () => {
    setRollCount(prev => Math.min(20, prev + 1));
  };

  const decrementCount = () => {
    setRollCount(prev => Math.max(1, prev - 1));
  };

  return (
    <div className="d-flex align-items-center gap-3">
      <div className="d-flex align-items-center gap-2">
        <label htmlFor="rollCount" className="form-label mb-0">
          Number of Rolls:
        </label>
        <div className="input-group" style={{ width: '140px' }}>
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={decrementCount}
            disabled={disabled || rollCount <= 1}
          >
            <i className="bi bi-dash"></i>
          </button>
          <input
            type="number"
            id="rollCount"
            className="form-control text-center"
            min="1"
            max="20"
            value={rollCount}
            onChange={(e) => setRollCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
            disabled={disabled}
          />
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={incrementCount}
            disabled={disabled || rollCount >= 20}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      </div>
      <button
        className="btn btn-primary"
        onClick={handleRoll}
        disabled={disabled}
      >
        <i className="bi bi-dice-5"></i> Roll Loot
      </button>
    </div>
  );
}

export default RollButton;
