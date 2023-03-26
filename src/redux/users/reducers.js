import actions from "./actions";
const {
  ACTIVE_USERS_LIST,
  ACTIVE_USERS_LIST_ERR,
  CHNAGE_STATUS_SUCCESS,
  CHANGE_STATUS_ERR,
  USER_DETAIL,
  USER_DETAIL_ERR,
  STATUS_FILTER_USER_LIST,
  USER_FILTER,
  USER_ERR,
  USER_DELETE,
  USER_DELETE_ERR,
} = actions;
const initialState = {
  ActiveUsersList: [],
  mainuserList: [],
  status: {},
};

const activeUsersReducer = (state = initialState, action) => {
  const { mainuserList } = state;
  const { type, ActiveUsersList, err, userData, deleteItem } = action;
  switch (type) {
    case ACTIVE_USERS_LIST:
      return {
        ...state,
        mainuserList: [...ActiveUsersList],
        ActiveUsersList: [...ActiveUsersList],
      };
    case ACTIVE_USERS_LIST_ERR:
      return {
        ...state,
        err,
      };
    case STATUS_FILTER_USER_LIST:
      if (action.payload == "all") {
        return { ...state, ActiveUsersList: [...mainuserList] };
      } else {
        const statusfilteredList = action.payload
          ? mainuserList.filter((x) =>
              x.status.toLowerCase().includes(action.payload.toLowerCase())
            )
          : [...mainuserList];
        return {
          ...state,
          ActiveUsersList: [...statusfilteredList],
          status: action.payload,
        };
      }
    case CHNAGE_STATUS_SUCCESS:
      return {
        ...state,
      };
    case CHANGE_STATUS_ERR:
      return {
        ...state,
        err,
      };
    case USER_DELETE:
      return {
        ...state,
        deleteItem,
      };
    case USER_DELETE_ERR:
      return {
        ...state,
        err,
      };
    case USER_DETAIL:
      return { ...state, userData: userData };
    case USER_DETAIL_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { activeUsersReducer };
