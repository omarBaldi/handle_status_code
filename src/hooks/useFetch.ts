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
   * TODO: replace useState with useReducer
   */
  useEffect(() => {
    const controller = new AbortController();

    (async (apiEndpoint) => {
      try {
        const response = await fetch(apiEndpoint, { signal: controller.signal });
        const { ok: isRequestSuccessful, status: statusCode } = response;

        if (!isRequestSuccessful) {
          const errorMessage = `Error occured while using following API endpoint ${apiEndpoint}`;
          throw new Error(errorMessage, {
            cause: {
              statusCode,
            },
          });
        }

        const data: T = await response.json();
        handleApiStateUpdated({ key: 'data', updatedValue: data });
      } catch (err: any) {
        const statusCode: number = err?.cause?.statusCode ?? 400;
        const errorMessage = handleStatusCode({ statusCode });

        handleApiStateUpdated({ key: 'errorMsg', updatedValue: errorMessage });
      } finally {
        handleApiStateUpdated({ key: 'loading', updatedValue: false });
      }
    })(url);

    //* cleanup on component unmount
    return () => {
      controller.abort();
      setApiState(initialApiState);
    };
  }, [url]);

  return {
    ...apiState,
  };
};
