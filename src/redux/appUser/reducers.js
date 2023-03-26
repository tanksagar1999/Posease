import actions from "./actions";
const {
  APP_USER_ADD,
  APP_USER_ADD_ERR,
  APP_USER_LIST,
  APP_USER_LIST_ERR,
  APP_USER_ID,
  APP_USER_ID_ERR,
  APP_USER_DELETED,
  APP_USER_DELETED_ERR,
} = actions;

const initialState = {
  appUserList: [],
  appUserIdData: {},
};

const appUserReducer = (state = initialState, action) => {
  const {
    type,
    err,
    appUserData,
    appUserList,
    appUserIdData,
    appUserDeletedData,
  } = action;
  switch (type) {
    case APP_USER_ADD:
      return {
        ...state,
        appUserData,
      };
    case APP_USER_ADD_ERR:
      return {
        ...state,
        err,
      };
    case APP_USER_LIST:
      return {
        ...state,
        appUserList,
      };
    case APP_USER_LIST_ERR:
      return {
        ...state,
        err,
      };
    case APP_USER_ID:
      return {
        ...state,
        appUserIdData,
      };
    case APP_USER_ID_ERR:
      return {
        ...state,
        err,
      };
    case APP_USER_DELETED:
      return {
        ...state,
        appUserDeletedData,
      };
    case APP_USER_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { appUserReducer };
