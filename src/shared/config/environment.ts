const DEFAULT_GREEN_API_URL = 'https://3100.api.green-api.com';

export const GREEN_API_URL =
  process.env.REACT_APP_GREEN_API_URL?.trim() || DEFAULT_GREEN_API_URL;
