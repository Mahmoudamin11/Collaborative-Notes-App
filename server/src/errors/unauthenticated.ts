import CustomAPIError from "./custom-api";
class UnauthenticatedError extends CustomAPIError {
  constructor(message: string) {
    super(message);
    this.statusCode = 401;
  }
}

export default UnauthenticatedError;
