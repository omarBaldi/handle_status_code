import { Reducer, useEffect, useReducer } from 'react';
import { apiStateReducer } from './../reducers/api-state-reducer';
import { handleStatusCode } from './../utils/handle-status-code';
import { ApiStateActions } from '../actions/api-state-actions';

export interface ApiResponse<T> {
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
 * @desc
 * @param {string} url
 * @returns
 */
export const useFetch = <T>({ url }: { url: string }): ApiResponse<T> => {
  const [apiState, dispatch] = useReducer<Reducer<ApiResponse<T>, ApiStateActions<T>>>(
    apiStateReducer,
    initialApiState
  );

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
        dispatch({ type: 'UPDATE_DATA', payload: { data } });
      } catch (err: any) {
        const statusCode: number = err?.cause?.statusCode ?? 400;
        const errorMessage = handleStatusCode({ statusCode });

        dispatch({ type: 'UPDATE_ERROR_MSG', payload: { errorMsg: errorMessage } });
      } finally {
        dispatch({ type: 'UPDATE_LOADING', payload: { loading: false } });
      }
    })(url);

    //* cleanup on component unmount
    return () => {
      controller.abort();
      dispatch({ type: 'RESET_VALUES', payload: { initialState: initialApiState } });
    };
  }, [url]);

  return {
    ...apiState,
  };
};
