import { LOGIN, LOGOUT, FETCH_CATEGORIES, FETCH_BRANDS , FETCH_COUPONS, FETCH_PINCODES} from "../types";

export const userAction = (payload, login, token) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      payload,
      login,
      token,
    });
  };
};

export const loginAction = (token, payload) => {
  return (dispatch) => {
    dispatch({
      type: LOGIN,
      token: token,
      login: true,
      payload,
    });
  };
};

export const logoutAction = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({
      type: LOGOUT,
      token: null,
      login: false,
      payload: null,
    });
  };
};

export const categoryAction = (payload) => {
  return (dispatch) => {
    localStorage.setItem("categories", JSON.stringify(payload));
    dispatch({
      type: FETCH_CATEGORIES,
      payload,
    });
  };
};

export const brandAction = (payload) => {
  return (dispatch) => {
    localStorage.setItem("brands", JSON.stringify(payload));
    dispatch({
      type: FETCH_BRANDS,
      payload,
    });
  };
};

export const couponAction = (payload) => {
  return (dispatch) => {
    localStorage.setItem("coupons", JSON.stringify(payload));
    dispatch({
      type: FETCH_COUPONS,
      payload,
    });
  };
};

export const pincodeAction = (payload) => {
  return (dispatch) => {
    localStorage.setItem("pincodes", JSON.stringify(payload));
    dispatch({
      type: FETCH_PINCODES,
      payload,
    });
  };
};

