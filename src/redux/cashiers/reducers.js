import actions from "./actions";
const {
  CASHIERS_ADD,
  CASHIERS_ADD_ERR,
  CASHIERS_LIST,
  CASHIERS_LIST_ERR,
  CASHIERS_ID,
  CASHIERS_ID_ERR,
  CASHIERS_DELETED,
  CASHIERS_DELETED_ERR,
} = actions;

const initialState = {
  cashiersList: [],
  cashiersIdData: {},
};

const cashierReducer = (state = initialState, action) => {
  const {
    type,
    err,
    cashiersData,
    cashiersList,
    cashiersIdData,
    cashiersDeletedData,
  } = action;
  switch (type) {
    case CASHIERS_ADD:
      return {
        ...state,
        cashiersData,
      };
    case CASHIERS_ADD_ERR:
      return {
        ...state,
        err,
      };
    case CASHIERS_LIST:
      return {
        ...state,
        cashiersList,
      };
    case CASHIERS_LIST_ERR:
      return {
        ...state,
        err,
      };
    case CASHIERS_ID:
      return {
        ...state,
        cashiersIdData,
      };
    case CASHIERS_ID_ERR:
      return {
        ...state,
        err,
      };
    case CASHIERS_DELETED:
      return {
        ...state,
        cashiersDeletedData,
      };
    case CASHIERS_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { cashierReducer };
