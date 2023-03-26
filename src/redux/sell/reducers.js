import actions from "./actions";
import commonFunction from "../../utility/commonFunctions";

const {
  TABLE_LIST,
  TABLE_LIST_ERR,
  TABLE_STATUS_UPDATE,
  GET_LAST_RECEIPT,
  GET_LAST_DEVICE,
  TABLE_STATUS_UPDATE_ERR,
  ORDER_ADD,
  ORDER_ADD_ERR,
  BOOKING_ADD,
  BOOKING_ADD_ERR,
  BOOKING_LIST,
  BOOKING_LIST_ERR,
  BOOKING_ID,
  BOOKING_ID_ERR,
  FILTER_BOOKING_LIST,
} = actions;

const initialState = {
  tableList: [],
  tableStatusUpdate: {},
  receiptData: {},
  deviceData: {},
  orderData: {},
  bookingData: {},
  bookingList: [],
  mainBookingList: [],
  bookingIdData: {},
};

const sellReducer = (state = initialState, action) => {
  const {
    type,
    tableList,
    receiptData,
    deviceData,
    tableStatusUpdate,
    err,
    orderData,
    bookingData,
    bookingList,
    bookingIdData,
    startDate,
    endDate,
  } = action;
  switch (type) {
    case ORDER_ADD:
      return {
        ...state,
        orderData,
      };
    case ORDER_ADD_ERR:
      return {
        ...state,
        err,
      };
    case TABLE_LIST:
      return {
        ...state,
        tableList,
      };

    case TABLE_LIST_ERR:
      return {
        ...state,
        err,
      };
    case GET_LAST_RECEIPT:
      return {
        ...state,
        receiptData,
      };
    case GET_LAST_DEVICE:
      return {
        ...state,
        deviceData,
      };
    case TABLE_STATUS_UPDATE:
      return {
        ...state,
        tableStatusUpdate,
      };

    case TABLE_STATUS_UPDATE_ERR:
      return {
        ...state,
        err,
      };
    case BOOKING_ADD:
      return {
        ...state,
        bookingData,
      };
    case BOOKING_ADD_ERR:
      return {
        ...state,
        err,
      };
    case BOOKING_LIST:
      return {
        ...state,
        mainBookingList: [...bookingList],
        bookingList: [...bookingList],
      };
    case BOOKING_LIST_ERR:
      return {
        ...state,
        err,
      };
    case BOOKING_ID:
      return {
        ...state,
        bookingIdData,
      };
    case BOOKING_ID_ERR:
      return {
        ...state,
        err,
      };
    case FILTER_BOOKING_LIST:
      const filtereddataList = state.mainBookingList.filter(
        (x) =>
          commonFunction.convertToDate(
            new Date(
              `${x.details.bookingDetails.delivery_date},${x.details.bookingDetails.delivery_time}`
            ),
            "MM/DD/YYYY"
          ) >= startDate &&
          commonFunction.convertToDate(
            new Date(
              `${x.details.bookingDetails.delivery_date},${x.details.bookingDetails.delivery_time}`
            ),
            "MM/DD/YYYY"
          ) <= endDate
      );
      return { ...state, bookingList: [...filtereddataList] };

    default:
      return state;
  }
};
export { sellReducer };
