const actions = {
  SEARCH_HEADER_BEGIN: "SEARCH_HEADER_BEGIN",
  SEARCH_HEADER_SUCCESS: "SEARCH_HEADER_SUCCESS",
  SEARCH_HEADER_ERR: "SEARCH_HEADER_ERR",
  RECEIPTS_LIST: "RECEIPTS_LIST",
  RECEIPTS_LIST_ERR: "RECEIPTS_LIST_ERR",
  RECEIPTS_ID: "RECEIPTS_ID",
  RECEIPTS_ID_ERR: "RECEIPTS_ID_ERR",
  CANCEL_ORDER_ADD: "CANCEL_ORDER_ADD",
  CANCEL_ORDER_ADD_ERR: "CANCEL_ORDER_ADD_ERR",
  RECEIPT_DELETED: "RECEIPT_DELETED",
  RECEIPT_DELETED_ERR: "RECEIPT_DELETED_ERR",
  FILTER_RECEIPTS_LIST: "FILTER_RECEIPTS_LIST",
  searchHeaderBegin: () => {
    return {
      type: actions.SEARCH_HEADER_BEGIN,
    };
  },

  searchHeaderSuccess: (searchData) => {
    return {
      type: actions.SEARCH_HEADER_SUCCESS,
      searchData,
    };
  },

  searchHeaderErr: (err) => {
    return {
      type: actions.SEARCH_HEADER_ERR,
      err,
    };
  },

  ReceiptsList: (ReceiptsList, totalReceipts, start, end) => {
    return {
      type: actions.RECEIPTS_LIST,
      ReceiptsList,
      totalReceipts,
      start,
      end,
    };
  },
  ReceiptsListErr: (err) => {
    return {
      type: actions.RECEIPTS_LIST_ERR,
      err,
    };
  },
  ReceiptsId: (ReceiptsIdData) => {
    return {
      type: actions.RECEIPTS_ID,
      ReceiptsIdData,
    };
  },
  ReceiptsIdErr: (err) => {
    return {
      type: actions.RECEIPTS_ID_ERR,
      err,
    };
  },
  cancelOrderAdd: (cancelOrderData) => {
    return {
      type: actions.CANCEL_ORDER_ADD,
      cancelOrderData,
    };
  },

  cancelOrderAddErr: (err) => {
    return {
      type: actions.CANCEL_ORDER_ADD_ERR,
      err,
    };
  },
  receiptDelete: (receiptDeletedData) => {
    return {
      type: actions.RECEIPT_DELETED,
      receiptDeletedData,
    };
  },
  receiptDeleteErr: (err) => {
    return {
      type: actions.RECEIPT_DELETED_ERR,
      err,
    };
  },
  filterDateList: (startDate, endDate) => {
    return {
      type: actions.FILTER_RECEIPTS_LIST,
      startDate: startDate,
      endDate: endDate,
    };
  },
};

export default actions;
