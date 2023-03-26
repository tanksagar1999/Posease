import actions from "./actions";
const {
  TAXES_ADD,
  TAXES_ADD_ERR,
  TAXES_LIST,
  TAXES_LIST_ERR,
  TAXES_ID,
  TAXES_ID_ERR,
  TAXES_DELETED,
  TAXES_DELETED_ERR,
} = actions;

const initialState = {
  taxesData: {},
  taxesList: [],
  taxesIdData: {},
  TaxesDeletedData: {},
};

const taxesReducer = (state = initialState, action) => {
  const {
    type,
    err,
    taxesData,
    taxesList,
    taxesIdData,
    TaxesDeletedData,
  } = action;

  switch (type) {
    case TAXES_ADD:
      return {
        ...state,
        taxesData,
      };
    case TAXES_ADD_ERR:
      return {
        ...state,
        err,
      };
    case TAXES_LIST:
      return {
        ...state,
        taxesList,
      };
    case TAXES_LIST_ERR:
      return {
        ...state,
        err,
      };
    case TAXES_ID:
      return {
        ...state,
        taxesIdData,
      };
    case TAXES_ID_ERR:
      return {
        ...state,
        err,
      };
    case TAXES_DELETED:
      return {
        ...state,
        TaxesDeletedData,
      };
    case TAXES_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { taxesReducer };
