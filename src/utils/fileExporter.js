/**
 * Export results to a formatted text file
 * @param {Array} results - Array of result objects with itemName, quantity, and values
 * @returns {void}
 * @throws {Error} If browser doesn't support required features or export fails
 */
export function exportToText(results) {
  // Validate input
  if (!results || !Array.isArray(results) || results.length === 0) {
    throw new Error('No results to export');
  }

  // Check browser compatibility for Blob
  if (typeof Blob === 'undefined') {
    throw new Error('Your browser does not support file downloads. Please use a modern browser.');
  }

  // Check browser compatibility for URL.createObjectURL
  if (typeof URL === 'undefined' || typeof URL.createObjectURL !== 'function') {
    throw new Error('Your browser does not support file downloads. Please use a modern browser.');
  }

  try {
    // Generate formatted text string with header and timestamp
    const timestamp = new Date().toLocaleString();
    let textContent = `Shadowrun Loot Generator Results\nGenerated: ${timestamp}\n\n`;

    // Format each result with item name, quantity, and values
    results.forEach((result, index) => {
      if (!result || !result.itemName || typeof result.quantity !== 'number' || !Array.isArray(result.values)) {
        console.warn(`Skipping invalid result at index ${index}`, result);
        return;
      }

      textContent += `${index + 1}. ${result.itemName} x${result.quantity}\n`;
      result.values.forEach(value => {
        textContent += `   - ${value}¥\n`;
      });
      textContent += '\n';
    });

    // Add summary
    const totalItems = results.reduce((sum, result) => {
      return sum + (typeof result.quantity === 'number' ? result.quantity : 0);
    }, 0);
    textContent += `Total Items: ${totalItems}\n`;

    // Create Blob with text/plain MIME type
    const blob = new Blob([textContent], { type: 'text/plain' });

    // Generate filename with timestamp
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `shadowrun-loot-${dateStr}.txt`;

    // Create temporary download link and trigger download
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    
    // Trigger download
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Clean up temporary link after download
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    }, 100);
  } catch (error) {
    console.error('Error during file export:', error);
    throw new Error(`Failed to export file: ${error.message}`);
  }
}
