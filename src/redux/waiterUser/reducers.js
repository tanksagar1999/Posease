import actions from "./actions";
const {
  WAITER_USER_ADD,
  WAITER_USER_ADD_ERR,
  WAITER_USER_LIST,
  WAITER_USER_LIST_ERR,
  WAITER_USER_ID,
  WAITER_USER_ID_ERR,
  WAITER_USER_DELETED,
  WAITER_USER_DELETED_ERR,
} = actions;

const initialState = {
  waiterUserList: [],
  waiterUserIdData: {},
};

const waiterUserReducer = (state = initialState, action) => {
  const {
    type,
    err,
    waiterUserData,
    waiterUserList,
    waiterUserIdData,
    waiterUserDeletedData,
  } = action;
  switch (type) {
    case WAITER_USER_ADD:
      return {
        ...state,
        waiterUserData,
      };
    case WAITER_USER_ADD_ERR:
      return {
        ...state,
        err,
      };
    case WAITER_USER_LIST:
      return {
        ...state,
        waiterUserList,
      };
    case WAITER_USER_LIST_ERR:
      return {
        ...state,
        err,
      };
    case WAITER_USER_ID:
      return {
        ...state,
        waiterUserIdData,
      };
    case WAITER_USER_ID_ERR:
      return {
        ...state,
        err,
      };
    case WAITER_USER_DELETED:
      return {
        ...state,
        waiterUserDeletedData,
      };
    case WAITER_USER_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { waiterUserReducer };
