const errorMessages: Record<number, string> = {
  400: 'Bad request!',
  401: 'Unauthorized!',
  403: 'Forbidden!',
  404: 'Source not found!',
};

/**
 * @desc utility function to return a customized error message
 * based on the code received from the response
 * @param {number} statusCode
 * @returns {string}
 */
export const handleStatusCode = ({
  statusCode,
  fallbackMsg = 'Error!',
}: {
  statusCode: number;
  fallbackMsg?: string;
}) => {
  const errorMessage: string | undefined = errorMessages[statusCode];
  return errorMessage ?? fallbackMsg;
};
