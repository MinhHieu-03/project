import { HttpException, HttpStatus } from "@nestjs/common";

export const AUTH_ERRORS = {
  ACCOUNT_NOT_FOUND: {
    code: "AUTH_001",
    message: "Account not found",
    reason: "The specified user account does not exist in the system",
  },
  ACCOUNT_ALREADY_EXISTS: {
    code: "AUTH_002",
    message: "Account already exists",
    reason: "An account with this username is already registered",
  },
  INVALID_PASSWORD: {
    code: "AUTH_003",
    message: "Invalid password",
    reason: "The provided password does not match the account password",
  },
  INVALID_USER_ID: {
    code: "AUTH_004",
    message: "Invalid user ID",
    reason: "The provided user ID is not valid or does not exist",
  },
  CREATE_USER_FAILED: {
    code: "AUTH_005",
    message: "Failed to create user",
    reason: "User creation process failed due to database or validation error",
  },
  UPDATE_USER_FAILED: {
    code: "AUTH_006",
    message: "Failed to update user",
    reason: "User update process failed due to database or validation error",
  },
  DELETE_USER_FAILED: {
    code: "AUTH_007",
    message: "Failed to delete user",
    reason:
      "User deletion process failed - user may not exist or database error occurred",
  },
  PASSWORD_HASH_FAILED: {
    code: "AUTH_008",
    message: "Password encryption failed",
    reason: "Unable to hash the password due to bcrypt error",
  },
  TOKEN_GENERATION_FAILED: {
    code: "AUTH_009",
    message: "Token generation failed",
    reason: "Unable to generate JWT access token",
  },
  UNAUTHORIZED_ACCESS: {
    code: "AUTH_010",
    message: "Unauthorized access",
    reason: "User does not have permission to access this resource",
  },
  VALIDATION_ERROR: {
    code: "AUTH_011",
    message: "Validation error",
    reason:
      "Input data validation failed - required fields missing or invalid format",
  },
} as const;

export interface CustomError {
  code: string;
  message: string;
  reason: string;
  details?: any;
  timestamp?: Date;
}

export class AuthError extends Error {
  public readonly code: string;
  public readonly reason: string;
  public readonly details?: any;
  public readonly timestamp: Date;

  constructor(
    errorType: (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS],
    details?: any,
  ) {
    super(errorType.message);
    this.code = errorType.code;
    this.reason = errorType.reason;
    this.details = details;
    this.timestamp = new Date();
    this.name = "AuthError";
  }

  toJSON(): CustomError {
    return {
      code: this.code,
      message: this.message,
      reason: this.reason,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

export function createHttpException(
  errorType: (typeof AUTH_ERRORS)[keyof typeof AUTH_ERRORS],
  details?: any,
  statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
): HttpException {
  const authError = new AuthError(errorType, details);
  return new HttpException(
    {
      code: authError.code,
      message: authError.message,
      reason: authError.reason,
      details: authError.details,
      timestamp: authError.timestamp,
    },
    statusCode,
  );
}
