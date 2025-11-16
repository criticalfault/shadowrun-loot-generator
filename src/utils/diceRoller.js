/**
 * Rolls dice based on a formula string
 * Supports formats:
 * - "N" - Fixed number (e.g., "5")
 * - "NdS" - Roll N dice with S sides (e.g., "1d6")
 * - "NdSxM" - Roll N dice with S sides and multiply by M (e.g., "1d6x50")
 * 
 * @param {string} formula - The dice formula to evaluate
 * @returns {number} The result of the dice roll
 * @throws {Error} If the formula is invalid
 */
export function rollDice(formula) {
  if (!formula || typeof formula !== 'string') {
    throw new Error('Invalid formula: formula must be a non-empty string');
  }

  const trimmedFormula = formula.trim();

  // Check for fixed number (e.g., "5")
  const fixedMatch = trimmedFormula.match(/^(\d+)$/);
  if (fixedMatch) {
    return parseInt(fixedMatch[1], 10);
  }

  // Check for dice formula (e.g., "1d6" or "1d6x50")
  const diceMatch = trimmedFormula.match(/^(\d+)d(\d+)(?:x(\d+))?$/i);
  if (!diceMatch) {
    throw new Error(`Invalid dice formula: ${formula}`);
  }

  const numDice = parseInt(diceMatch[1], 10);
  const sides = parseInt(diceMatch[2], 10);
  const multiplier = diceMatch[3] ? parseInt(diceMatch[3], 10) : 1;

  // Validate dice parameters
  if (numDice < 1) {
    throw new Error(`Invalid number of dice: ${numDice} (must be at least 1)`);
  }
  if (sides < 1) {
    throw new Error(`Invalid number of sides: ${sides} (must be at least 1)`);
  }
  if (multiplier < 1) {
    throw new Error(`Invalid multiplier: ${multiplier} (must be at least 1)`);
  }

  // Roll the dice
  let sum = 0;
  for (let i = 0; i < numDice; i++) {
    sum += Math.floor(Math.random() * sides) + 1;
  }

  // Apply multiplier
  return sum * multiplier;
}
