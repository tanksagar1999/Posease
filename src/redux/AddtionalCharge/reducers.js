import actions from "./actions";
const {
  ADDTIONAL_CHARGE_ADD,
  ADDTIONAL_CHARGE_ADD_ERR,
  REGISTER_NAME_LIST,
  REGISTER_NAME_LIST_ERR,
  ADDTIONAL_CHARGE_LIST,
  ADDTIONAL_CHARGE_LIST_ERR,
  ADDTIONAL_CHARGE_ID,
  ADDTIONAL_CHARGE_ID_ERR,
  ADDTIONAL_CHARGE_DELETED,
  ADDTIONAL_CHARGE_DELETED_ERR,
} = actions;

const initialState = {
  AddtionalChargeList: [],
  searchAddtionalCharge: "",
  AddtionalChargeIdData: {},
};

const addtionalChargeReducer = (state = initialState, action) => {
  const {
    type,
    err,
    AddtionalChargeData,
    registerNameList,
    RegisterErr,
    AddtionalChargeList,
    AddtionalChargeIdData,
    AddtionalChargeDeletedData,
  } = action;
  switch (type) {
    case ADDTIONAL_CHARGE_ADD:
      return {
        ...state,
        AddtionalChargeData,
      };
    case ADDTIONAL_CHARGE_ADD_ERR:
      return {
        ...state,
        err,
      };
    case REGISTER_NAME_LIST:
      return {
        ...state,
        registerNameList,
      };
    case REGISTER_NAME_LIST_ERR:
      return {
        ...state,
        RegisterErr,
      };
    case ADDTIONAL_CHARGE_LIST:
      return {
        ...state,
        AddtionalChargeList,
      };
    case ADDTIONAL_CHARGE_LIST_ERR:
      return {
        ...state,
        err,
      };
    case ADDTIONAL_CHARGE_ID:
      return {
        ...state,
        AddtionalChargeIdData,
      };
    case ADDTIONAL_CHARGE_ID_ERR:
      return {
        ...state,
        err,
      };
    case ADDTIONAL_CHARGE_DELETED:
      return {
        ...state,
        AddtionalChargeDeletedData,
      };
    case ADDTIONAL_CHARGE_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { addtionalChargeReducer };
