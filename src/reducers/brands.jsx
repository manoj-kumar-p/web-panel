import { FETCH_BRANDS } from "../types";

const initialState = {
  data: [],
};

export const brandsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BRANDS:
      return {
        data: action.payload,
      };
    default:
      return state;
  }
};
