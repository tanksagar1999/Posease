import Cookies from "js-cookie";
import { getItem, setItem } from "../../utility/localStorageControl";
import actions from "./actions";

const {
  LOGIN_BEGIN,
  LOGIN_SUCCESS,
  IS_ADMIN,
  LOGIN_ERR,
  LOGOUT_BEGIN,
  LOGOUT_SUCCESS,
  LOGOUT_ERR,
  RESET_PASSWORD_SUCCESS,
  REGISTER_BEGIN,
  REGISTER_ERR,
  REGISTER_SUCCESS,
  FORGOT_PIN_ADD,
  FORGOT_PIN_ADD_ERR,
  OFFLINE_MODE,
  LOCAL_TABLE_ARRAY,
  ADD_WAITER_DATA,
  REMOVE_WAITER_DATA,
} = actions;

const initState = {
  login: Cookies.get("logedIn"),
  loading: false,
  isAdmin: null,
  error: null,
  isResetPasswordLinkSent: false,
  userRegistered: {},
  offlineMode: false,
  localTableDataArray: [],
  waiterTableDataList: [],
  checkUpdate: false,
};

const AuthReducer = (state = initState, action) => {
  const {
    type,
    data,
    err,
    ForgotPinData,
    offlineYaOnline,
    localTableData,
    addWaiterData,
    removeWaiterData,
  } = action;

  switch (type) {
    case LOGIN_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        login: data,
        loading: false,
      };
    case IS_ADMIN:
      return {
        ...state,
        isAdmin: data,
        loading: false,
      };
    case LOGIN_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case LOGOUT_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case LOGOUT_SUCCESS:
      return {
        ...state,
        login: data,
        loading: false,
      };
    case LOGOUT_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isResetPasswordLinkSent: data,
        loading: false,
      };
    case REGISTER_BEGIN:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_ERR:
      return {
        ...state,
        error: err,
        loading: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        userRegistered: data,
        loading: false,
      };
    case FORGOT_PIN_ADD:
      return {
        ...state,
        ForgotPinData,
      };
    case FORGOT_PIN_ADD_ERR:
      return {
        ...state,
        err,
      };
    case OFFLINE_MODE:
      return {
        ...state,
        offlineMode: offlineYaOnline,
      };
    case LOCAL_TABLE_ARRAY:
      return {
        ...state,
        localTableDataArray: localTableData,
      };
    case ADD_WAITER_DATA:
      console.log("sagsasasasv");
      setItem("waiterTableList", [...state.waiterTableDataList, addWaiterData]);
      return {
        ...state,
        waiterTableDataList: [...state.waiterTableDataList, addWaiterData],
        checkUpdate: state.checkUpdate ? !state.checkUpdate : true,
      };
    case REMOVE_WAITER_DATA:
      console.log("remove", removeWaiterData);
      let filterRemovedata = state.waiterTableDataList.filter(
        (val) => val.cartKey != removeWaiterData
      );
      console.log("filterRemovedata", filterRemovedata);
      setItem("waiterTableList", filterRemovedata);
      return {
        ...state,
        waiterTableDataList: filterRemovedata,
      };
    default:
      return state;
  }
};
export default AuthReducer;
