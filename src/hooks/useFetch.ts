import { useEffect, useState } from 'react';

interface ApiResponse<T> {
  loading: boolean;
  errorMsg: string;
  data: T | T[];
}

/**
 *
 */
export const useFetch = <T>({ url }: { url: string }): ApiResponse<T> => {
  const [apiState, _] = useState<ApiResponse<T>>({
    loading: false,
    errorMsg: '',
    data: [],
  });

  /**
   * Whenever the url changes, I need to perform
   * an async API request.
   */
  useEffect(() => {
    fetch(url)
      .then((response: Response) => {
        const { ok: isRequestSuccessful } = response;

        if (!isRequestSuccessful) {
          const errorMessage = `Error occured while using following API endpoint ${url}`;
          throw new Error(errorMessage);
        }

        return response.json();
      })
      .then((data: T) => console.log('Data: ', data))
      .catch((err) => console.error('Error: ', err));
  }, [url]);

  return {
    ...apiState,
  };
};
