export class ApiResponse {
  public success: boolean;
  public message: string;
  public data?: any;
  public error?: string;

  constructor(success: boolean, message: string, data?: any, error?: string) {
    this.success = success;
    this.message = message;
    if (data !== undefined) this.data = data;
    if (error !== undefined) this.error = error;
  }

  static success(message: string, data?: any): ApiResponse {
    return new ApiResponse(true, message, data);
  }

  static error(message: string, error?: string): ApiResponse {
    return new ApiResponse(false, message, undefined, error);
  }
}