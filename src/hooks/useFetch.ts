import { useEffect, useState } from 'react';
import { handleStatusCode } from './../utils/handle-status-code';

interface ApiResponse<T> {
  loading: boolean;
  errorMsg: string | null;
  data: T | T[] | null;
}

const initialApiState: ApiResponse<any> = {
  loading: true,
  errorMsg: null,
  data: null,
};

/**
 *
 */
export const useFetch = <T>({ url }: { url: string }): ApiResponse<T> => {
  const [apiState, setApiState] = useState<ApiResponse<T>>({
    ...initialApiState,
  });

  const handleApiStateUpdated = ({
    key,
    updatedValue,
  }: {
    key: keyof typeof apiState;
    updatedValue: typeof apiState[keyof typeof apiState];
  }): void => {
    setApiState((prevApiState) => ({ ...prevApiState, [key]: updatedValue }));
  };

  /**
   * Whenever the url changes, I need to perform
   * an async API request.
   *
   * TODO: add abort controller to stop previous request made when url changes
   * TODO: create utility function to return custom error messages based on status code received
   * TODO: replace useState with useReducer
   */
  useEffect(() => {
    fetch(url)
      .then((response: Response) => {
        const { ok: isRequestSuccessful, status: statusCode, statusText } = response;

        if (!isRequestSuccessful) {
          const errorMessage = `Error occured while using following API endpoint ${url}`;
          throw new Error(errorMessage, {
            cause: {
              statusCode,
            },
          });
        }

        return response.json();
      })
      .then((data: T) => handleApiStateUpdated({ key: 'data', updatedValue: data }))
      .catch((err: any) => {
        const statusCode: number = err?.cause?.statusCode ?? 400;
        const errorMessage = handleStatusCode({ statusCode });

        handleApiStateUpdated({
          key: 'errorMsg',
          updatedValue: errorMessage,
        });
      })
      .finally(() => handleApiStateUpdated({ key: 'loading', updatedValue: false }));

    //* cleanup on component unmount
    return () => {
      setApiState(initialApiState);
    };
  }, [url]);

  return {
    ...apiState,
  };
};
