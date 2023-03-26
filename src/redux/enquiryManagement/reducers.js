import actions from "./actions";
const {
  USERS_LIST,
  USERS_LIST_ERR,
  CHNAGE_STATUS_SUCCESS,
  CHANGE_STATUS_ERR,
} = actions;
const initialState = {
  usersList: [],
  status: {},
};

const enquiryReducer = (state = initialState, action) => {
  const { type, UsersLists, err, status } = action;
  switch (type) {
    case USERS_LIST:
      return {
        ...state,
        UsersLists,
      };
    case USERS_LIST_ERR:
      return {
        ...state,
        err,
      };
    case CHNAGE_STATUS_SUCCESS:
      return {
        ...state,
        status,
      };
    case CHANGE_STATUS_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { enquiryReducer };
