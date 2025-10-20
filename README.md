# String Analysis RESTful API
A modular Node.js/Express API service that analyzes strings and stores their computed properties.

## Features
- String analysis with multiple computed properties
- SHA-256 based unique identification
- RESTful API endpoints
- Query filtering with standard parameters
- Natural language query parsing
- In-memory storage (easily replaceable with database)
- Comprehensive error handling

## Project Structure

```
src/
├── index.js                          # Server entry point
├── app.js                            # Express app configuration
├── controllers/
│   └── stringController.js           # Request handlers
├── services/
│   ├── stringAnalyzer.js             # String analysis logic
│   ├── stringService.js              # Business logic layer
│   └── naturalLanguageParser.js      # NL query parser
├── repositories/
│   └── stringRepository.js           # Data access layer
├── routes/
│   └── stringRoutes.js               # Route definitions
└── middleware/
    ├── validation.js                 # Request validation
    └── errorHandler.js               # Error handling
```

## Installation

```
npm install express
```
Running the Server

```
// Production mode
npm start

// Development mode with auto-reload
npm run dev
```
Server runs on `http://localhost:3000`.

## API Endpoints
### Create/Analyze String
- POST `/strings`

Request:

```
{
  "value": "ameh mathias"
}

```
Response (201 Created):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5mkzdie0813tsxzggmpp.png)

Error Responses:

- `400 Bad Request` - Invalid request body or missing "value" field
- `422 Unprocessable Entity` - Invalid data type for "value" (must be string)
- `409 Conflict` - String already exists

### Get Specific String
- GET /strings/{string_value}

Example: `GET /strings/ameh%20mathias`

Response (200 OK):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/usd9iiau08sbtj6xciwh.png)

Error Response:
- `404 Not Found` - String does not exist

### Get All Strings with Filtering

- GET `/strings
`
Query Parameters:
- `is_palindrome` - boolean (true/false)
- `min_length` - integer (minimum string length)
- `max_length` - integer (maximum string length)
- `word_count` - integer (exact word count)
- `contains_character` - string (single character)

Example: `GET /strings?is_palindrome=true&min_length=3&word_count=1`

Response (200 OK):

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/5huezgl8av95nh21midx.png)

Error Response:
- `400 Bad Request` - Invalid query parameter values or types

### Natural Language Filtering
- GET `/strings/filter-by-natural-language?query={natural_language_query}`

Supported Query Patterns:
- "all single word palindromic strings"
- "strings longer than 10 characters"
- "palindromic strings that contain the first vowel"
- "strings containing the letter z"
- "two word strings"
- "strings between 5 and 20 characters"

Example: `GET /strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings`

Response (200 OK):

```
{
    "data": [
        {
            "id": "31db973d2a73423e4a95ad7d5e9eed9d0a8e06c77ce7cb0c6f3b0d35b7f90625",
            "value": "ameh mathias",
            "properties": {
                "length": 12,
                "is_palindrome": false,
                "unique_characters": 8,
                "word_count": 2,
                "sha256_hash": "31db973d2a73423e4a95ad7d5e9eed9d0a8e06c77ce7cb0c6f3b0d35b7f90625",
                "character_frequency_map": {
                    "a": 3,
                    "m": 2,
                    "e": 1,
                    "h": 2,
                    " ": 1,
                    "t": 1,
                    "i": 1,
                    "s": 1
                }
            },
            "created_at": "2025-10-20T13:21:56.057Z"
        }
    ],
    "count": 1,
    "interpreted_query": {
        "original": "{natural_language_query}",
        "parsed_filters": {}
    }
}
```
Error Responses:
- `400 Bad Request` - Unable to parse natural language query
- `422 Unprocessable Entity` - Query parsed but resulted in conflicting filters

### Delete String
- DELETE `/strings/{string_value}`

Example: DELETE `/strings/ameh%20mathias`

Response:
 `204 No Content` (empty body)

Error Response:
- `404 Not Found` - String does not exist

### String Properties

Each analyzed string includes:

| Property | Type | Description |
|----------|------|-------------|
| `length` | integer | Number of characters in the string |
| `is_palindrome` | boolean | Whether string reads the same forwards/backwards (case-insensitive) |
| `unique_characters` | integer | Count of distinct characters |
| `word_count` | integer | Number of words separated by whitespace |
| `sha256_hash` | string | SHA-256 hash for unique identification |
| `character_frequency_map` | object | Character-to-count mapping |

## Testing Examples

### Using Postman

```bash
# Create a string
POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "racecar"}'

# Get a string
http://localhost:3000/strings/ameh%20mathias

# Get palindromes
"http://localhost:3000/strings?is_palindrome=true"

# Natural language query
"http://localhost:3000/strings/filter-by-natural-language?query=single%20word%20palindromic%20strings"

# Delete a string
DELETE http://localhost:3000/strings/ameh%20mathias
```

Common status codes:
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (invalid data type)
- `500` - Internal Server Error