const actions = {
  SEARCH_HEADER_BEGIN: "SEARCH_HEADER_BEGIN",
  SEARCH_HEADER_SUCCESS: "SEARCH_HEADER_SUCCESS",
  SEARCH_HEADER_ERR: "SEARCH_HEADER_ERR",
  PATTY_ADD: "PATTY_ADD",
  PATTY_ADD_ERR: "PATTY_ADD_ERR",
  DATE_LIST: "DATE_LIST",
  DATE_LIST_ERR: "DATE_LIST_ERR",
  PATTY_LIST: "PATTY_LIST",
  PATTY_LIST_ERR: "PATTY_LIST_ERR",
  PATTY_ID: "PATTY_ID",
  PATTY_ID_ERR: "PATTY_ID_ERR",
  PATTY_DELETED: "PATTY_DELETED",
  PATTY_DELETED_ERR: "PATTY_DELETED_ERR",
  FILTER_PATTY_LIST: "FILTER_PATTY_LIST",

  searchHeaderBegin: () => {
    return {
      type: actions.SEARCH_HEADER_BEGIN,
    };
  },
  filterDateList: (startDate, endDate) => {
    return {
      type: actions.FILTER_PATTY_LIST,
      startDate: startDate,
      endDate: endDate,
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
  PattyAdd: (PattyData) => {
    return {
      type: actions.PATTY_ADD,
      error: false,
      PattyData,
    };
  },

  PattyAddErr: (err) => {
    return {
      type: actions.PATTY_ADD_ERR,
      error: true,
      err,
    };
  },
  dateList: (dateList) => {
    return {
      type: actions.DATE_LIST,
      dateList,
    };
  },
  dateListErr: (err) => {
    return {
      type: actions.DATE_LIST_ERR,
      err,
    };
  },
  PattyList: (pattyList, totalCounts) => {
    return {
      type: actions.PATTY_LIST,
      pattyList,
      totalCounts,
    };
  },
  PattyListErr: (err) => {
    return {
      type: actions.PATTY_LIST_ERR,
      err,
    };
  },
  PattyId: (PattyIdData) => {
    return {
      type: actions.PATTY_ID,
      PattyIdData,
    };
  },
  PattyIdErr: (err) => {
    return {
      type: actions.PATTY_ID_ERR,
      err,
    };
  },
  PattyDelete: (PattyDeletedData) => {
    return {
      type: actions.PATTY_DELETED,
      PattyDeletedData,
    };
  },
  PattyDeleteErr: (err) => {
    return {
      type: actions.PATTY_DELETED_ERR,
      err,
    };
  },
};

export default actions;
