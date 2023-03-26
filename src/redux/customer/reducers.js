import actions from "./actions";

const initialState = {
  mainCustomerList: [],
  customerList: [],
  customerListData: [],
  currentRecord: null,
  searchText: "",
  totalCutomer: 0,
  PreviewData: {},
  PreviewList: [],
};

const {
  FILTER_CUSTOMER_LIST,
  CUSTOMER_LIST,
  CUSTOMER_LIST_ERR,
  CUSTOMER_DETAIL_ERR,
} = actions;

const customerReducer = (state = initialState, action = {}) => {
  const { mainCustomerList } = state;
  const {
    err,
    PreviewData,
    PreviewList,
    customerListData,
    totalCounts,
    currentpage,
    totalPage,
    SearchList,
  } = actions;

  switch (action.type) {
    case FILTER_CUSTOMER_LIST:
      return {
        SearchList,
      };
    case CUSTOMER_LIST:
      return {
        customerListData,
        totalCounts,
        currentpage,
        totalPage,
      };
    case CUSTOMER_LIST_ERR:
      return {
        err,
      };
    case "SET_CURRENT_RECORD":
      return { ...state, currentRecord: action.payload?.id };
    case CUSTOMER_DETAIL_ERR:
      return {
        ...state,
        err,
      };
    case "CUSTOMER_ADD_ERR":
      return {
        ...state,
        err,
      };
    case "CUSTOMER_IMPORT_PREVIEW_LIST":
      return {
        ...state,
        PreviewList,
      };
    case "CUSTOMER_IMPORT_PREVIEW_ERR":
      return {
        ...state,
        err,
      };
    case "CUSTOMER_IMPORT_DATA":
      return {
        ...state,
        PreviewData,
      };
    case "CUSTOMER_IMPORT_DATA_ERR":
      return {
        ...state,
        err,
      };

    default:
      return state;
  }
};

export { customerReducer };
