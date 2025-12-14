import { IApiResponse } from '@interfaces';

export class ResponseUtil {
  static success<T>(message: string, data?: T): IApiResponse<T> {
    return {
      success: true,
      message,
      ...(data ?? {}),
    };
  }

  static created<T>(message: string, data: T): IApiResponse<T> {
    return {
      success: true,
      message,
      ...(data ?? {}),
    };
  }

  static noContent(message: string): IApiResponse {
    return {
      success: true,
      message,
    };
  }
}
