// This module defines the ApiResponse class, which is a simple data structure used to standardize the format of API responses throughout the application. The ApiResponse class includes properties such as statusCode, data, message, and success to provide a consistent structure for successful and error responses. This allows for easier handling of API responses on the client side and promotes a uniform response format across different endpoints in the application.

// The ApiResponse class constructor takes three parameters: statusCode (the HTTP status code of the response), data (the actual data being returned in the response), and an optional message (a human-readable message describing the response). The success property is automatically set based on whether the statusCode indicates a successful response (status codes less than 400 are considered successful). This class can be used in controllers to create structured responses that can be easily consumed by clients.
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    ((this.statusCode = statusCode),
      (this.data = data),
      (this.message = message),
      (this.success = statusCode < 400));
  }
}

export { ApiResponse };
