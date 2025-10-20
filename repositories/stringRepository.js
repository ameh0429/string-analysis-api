/**
 * In-memory storage for analyzed strings
 * In production, this would be replaced with a proper database
 */
class StringRepository {
  constructor() {
    // Map: hash -> string data
    this.strings = new Map();
    // Map: original value -> hash (for quick lookup)
    this.valueIndex = new Map();
  }

  /**
   * Save a new analyzed string
   * @param {Object} data - String data to save
   * @returns {Object} Saved data
   */
  save(data) {
    this.strings.set(data.id, data);
    this.valueIndex.set(data.value, data.id);
    return data;
  }

  /**
   * Find by original string value
   * @param {string} value - The original string
   * @returns {Object|null} String data or null
   */
  findByValue(value) {
    const hash = this.valueIndex.get(value);
    if (!hash) return null;
    return this.strings.get(hash);
  }

  /**
   * Check if string exists
   * @param {string} value - The original string
   * @returns {boolean}
   */
  exists(value) {
    return this.valueIndex.has(value);
  }

  /**
   * Get all strings
   * @returns {Array} Array of all string data
   */
  findAll() {
    return Array.from(this.strings.values());
  }

  /**
   * Filter strings based on criteria
   * @param {Object} filters - Filter criteria
   * @returns {Array} Filtered strings
   */
  filter(filters) {
    let results = this.findAll();

    if (filters.is_palindrome !== undefined) {
      results = results.filter(s => 
        s.properties.is_palindrome === filters.is_palindrome
      );
    }

    if (filters.min_length !== undefined) {
      results = results.filter(s => 
        s.properties.length >= filters.min_length
      );
    }

    if (filters.max_length !== undefined) {
      results = results.filter(s => 
        s.properties.length <= filters.max_length
      );
    }

    if (filters.word_count !== undefined) {
      results = results.filter(s => 
        s.properties.word_count === filters.word_count
      );
    }

    if (filters.contains_character !== undefined) {
      const char = filters.contains_character;
      results = results.filter(s => s.value.includes(char));
    }

    return results;
  }

  /**
   * Delete a string by value
   * @param {string} value - The original string
   * @returns {boolean} True if deleted, false if not found
   */
  deleteByValue(value) {
    const hash = this.valueIndex.get(value);
    if (!hash) return false;
    
    this.strings.delete(hash);
    this.valueIndex.delete(value);
    return true;
  }
}

export default new StringRepository();