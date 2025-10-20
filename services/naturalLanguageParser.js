/**
 * Parses natural language queries into filter objects
 */
class NaturalLanguageParser {
  /**
   * Parse a natural language query into filters
   * @param {string} query - Natural language query
   * @returns {Object} Parsed filters
   */
  parse(query) {
    const normalizedQuery = query.toLowerCase().trim();
    const filters = {};

    // Check for palindrome
    if (this.containsKeyword(normalizedQuery, ['palindrome', 'palindromic'])) {
      filters.is_palindrome = true;
    }

    // Check for word count
    const wordCountMatch = this.parseWordCount(normalizedQuery);
    if (wordCountMatch !== null) {
      filters.word_count = wordCountMatch;
    }

    // Check for length constraints
    const lengthFilters = this.parseLengthConstraints(normalizedQuery);
    Object.assign(filters, lengthFilters);

    // Check for character contains
    const containsChar = this.parseContainsCharacter(normalizedQuery);
    if (containsChar) {
      filters.contains_character = containsChar;
    }

    return filters;
  }

  /**
   * Check if query contains any of the keywords
   */
  containsKeyword(query, keywords) {
    return keywords.some(keyword => query.includes(keyword));
  }

  /**
   * Parse word count from query
   */
  parseWordCount(query) {
    // Single word
    if (this.containsKeyword(query, ['single word', 'one word'])) {
      return 1;
    }
    
    // Two words
    if (this.containsKeyword(query, ['two word', 'double word'])) {
      return 2;
    }

    // Multiple words
    if (this.containsKeyword(query, ['three word'])) {
      return 3;
    }

    // Generic number pattern: "N words"
    const match = query.match(/(\d+)\s+words?/);
    if (match) {
      return parseInt(match[1], 10);
    }

    return null;
  }

  /**
   * Parse length constraints
   */
  parseLengthConstraints(query) {
    const filters = {};

    // "longer than N"
    const longerMatch = query.match(/longer than (\d+)/);
    if (longerMatch) {
      filters.min_length = parseInt(longerMatch[1], 10) + 1;
    }

    // "shorter than N"
    const shorterMatch = query.match(/shorter than (\d+)/);
    if (shorterMatch) {
      filters.max_length = parseInt(shorterMatch[1], 10) - 1;
    }

    // "at least N characters"
    const atLeastMatch = query.match(/at least (\d+) characters?/);
    if (atLeastMatch) {
      filters.min_length = parseInt(atLeastMatch[1], 10);
    }

    // "at most N characters"
    const atMostMatch = query.match(/at most (\d+) characters?/);
    if (atMostMatch) {
      filters.max_length = parseInt(atMostMatch[1], 10);
    }

    // "between N and M characters"
    const betweenMatch = query.match(/between (\d+) and (\d+)/);
    if (betweenMatch) {
      filters.min_length = parseInt(betweenMatch[1], 10);
      filters.max_length = parseInt(betweenMatch[2], 10);
    }

    return filters;
  }

  /**
   * Parse contains character constraint
   */
  parseContainsCharacter(query) {
    // "containing the letter X"
    const letterMatch = query.match(/containing (?:the )?letter ([a-z])/);
    if (letterMatch) {
      return letterMatch[1];
    }

    // "contain X" or "contains X"
    const containsMatch = query.match(/contains? ([a-z])\b/);
    if (containsMatch) {
      return containsMatch[1];
    }

    // "with the letter X"
    const withMatch = query.match(/with (?:the )?letter ([a-z])/);
    if (withMatch) {
      return withMatch[1];
    }

    // Special cases for vowels
    if (this.containsKeyword(query, ['first vowel'])) {
      return 'a';
    }
    if (this.containsKeyword(query, ['second vowel'])) {
      return 'e';
    }

    return null;
  }

  /**
   * Validate parsed filters for conflicts
   */
  validateFilters(filters) {
    // Check for conflicting length constraints
    if (filters.min_length !== undefined && 
        filters.max_length !== undefined && 
        filters.min_length > filters.max_length) {
      const error = new Error('Conflicting filters: min_length cannot be greater than max_length');
      error.status = 422;
      throw error;
    }

    return true;
  }
}

export default new NaturalLanguageParser();