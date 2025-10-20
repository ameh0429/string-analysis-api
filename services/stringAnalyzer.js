import crypto from 'crypto';

class StringAnalyzer {
  /**
   * Analyzes a string and computes all required properties
   * @param {string} value - The string to analyze
   * @returns {Object} Object containing all computed properties
   */
  analyze(value) {
    return {
      length: this.getLength(value),
      is_palindrome: this.isPalindrome(value),
      unique_characters: this.getUniqueCharacters(value),
      word_count: this.getWordCount(value),
      sha256_hash: this.getSHA256Hash(value),
      character_frequency_map: this.getCharacterFrequencyMap(value)
    };
  }

  /**
   * Get the length of the string
   */
  getLength(value) {
    return value.length;
  }

  /**
   * Check if string is a palindrome (case-insensitive)
   */
  isPalindrome(value) {
    const normalized = value.toLowerCase().replace(/\s/g, '');
    return normalized === normalized.split('').reverse().join('');
  }

  /**
   * Count distinct characters in the string
   */
  getUniqueCharacters(value) {
    return new Set(value).size;
  }

  /**
   * Count words separated by whitespace
   */
  getWordCount(value) {
    const trimmed = value.trim();
    if (trimmed === '') return 0;
    return trimmed.split(/\s+/).length;
  }

  /**
   * Generate SHA-256 hash of the string
   */
  getSHA256Hash(value) {
    return crypto.createHash('sha256').update(value).digest('hex');
  }

  /**
   * Create a frequency map of characters
   */
  getCharacterFrequencyMap(value) {
    const frequencyMap = {};
    for (const char of value) {
      frequencyMap[char] = (frequencyMap[char] || 0) + 1;
    }
    return frequencyMap;
  }
}

export default new StringAnalyzer();