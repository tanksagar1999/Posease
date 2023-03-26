const actions = {
  CUSTOMER_LIST: "CUSTOMER_LIST",
  CUSTOMER_LIST_ERR: "CUSTOMER_LIST_ERR",
  FILTER_CUSTOMER_LIST: "FILTER_CUSTOMER_LIST",
  SET_CURRENT_RECORD: "SET_CURRENT_RECORD",
  CUSTOMER_ADD: "CUSTOMER_ADD",
  CUSTOMER_ADD_ERR: "CUSTOMER_ADD_ERR",
  CUSTOMER_IMPORT_PREVIEW_LIST: "CUSTOMER_IMPORT_PREVIEW_LIST",
  CUSTOMER_IMPORT_PREVIEW_ERR: "CUSTOMER_IMPORT_PREVIEW_ERR",
  CUSTOMER_IMPORT_DATA: "CUSTOMER_IMPORT_DATA",
  CUSTOMER_IMPORT_DATA_ERR: "CUSTOMER_IMPORT_DATA_ERR",

  filterCustomerList: (SearchList) => {
    return {
      type: actions.FILTER_CUSTOMER_LIST,
      SearchList,
    };
  },
  customerList: (customerListData, totalCounts, currentpage, totalPage) => {
    return {
      type: actions.CUSTOMER_LIST,
      customerListData,
      totalCounts,
      currentpage,
      totalPage,
    };
  },
  customerListErr: (err) => {
    return {
      type: actions.CUSTOMER_LIST_ERR,
      err,
    };
  },
  customerDetailErr: (err) => {
    return {
      type: actions.CUSTOMER_DETAIL_ERR,
      err,
    };
  },

  setCurrentRecord: (record) => {
    return {
      type: actions.SET_CURRENT_RECORD,
      payload: { ...record },
    };
  },
  CustomerAdd: (CustomerData) => {
    return {
      type: actions.CUSTOMER_ADD,
      CustomerData,
    };
  },
  CustomerAddErr: (err) => {
    return {
      type: actions.CUSTOMER_ADD_ERR,
      err,
    };
  },
  CustomerImportPreview: (PreviewList) => {
    return {
      type: actions.CUSTOMER_IMPORT_PREVIEW_ERR,
      PreviewList,
    };
  },
  CustomerImportPreviewErr: (err) => {
    return {
      type: actions.CUSTOMER_IMPORT_PREVIEW_ERR,
      err,
    };
  },
  CustomerImportData: (PreviewData) => {
    return {
      type: actions.CUSTOMER_IMPORT_DATA,
      PreviewData,
    };
  },

  CustomerImportDataErr: (err) => {
    return {
      type: actions.CUSTOMER_IMPORT_DATA_ERR,
      err,
    };
  },
};

export default actions;
