import { combineReducers } from "redux";
import { categoriesReducer } from "./categories";
import { userReducer } from "./user";
import { brandsReducer } from "./brands";
import { couponsReducer } from "./coupons";

export default combineReducers({
  userReducer,
  categoriesReducer,
  brandsReducer,
  couponsReducer,
});
