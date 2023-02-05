import { useEffect, useState } from 'react';

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
      .then((data: T) => handleApiStateUpdated({ key: 'data', updatedValue: data }))
      .catch((err) =>
        handleApiStateUpdated({
          key: 'errorMsg',
          updatedValue: (err as any)?.message ?? 'Error!',
        })
      )
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
