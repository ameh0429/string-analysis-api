import express from 'express';
import stringController from '../controllers/stringController.js';
import { 
  validateStringCreation, 
  validateFilterParams,
  validateNaturalLanguageQuery 
} from '../middleware/validation.js';

const router = express.Router();

/**
 * Natural language filtering must come before /:value route
 * to avoid treating "filter-by-natural-language" as a value
 */
router.get(
  '/filter-by-natural-language',
  validateNaturalLanguageQuery,
  stringController.filterByNaturalLanguage.bind(stringController)
);

/**
 * Create a new string
 * POST /strings
 */
router.post(
  '/',
  validateStringCreation,
  stringController.createString.bind(stringController)
);

/**
 * Get all strings with optional filters
 * GET /strings
 */
router.get(
  '/',
  validateFilterParams,
  stringController.getAllStrings.bind(stringController)
);

/**
 * Get a specific string by value
 * GET /strings/:value
 */
router.get(
  '/:value',
  stringController.getStringByValue.bind(stringController)
);

/**
 * Delete a string
 * DELETE /strings/:value
 */
router.delete(
  '/:value',
  stringController.deleteString.bind(stringController)
);

export default router;