import { ApiResponse } from '../hooks/useFetch';

export type ApiStateActions<T> =
  | { type: 'UPDATE_LOADING'; payload: { loading: boolean } }
  | { type: 'UPDATE_ERROR_MSG'; payload: { errorMsg: string } }
  | { type: 'UPDATE_DATA'; payload: { data: T | T[] } }
  | { type: 'RESET_VALUES'; payload: { initialState: ApiResponse<T> } };
