import actions from "./actions";
const {
  KITCHEN_USER_ADD,
  KITCHEN_USER_ADD_ERR,
  KITCHEN_USER_LIST,
  KITCHEN_USER_LIST_ERR,
  KITCHEN_USER_ID,
  KITCHEN_USER_ID_ERR,
  KITCHEN_USER_DELETED,
  KITCHEN_USER_DELETED_ERR,
} = actions;

const initialState = {
  kitchenUserList: [],
  kitchenUserIdData: {},
};

const kitchenUserReducer = (state = initialState, action) => {
  const {
    type,
    err,
    kitchenUserData,
    kitchenUserList,
    kitchenUserIdData,
    kitchenUserDeletedData,
  } = action;
  switch (type) {
    case KITCHEN_USER_ADD:
      return {
        ...state,
        kitchenUserData,
      };
    case KITCHEN_USER_ADD_ERR:
      return {
        ...state,
        err,
      };
    case KITCHEN_USER_LIST:
      return {
        ...state,
        kitchenUserList,
      };
    case KITCHEN_USER_LIST_ERR:
      return {
        ...state,
        err,
      };
    case KITCHEN_USER_ID:
      return {
        ...state,
        kitchenUserIdData,
      };
    case KITCHEN_USER_ID_ERR:
      return {
        ...state,
        err,
      };
    case KITCHEN_USER_DELETED:
      return {
        ...state,
        kitchenUserDeletedData,
      };
    case KITCHEN_USER_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { kitchenUserReducer };
