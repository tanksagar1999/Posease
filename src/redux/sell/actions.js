const actions = {
  TABLE_LIST: "TABLE_LIST",
  TABLE_LIST_ERR: "TABLE_LIST_ERR",
  GET_LAST_RECEIPT: "GET_LAST_RECEIPT",
  GET_LAST_DEVICE: "GET_LAST_DEVICE",
  TABLE_STATUS_UPDATE: "TABLE_STATUS_UPDATE",
  TABLE_STATUS_UPDATE_ERR: "TABLE_STATUS_UPDATE_ERR",
  ORDER_ADD: "ORDER_ADD",
  ORDER_ADD_ERR: "ORDER_ADD_ERR",
  BOOKING_ADD: "BOOKING_ADD",
  BOOKING_ADD_ERR: "BOOKING_ADD_ERR",
  BOOKING_LIST: "BOOKING_LIST",
  BOOKING_LIST_ERR: "BOOKING_LIST_ERR",
  BOOKING_ID: "BOOKING_ID",
  BOOKING_ID_ERR: "BOOKING_ID_ERR",
  FILTER_BOOKING_LIST: "FILTER_BOOKING_LIST",

  orderAdd: (orderData) => {
    return {
      type: actions.ORDER_ADD,
      orderData,
    };
  },

  orderAddErr: (err) => {
    return {
      type: actions.ORDER_ADD_ERR,
      err,
    };
  },

  tableList: (tableList) => {
    return {
      type: actions.TABLE_LIST,
      tableList,
    };
  },

  tableListErr: (err) => {
    return {
      type: actions.TABLE_LIST_ERR,
      err,
    };
  },
  getLastReceiptData: (receiptData) => {
    return {
      type: actions.GET_LAST_RECEIPT,
      receiptData,
    };
  },
  getLastDeviceData: (deviceData) => {
    return {
      type: actions.GET_LAST_DEVICE,
      deviceData,
    };
  },
  tableUpdateStatus: (table) => {
    return {
      type: actions.TABLE_STATUS_UPDATE,
      table,
    };
  },

  tableUpdateStatusErr: (err) => {
    return {
      type: actions.TABLE_STATUS_UPDATE_ERR,
      err,
    };
  },

  bookingAdd: (bookingData) => {
    return {
      type: actions.BOOKING_ADD,
      bookingData,
    };
  },

  bookingAddErr: (err) => {
    return {
      type: actions.BOOKING_ADD_ERR,
      err,
    };
  },
  bookingList: (bookingList) => {
    return {
      type: actions.BOOKING_LIST,
      bookingList,
    };
  },
  bookingListErr: (err) => {
    return {
      type: actions.BOOKING_LIST_ERR,
      err,
    };
  },
  bookingId: (bookingIdData) => {
    return {
      type: actions.BOOKING_ID,
      bookingIdData,
    };
  },
  bookingIdErr: (err) => {
    return {
      type: actions.BOOKING_ID_ERR,
      err,
    };
  },
  filterDateList: (startDate, endDate) => {
    return {
      type: actions.FILTER_BOOKING_LIST,
      startDate: startDate,
      endDate: endDate,
    };
  },
};

export default actions;
