import stringAnalyzer from './stringAnalyzer.js';
import stringRepository from '../repositories/stringRepository.js';

class StringService {
  /**
   * Create and analyze a new string
   * @param {string} value - String to analyze
   * @returns {Object} Created string data
   * @throws {Error} If string already exists
   */
  createString(value) {
    // Check if already exists
    if (stringRepository.exists(value)) {
      const error = new Error('String already exists');
      error.status = 409;
      throw error;
    }

    // Analyze the string
    const properties = stringAnalyzer.analyze(value);

    // Create data object
    const data = {
      id: properties.sha256_hash,
      value,
      properties,
      created_at: new Date().toISOString()
    };

    // Save and return
    return stringRepository.save(data);
  }

  /**
   * Get a string by its value
   * @param {string} value - String to retrieve
   * @returns {Object} String data
   * @throws {Error} If not found
   */
  getStringByValue(value) {
    const result = stringRepository.findByValue(value);
    if (!result) {
      const error = new Error('String not found');
      error.status = 404;
      throw error;
    }
    return result;
  }

  /**
   * Get all strings with optional filters
   * @param {Object} filters - Filter criteria
   * @returns {Object} Filtered results with metadata
   */
  getAllStrings(filters = {}) {
    const results = stringRepository.filter(filters);
    return {
      data: results,
      count: results.length,
      filters_applied: filters
    };
  }

  /**
   * Delete a string by value
   * @param {string} value - String to delete
   * @throws {Error} If not found
   */
  deleteString(value) {
    const deleted = stringRepository.deleteByValue(value);
    if (!deleted) {
      const error = new Error('String not found');
      error.status = 404;
      throw error;
    }
  }
}

export default new StringService();