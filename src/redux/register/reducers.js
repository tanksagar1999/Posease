import actions from "./actions";
const {
  REGISTER_LIST,
  REGISTER_LIST_ERR,
  CHNAGE_REGISTER_SUCCESS,
  CHANGE_REGISTER_ERR,
  REGISTER_ADD,
  REGISTER_ADD_ERR,
  REGISTER_ID,
  REGISTER_ID_ERR,
  REGISTER_DELETED,
  REGISTER_DELETED_ERR,
} = actions;

const initialState = {
  RegisterList: [],
  registerData: {},
  registerIdData: {},
  RegisterDeletedData: {},
};

const registerReducer = (state = initialState, action) => {
  const {
    type,
    RegisterList,
    err,
    data,
    registerIdData,
    registerData,
    RegisterDeletedData,
  } = action;
  switch (type) {
    case REGISTER_ADD:
      return {
        ...state,
        registerData,
      };
    case REGISTER_ADD_ERR:
      return {
        ...state,
        err,
      };
    case REGISTER_LIST:
      return {
        ...state,
        RegisterList,
      };
    case REGISTER_LIST_ERR:
      return {
        ...state,
        err,
      };
    case REGISTER_ID:
      return {
        ...state,
        registerIdData,
      };
    case REGISTER_ID_ERR:
      return {
        ...state,
        err,
      };
    case CHNAGE_REGISTER_SUCCESS:
      return {
        ...state,
        data,
      };
    case CHANGE_REGISTER_ERR:
      return {
        ...state,
        err,
      };
    case REGISTER_DELETED:
      return {
        ...state,
        RegisterDeletedData,
      };
    case REGISTER_DELETED_ERR:
      return {
        ...state,
        err,
      };

    default:
      return state;
  }
};
export { registerReducer };
