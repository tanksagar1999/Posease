import actions from "./actions";
import commonFunction from "../../utility/commonFunctions";
const {
  SEARCH_HEADER_SUCCESS,
  SEARCH_HEADER_ERR,
  RECEIPTS_LIST,
  RECEIPTS_LIST_ERR,
  RECEIPTS_ID,
  RECEIPTS_ID_ERR,
  CANCEL_ORDER_ADD,
  CANCEL_ORDER_ADD_ERR,
  RECEIPT_DELETED,
  RECEIPT_DELETED_ERR,
  FILTER_RECEIPTS_LIST,
} = actions;

const initialState = {
  searchText: "",
  searchedColumn: "",
  ReceiptsList: [],
  mainReceiptsList: [],
};

const receiptsReducer = (state = initialState, action) => {
  const {
    type,
    searchData,
    err,
    ReceiptsList,
    ReceiptsIdData,
    cancelOrderData,
    receiptDeletedData,
    start,
    end,
    totalReceipts,
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
    case RECEIPTS_LIST:
      return {
        ...state,
        ReceiptsList: ReceiptsList,
        mainReceiptsList: ReceiptsList,
        totalReceipts: totalReceipts,
        startDate: start,
        endDate: end,
      };
    case RECEIPTS_LIST_ERR:
      return {
        ...state,
        err,
      };
    case RECEIPTS_ID:
      return {
        ...state,
        ReceiptsIdData,
      };
    case RECEIPTS_ID_ERR:
      return {
        ...state,
        err,
      };
    case CANCEL_ORDER_ADD:
      return {
        ...state,
        cancelOrderData,
      };
    case CANCEL_ORDER_ADD_ERR:
      return {
        ...state,
        err,
      };
    case RECEIPT_DELETED:
      return {
        ...state,
        receiptDeletedData,
      };
    case RECEIPT_DELETED_ERR:
      return {
        ...state,
        err,
      };
    case FILTER_RECEIPTS_LIST:
      const filtereddataList = state.mainReceiptsList.filter(
        (x) =>
          commonFunction.convertToDate(x.created_at, "MM/DD/YYYY") >=
            startDate &&
          commonFunction.convertToDate(x.created_at, "MM/DD/YYYY") <= endDate
      );
      return { ...state, ReceiptsList: [...filtereddataList] };
    default:
      return state;
  }
};
export { receiptsReducer };
