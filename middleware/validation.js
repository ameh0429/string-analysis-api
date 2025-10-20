/**
 * Validation middleware for request data
 */

/**
 * Validate string creation request
 */
export const validateStringCreation = (req, res, next) => {
  const { value } = req.body;

  // Check if body exists
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({
      error: 'Invalid request body',
      message: 'Request body must be a valid JSON object'
    });
  }

  // Check if value field exists
  if (!('value' in req.body)) {
    return res.status(400).json({
      error: 'Missing required field',
      message: 'The "value" field is required'
    });
  }

  // Check if value is a string
  if (typeof value !== 'string') {
    return res.status(422).json({
      error: 'Invalid data type',
      message: 'The "value" field must be a string'
    });
  }

  next();
};

/**
 * Validate query parameters for filtering
 */
export const validateFilterParams = (req, res, next) => {
  const { is_palindrome, min_length, max_length, word_count, contains_character } = req.query;

  try {
    const filters = {};

    // Validate is_palindrome
    if (is_palindrome !== undefined) {
      if (is_palindrome !== 'true' && is_palindrome !== 'false') {
        return res.status(400).json({
          error: 'Invalid parameter',
          message: 'is_palindrome must be "true" or "false"'
        });
      }
      filters.is_palindrome = is_palindrome === 'true';
    }

    // Validate min_length
    if (min_length !== undefined) {
      const minLen = parseInt(min_length, 10);
      if (isNaN(minLen) || minLen < 0) {
        return res.status(400).json({
          error: 'Invalid parameter',
          message: 'min_length must be a non-negative integer'
        });
      }
      filters.min_length = minLen;
    }

    // Validate max_length
    if (max_length !== undefined) {
      const maxLen = parseInt(max_length, 10);
      if (isNaN(maxLen) || maxLen < 0) {
        return res.status(400).json({
          error: 'Invalid parameter',
          message: 'max_length must be a non-negative integer'
        });
      }
      filters.max_length = maxLen;
    }

    // Validate word_count
    if (word_count !== undefined) {
      const wc = parseInt(word_count, 10);
      if (isNaN(wc) || wc < 0) {
        return res.status(400).json({
          error: 'Invalid parameter',
          message: 'word_count must be a non-negative integer'
        });
      }
      filters.word_count = wc;
    }

    // Validate contains_character
    if (contains_character !== undefined) {
      if (typeof contains_character !== 'string' || contains_character.length !== 1) {
        return res.status(400).json({
          error: 'Invalid parameter',
          message: 'contains_character must be a single character'
        });
      }
      filters.contains_character = contains_character;
    }

    // Attach parsed filters to request
    req.filters = filters;
    next();
  } catch (error) {
    return res.status(400).json({
      error: 'Invalid parameters',
      message: error.message
    });
  }
};

/**
 * Validate natural language query parameter
 */
export const validateNaturalLanguageQuery = (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      error: 'Missing query parameter',
      message: 'The "query" parameter is required'
    });
  }

  if (typeof query !== 'string' || query.trim() === '') {
    return res.status(400).json({
      error: 'Invalid query parameter',
      message: 'The "query" parameter must be a non-empty string'
    });
  }

  next();
};