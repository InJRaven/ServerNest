import { UnauthorizedException, ForbiddenException } from '@nestjs/common';

/**
 * Login Credentials Are Incorrect
 * */
class InvalidCredentialsException extends UnauthorizedException {
  constructor(payload?: {
    code?: string;
    message?: string;
    [key: string]: any;
  }) {
    super({
      code: payload?.code ?? 'INVALID_CREDENTIALS',
      message: payload?.message ?? 'Invalid email or password',
      ...payload,
    });
    this.name = 'InvalidCredentialsException';
  }
}

/**
 * Token Has Expired
 * */
class TokenExpiredException extends UnauthorizedException {
  constructor(payload?: {
    code?: string;
    message?: string;
    [key: string]: any;
  }) {
    super({
      code: payload?.code ?? 'TOKEN_EXPIRED',
      message: payload?.message ?? 'Authentication token has expired',
      ...payload,
    });

    this.name = 'TokenExpiredException';
  }
}

/**
 * Token Is Invalid
 * */
class TokenInvalidException extends UnauthorizedException {
  constructor(payload?: {
    code?: string;
    message?: string;
    [key: string]: any;
  }) {
    super({
      code: payload?.code ?? 'TOKEN_INVALID',
      message: payload?.message ?? 'Authentication token is invalid',
      ...payload,
    });

    this.name = 'TokenInvalidException';
  }
}

/**
 * The Authenticated User Does Not Have Enough Permissions To Perform An Action
 * */
class PermissionDeniedException extends ForbiddenException {
  constructor(payload?: {
    code?: string;
    message?: string;
    [key: string]: any;
  }) {
    super({
      code: payload?.code ?? 'PERMISSION_DENIED',
      message:
        payload?.message ?? 'You do not have permission to perform this action',
      ...payload,
    });

    this.name = 'PermissionDeniedException';
  }
}

/**
 * The User Account Is Locked For Security Reasons
 * */
class AccountLockedException extends ForbiddenException {
  constructor(payload?: {
    code?: string;
    message?: string;
    [key: string]: any;
  }) {
    super({
      code: payload?.code ?? 'ACCOUNT_LOCKED',
      message:
        payload?.message ??
        'This account has been locked due to security policies',
      ...payload,
    });

    this.name = 'AccountLockedException';
  }
}

class EmailNotVerifiedException extends ForbiddenException {
  constructor(payload?: {
    code?: string;
    message?: string;
    [key: string]: any;
  }) {
    super({
      code: payload?.code ?? 'EMAIL_NOT_VERIFIED',
      message: payload?.message ?? 'Email has not been verified',
      ...payload,
    });

    this.name = 'EmailNotVerifiedException';
  }
}

export {
  InvalidCredentialsException,
  TokenExpiredException,
  TokenInvalidException,
  PermissionDeniedException,
  AccountLockedException,
  EmailNotVerifiedException,
};
