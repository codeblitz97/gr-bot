const fs = require('fs');

/**
 * Parses a file containing data entries and extracts relevant information.
 *
 * @param {string} filePath - The path to the file to be parsed.
 * @returns {Array} An array of objects representing parsed data entries.
 */
const parseFile = (filePath) => {
  /**
   * @typedef {Object} DataEntry
   * @property {number} amount - The amount associated with the data entry.
   * @property {string} serial - The serial number associated with the data entry.
   * @property {string} pin - The PIN associated with the data entry.
   */

  /** @type {Array<DataEntry>} */
  const dataEntries = [];

  // Read the file synchronously
  const rawData = fs.readFileSync(filePath, 'utf-8');

  // Split the raw data into lines
  const lines = rawData.split('\n');
  let currentEntry = null;

  // Iterate through each line
  for (const line of lines) {
    // Check if the line starts with 'amount:'
    if (line.trim().startsWith('amount:')) {
      // Create a new data entry object with the amount
      currentEntry = { amount: parseInt(line.split(':')[1].trim()) };
    } else if (line.trim().startsWith('serial:')) {
      // Add serial information to the current data entry
      currentEntry.serial = line.split(':')[1].trim();
    } else if (line.trim().startsWith('pin:')) {
      // Add PIN information to the current data entry and push it to the array
      currentEntry.pin = line.split(':')[1].trim();
      dataEntries.push(currentEntry);
      currentEntry = null; // Reset current entry
    }
  }

  return dataEntries;
};

exports.parseFile = parseFile;
