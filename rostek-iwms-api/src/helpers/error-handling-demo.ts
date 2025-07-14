/**
 * Demonstration of Enhanced Error Handling in Auth Service
 *
 * This file shows examples of how the improved error handling works.
 * All errors now include:
 * - Error code (for programmatic handling)
 * - Human-readable message
 * - Detailed reason explaining what went wrong
 * - Additional context/details
 * - Timestamp
 */

import { AUTH_ERRORS, AuthError } from "./error.constants";

// Example 1: Account not found error
export function demonstrateAccountNotFound() {
  const error = new AuthError(AUTH_ERRORS.ACCOUNT_NOT_FOUND, {
    username: "john_doe",
    attemptedAction: "login",
  });

  console.log("Account Not Found Error:");
  console.log(JSON.stringify(error.toJSON(), null, 2));
  /*
  Output:
  {
    "code": "AUTH_001",
    "message": "Account not found",
    "reason": "The specified user account does not exist in the system",
    "details": {
      "username": "john_doe",
      "attemptedAction": "login"
    },
    "timestamp": "2025-06-17T..."
  }
  */
}

// Example 2: Password validation error
export function demonstrateInvalidPassword() {
  const error = new AuthError(AUTH_ERRORS.INVALID_PASSWORD, {
    username: "jane_doe",
    attemptCount: 3,
  });

  console.log("Invalid Password Error:");
  console.log(JSON.stringify(error.toJSON(), null, 2));
}

// Example 3: Account creation failure
export function demonstrateCreateUserFailed() {
  const error = new AuthError(AUTH_ERRORS.CREATE_USER_FAILED, {
    userData: { name: "new_user", role: "admin" },
    originalError: "Database connection timeout",
  });

  console.log("Create User Failed Error:");
  console.log(JSON.stringify(error.toJSON(), null, 2));
}

// Example of HTTP response structure
export const ERROR_RESPONSE_EXAMPLES = {
  // 400 Bad Request - Invalid credentials
  loginFailed: {
    statusCode: 400,
    message: {
      code: "AUTH_003",
      message: "Invalid password",
      reason: "The provided password does not match the account password",
      details: { username: "user123" },
      timestamp: "2025-06-17T10:30:00.000Z",
    },
  },

  // 404 Not Found - User doesn't exist
  userNotFound: {
    statusCode: 404,
    message: {
      code: "AUTH_004",
      message: "Invalid user ID",
      reason: "The provided user ID is not valid or does not exist",
      details: { userId: "507f1f77bcf86cd799439011" },
      timestamp: "2025-06-17T10:30:00.000Z",
    },
  },

  // 500 Internal Server Error - Token generation failed
  tokenError: {
    statusCode: 500,
    message: {
      code: "AUTH_009",
      message: "Token generation failed",
      reason: "Unable to generate JWT access token",
      details: {
        originalError: "JWT secret not configured",
        username: "user123",
      },
      timestamp: "2025-06-17T10:30:00.000Z",
    },
  },
};

/**
 * Benefits of the new error handling system:
 *
 * 1. **Structured Error Responses**: All errors follow a consistent format
 * 2. **Error Codes**: Programmatic error identification (AUTH_001, AUTH_002, etc.)
 * 3. **Detailed Reasons**: Clear explanations of what went wrong
 * 4. **Context Information**: Additional details for debugging
 * 5. **Timestamps**: When the error occurred
 * 6. **Type Safety**: TypeScript support for error types
 * 7. **Centralized Management**: All error definitions in one place
 * 8. **Easy Maintenance**: Update error messages from a single location
 *
 * Frontend Usage:
 * ```javascript
 * try {
 *   await authService.login(credentials);
 * } catch (error) {
 *   if (error.response.data.code === 'AUTH_003') {
 *     // Handle invalid password specifically
 *     showPasswordErrorMessage();
 *   } else if (error.response.data.code === 'AUTH_001') {
 *     // Handle account not found
 *     showAccountNotFoundMessage();
 *   }
 * }
 * ```
 */
