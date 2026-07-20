export class HttpError extends Error {
  constructor(error) {
    const status = error.response?.status || null;
    const responseMessage = error.response?.data?.msg || error.response?.data?.message;
    super(responseMessage || (status ? 'The request could not be completed.' : 'Unable to reach the server.'));
    this.name = 'HttpError';
    this.status = status;
    this.code = error.code || null;
    this.details = error.response?.data || null;
    this.cause = error;
  }
}

export const normalizeHttpError = (error) => (
  error instanceof HttpError ? error : new HttpError(error)
);
