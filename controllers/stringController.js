import stringService from '../services/stringService.js';
import naturalLanguageParser from '../services/naturalLanguageParser.js';

/**
 * Controller for string-related operations
 */
class StringController {
  /**
   * Create a new string
   * POST /strings
   */
  async createString(req, res, next) {
    try {
      const { value } = req.body;
      const result = stringService.createString(value);
      
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a specific string by value
   * GET /strings/:value
   */
  async getStringByValue(req, res, next) {
    try {
      const value = decodeURIComponent(req.params.value);
      const result = stringService.getStringByValue(value);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all strings with optional filters
   * GET /strings
   */
  async getAllStrings(req, res, next) {
    try {
      const filters = req.filters || {};
      const result = stringService.getAllStrings(filters);
      
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Filter strings by natural language query
   * GET /strings/filter-by-natural-language
   */
  async filterByNaturalLanguage(req, res, next) {
    try {
      const originalQuery = req.query.query;
      
      // Parse the natural language query
      const parsedFilters = naturalLanguageParser.parse(originalQuery);
      
      // Validate for conflicts
      naturalLanguageParser.validateFilters(parsedFilters);
      
      // Get filtered results
      const results = stringService.getAllStrings(parsedFilters);
      
      // Return with interpretation metadata
      res.status(200).json({
        data: results.data,
        count: results.count,
        interpreted_query: {
          original: originalQuery,
          parsed_filters: parsedFilters
        }
      });
    } catch (error) {
      // If parsing failed or resulted in no filters
      if (error.status === 422) {
        next(error);
      } else if (Object.keys(error).length === 0) {
        const err = new Error('Unable to parse natural language query');
        err.status = 400;
        next(err);
      } else {
        next(error);
      }
    }
  }

  /**
   * Delete a string
   * DELETE /strings/:value
   */
  async deleteString(req, res, next) {
    try {
      const value = decodeURIComponent(req.params.value);
      stringService.deleteString(value);
      
      res.status(204).send({"message": "Strings deleted successfully"});
    } catch (error) {
      next(error);
    }
  }
}

export default new StringController();