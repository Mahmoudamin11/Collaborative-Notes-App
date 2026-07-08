import CustomAPIError from "./custom-api";

class ForbiddenError extends CustomAPIError {
  constructor(message : string) {
    super(message);
    this.statusCode = 403;
  }
}

export default ForbiddenError;
