import Cookies from "js-cookie";
import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
import axios from "axios";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  tableList,
  getLastReceiptData,
  getLastDeviceData,
  tableUpdateStatus,
  tableUpdateStatusErr,
  orderAdd,
  orderAddErr,
  bookingAdd,
  bookingAddErr,
  bookingList,
  bookingListErr,
  bookingId,
  bookingIdErr,
  filterDateList,
} = actions;

const getLastReceipt = () => {
  return async (dispatch) => {
    try {
      let Data = getItem("setupCache").register.find((val) => val.active);
      if (Data && Data._id) {
        const getData = await DataService.get(
          `${API.sell.getLastRecepitNumber}/${Data._id}`
        );
        if (!getData.data.error) {
          return dispatch(getLastReceiptData(getData.data.data));
        }
      }
    } catch (err) {
      return dispatch(getLastReceiptData({}));
    }
  };
};

const getLastDevice = () => {
  return async (dispatch) => {
    try {
      let Data = getItem("setupCache").register.find((val) => val.active);
      if (Data && Data._id) {
        const getData = await DataService.get(
          `${API.sell.getLastDevice}/${Data._id}`
        );

        if (!getData.data.error) {
          return dispatch(getLastDeviceData(getData.data.data));
        }
      }
    } catch (err) {
      return dispatch(getLastDeviceData({}));
    }
  };
};

const getAllTableList = () => {
  return async (dispatch) => {
    let localStorageDataTable = [
      {
        status: "Empty",

        table_prefix: "New Take-away",
        table_type: "take-away",
      },
      {
        status: "Empty",
        table_prefix: "New Delivery",
        table_type: "delivery",
      },
    ];
    try {
      if (localStorageDataTable) {
        return dispatch(tableList(localStorageDataTable));
      }
    } catch (err) {
      if (localStorageDataTable) {
        return dispatch(tableList(localStorageDataTable));
      }
    }
  };
};

const updateTableSelected = (tableId, tableStatus) => {
  return async (dispatch) => {
    try {
      const updateTableStatus = await DataService.put(
        `${API.sell.getAllTables}/${tableId}`,
        { status: tableStatus }
      );
      if (!updateTableStatus.data.error) {
        return dispatch(tableUpdateStatus(updateTableStatus.data.data));
      } else {
        return dispatch(tableUpdateStatusErr(updateTableStatus.data));
      }
    } catch (err) {
      return dispatch(tableUpdateStatusErr(err));
    }
  };
};

const saveCurrentDevice = (postdata) => {
  return async (dispatch) => {
    try {
      let getData = {};
      getData = await DataService.post(API.sell.getLastDevice, postdata);
      if (!getData.data.error) {
        return getData.data.data;
      } else {
        return getData.data.data;
      }
    } catch (err) {
      return err;
    }
  };
};

const createPendingReceipt = (formData) => {
  let getPendingReceiptsList = getItem("pendingReceipts");

  if (getPendingReceiptsList == null) {
    let array = [
      {
        ...formData,
      },
    ];
    setItem("pendingReceipts", array);
    return true;
  } else if (getPendingReceiptsList?.length > -1) {
    getPendingReceiptsList.push(formData);
    setItem("pendingReceipts", getPendingReceiptsList);
    return true;
  }
};
const checkBinageApiCall = (getOrderData) => {
  if (
    getOrderData?.data?.data?.customer?.mobile &&
    getOrderData?.data?.data?.details?.register_data?.bingageKey &&
    getItem("bingage_enable") &&
    getOrderData?.data?.data?.details?.bingageDetails == undefined
  ) {
    return true;
  } else {
    return false;
  }
};

const genrateProductName = (text) => {
  let text2 = text.toString();
  let newSpilitArray = text2.split(/[+]/);
  let newSpilitArray1 = text2.split(/[,]/);
  let finalArray = [];
  newSpilitArray.map((value) => {
    finalArray.push(value.replace(/,/gi, ""));
  });

  let abc = (
    <>
      {text2.includes("-") ? (
        newSpilitArray1.map((val) => <div>{val}</div>)
      ) : (
        <div>
          {" "}
          {finalArray.length > 1 ? (
            <div>
              {finalArray.map((value, index) => {
                return (
                  <div>
                    {index > 0 ? "+" : null}
                    {value}
                  </div>
                );
              })}
            </div>
          ) : (
            <div>{text}</div>
          )}
        </div>
      )}
    </>
  );
};
const newAndUpdateCustomerAddBingage = async (getOrderData) => {
  try {
    let allProductList = [];
    getOrderData.data.data.details.itemsSold.map((val) => {
      allProductList.push({
        productName: val.display_name.toString(),
        productCategory: val.product_category,
        productCode: val.key,
        productCost: val.calculatedprice,
        productCount: val.quantity,
      });
    });
    let response = await axios.post(
      "https://api.bingage.com/pos/v2/billing",
      {
        contactNo: Number(getOrderData.data.data.customer.mobile),
        email: getOrderData.data.data.customer?.email
          ? getOrderData.data.data.customer.email
          : "",
        invoiceNo: getOrderData.data.data.details.receipt_number,
        orderType: getOrderData.data.data.details.orderType,
        orderFrom: "APP",
        paymentMode: getOrderData.data.data.details.bingagePaymnetType,
        orderId: getOrderData.data.data.details._id,
        customerName: getOrderData.data.data.customer.name
          ? getOrderData.data.data.customer.name
          : "",
        invoiceAmount: Number(
          getOrderData.data.data.details.priceSummery.total
        ),
        productList: allProductList,
      },
      {
        headers: {
          Authorization: `Bearer ${getOrderData.data.data.details.register_data.bingageKey}`,
        },
      }
    );

    return "Bingagedone";
  } catch (err) {
    return "Bingagedone";
  }
};
const CreateOrder = (formData) => {
  let currentRegister = formData?.details?.register_data
    ? formData?.details?.register_data
    : undefined;
  if (currentRegister) {
    formData.register_id = currentRegister._id
      ? currentRegister._id
      : undefined;
    formData.associated_name = currentRegister.register_name
      ? currentRegister.register_name
      : undefined;
  }
  return async (dispatch) => {
    try {
      let getOrderData = await DataService.post(API.sell.createOrder, formData);
      if (getOrderData.status == 502 || getOrderData.status == 408) {
        createPendingReceipt(formData);
        return dispatch(orderAdd(formData));
      }
      if (!getOrderData.data.error) {
        if (checkBinageApiCall(getOrderData)) {
          await newAndUpdateCustomerAddBingage(getOrderData);
        }
        console.log("getOrderData", getOrderData);
        return dispatch(orderAdd(getOrderData.data.data));
      } else {
        createPendingReceipt(formData);
        return dispatch(orderAddErr(getOrderData.data.data));
      }
    } catch (err) {
      createPendingReceipt(formData);
      return dispatch(orderAdd(formData));
    }
  };
};

const AddAndUpdateBooking = (formData, booking_id) => {
  return async (dispatch) => {
    let currentRegister = getItem("setupCache").register.find(
      (val) => val.active
    );
    if (currentRegister) {
      formData.register_id = currentRegister._id;
      formData.associated_name = currentRegister.register_name;
    }
    try {
      let getAddedbooking = {};
      if (booking_id) {
        getAddedbooking = await DataService.put(
          `${API.sell.updateBooking}/${booking_id}`,
          formData
        );
      } else {
        getAddedbooking = await DataService.post(
          API.sell.createBooking,
          formData
        );
      }
      if (!getAddedbooking.data.error) {
        return dispatch(bookingAdd(getAddedbooking.data.data));
      } else {
        return dispatch(bookingAddErr(getAddedbooking.data.data));
      }
    } catch (err) {
      createPendingReceipt(formData);
      return dispatch(bookingAdd(formData));
    }
  };
};

const getAllBookingList = () => {
  return async (dispatch) => {
    try {
      let regId = getItem("setupCache")?.register.find((val) => val.active)._id;
      const getBookingList = await DataService.get(
        `${API.sell.getAllBooking}?register_id=${regId}`
      );
      if (!getBookingList.data.error) {
        return dispatch(bookingList(getBookingList.data.data));
      } else {
        return dispatch(bookingListErr(getBookingList.data));
      }
    } catch (err) {
      dispatch(bookingListErr(err));
    }
  };
};

const getBookingById = (id) => {
  return async (dispatch) => {
    try {
      const bookingByIdData = await DataService.get(
        `${API.sell.getBookingById}/${id}`
      );
      if (!bookingByIdData.data.error) {
        return dispatch(bookingId(bookingByIdData.data.data));
      } else {
        return dispatch(bookingIdErr(bookingByIdData.data));
      }
    } catch (err) {
      dispatch(bookingIdErr(err));
    }
  };
};
const getDateWiseBookingList = (start, end) => {
  return async (dispatch) => {
    dispatch(filterDateList(start, end));
  };
};
export {
  getAllTableList,
  updateTableSelected,
  CreateOrder,
  AddAndUpdateBooking,
  getAllBookingList,
  getBookingById,
  getDateWiseBookingList,
  getLastReceipt,
  getLastDevice,
  saveCurrentDevice,
};
