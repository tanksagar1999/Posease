import actions from "./actions";
import commonFunction from "../../utility/commonFunctions";
const {
  SEARCH_HEADER_SUCCESS,
  SEARCH_HEADER_ERR,
  PATTY_ADD,
  PATTY_ADD_ERR,
  DATE_LIST,
  DATE_LIST_ERR,
  PATTY_LIST,
  PATTY_LIST_ERR,
  PATTY_ID,
  PATTY_ID_ERR,
  PATTY_DELETED,
  PATTY_DELETED_ERR,
  FILTER_PATTY_LIST,
} = actions;

const initialState = {
  patyData: [],
  searchText: "",
  searchedColumn: "",
  pattyList: [],
  mainpattyList: [],
};

const pattycashReducer = (state = initialState, action) => {
  const { mainpattyList } = state;
  const {
    type,
    searchData,
    err,
    PattyData,
    pattyList,
    dateList,
    startDate,
    endDate,
    totalCounts,
  } = action;
  switch (type) {
    case SEARCH_HEADER_SUCCESS:
      return {
        ...state,
        filteredData: state.receiptData.filter((data) =>
          data.receipt_numbr.toLowerCase().includes(searchData.toLowerCase())
        ),
      };
    case SEARCH_HEADER_ERR:
      return err;
    case PATTY_ADD:
      return {
        ...state,
        PattyData,
      };
    case PATTY_ADD_ERR:
      return {
        ...state,
        err,
      };
    case DATE_LIST:
      return {
        ...state,
        dateList,
      };
    case DATE_LIST_ERR:
      return {
        ...state,
        err,
      };
    case PATTY_LIST:
      return {
        ...state,
        mainpattyList: [...pattyList],
        pattyList: [...pattyList],
        totalCounts,
      };
    case PATTY_LIST_ERR:
      return {
        ...state,
        err,
      };
    case FILTER_PATTY_LIST:
      const filtereddataList = mainpattyList.filter(
        (x) =>
          commonFunction.convertToDate(x.created_at, "MM/DD/YYYY") >=
            startDate &&
          commonFunction.convertToDate(x.created_at, "MM/DD/YYYY") <= endDate
      );
      return { ...state, pattyList: [...filtereddataList] };
    case PATTY_ID:
      return {
        ...state,
        PattyData,
      };
    case PATTY_ID_ERR:
      return {
        ...state,
        err,
      };
    case PATTY_DELETED:
      return {
        ...state,
      };
    case PATTY_DELETED_ERR:
      return {
        ...state,
        err,
      };
    default:
      return state;
  }
};
export { pattycashReducer };
