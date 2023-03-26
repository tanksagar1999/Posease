import actions from "./actions";
const {
  TAX_GROUP_LIST,
  TAX_GROUP_LIST_ERR,
  TAX_NAME_LIST,
  TAX_NAME_LIST_ERR,
  TAX_GROUP_ADD,
  TAX_GROUP_ADD_ERR,
  TAX_GROUP_ID,
  TAX_GROUP_ID_ERR,
  TAX_GROUP_DELETED,
  TAX_GROUP_DELETED_ERR,
} = actions;

const initialState = {
  taxGroupList: [],
  taxNameList: [],
};

const taxGroupReducer = (state = initialState, action) => {
  const {
    type,
    taxGroupList,
    err,
    taxNameList,
    taxGroupData,
    taxGroupIdData,
    taxGroupdeletedData,
  } = action;
  switch (type) {
    case TAX_GROUP_LIST:
      return {
        ...state,
        taxGroupList,
      };
    case TAX_GROUP_LIST_ERR:
      return {
        ...state,
        err,
      };
    case TAX_NAME_LIST:
      return {
        ...state,
        taxNameList,
      };
    case TAX_NAME_LIST_ERR:
      return {
        ...state,
        err,
      };
    case TAX_GROUP_ADD:
      return {
        ...state,
        taxGroupData,
      };
    case TAX_GROUP_ADD_ERR:
      return {
        ...state,
        err,
      };
    case TAX_GROUP_ID:
      return {
        ...state,
        taxGroupIdData,
      };
    case TAX_GROUP_ID_ERR:
      return {
        ...state,
        err,
      };
    case TAX_GROUP_DELETED:
      return {
        ...state,
        taxGroupdeletedData,
      };
    case TAX_GROUP_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { taxGroupReducer };
