import { ApiResponse } from '@interfaces';

export class ResponseUtil {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static created<T>(message: string, data: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static noContent(message: string): ApiResponse {
    return {
      success: true,
      message,
    };
  }
}
