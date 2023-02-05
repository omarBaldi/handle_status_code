import { ApiStateActions } from '../actions/api-state-actions';
import { ApiResponse } from '../hooks/useFetch';

export const apiStateReducer = <T>(
  state: ApiResponse<T>,
  action: ApiStateActions<T>
): typeof state => {
  switch (action.type) {
    case 'UPDATE_LOADING': {
      const key: keyof typeof state = 'loading';
      const { loading: updatedLoadingValue } = action.payload;

      return {
        ...state,
        [key]: updatedLoadingValue,
      };
    }
    case 'UPDATE_ERROR_MSG': {
      const key: keyof typeof state = 'errorMsg';
      const { errorMsg: updatedErrorMsg } = action.payload;

      return {
        ...state,
        [key]: updatedErrorMsg,
      };
    }
    case 'UPDATE_DATA': {
      const key: keyof typeof state = 'data';
      const { data: updatedData } = action.payload;

      return {
        ...state,
        [key]: updatedData,
      };
    }
    default: {
      return state;
    }
  }
};
