import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  searchHeaderBegin,
  searchHeaderSuccess,
  searchHeaderErr,
  ReceiptsList,
  ReceiptsListErr,
  ReceiptsId,
  ReceiptsIdErr,
  cancelOrderAdd,
  cancelOrderAddErr,
  receiptDelete,
  receiptDeleteErr,
  filterDateList,
} = actions;

const headerGlobalSearchAction = (searchData) => {
  return (dispatch) => {
    try {
      dispatch(searchHeaderBegin());
      dispatch(searchHeaderSuccess(searchData));
    } catch (err) {
      dispatch(searchHeaderErr(err));
    }
  };
};

const getAllReceiptsList = (currentPage, limit, startDate, endDate) => {
  return async (dispatch) => {
    try {
      let regId = getItem("setupCache").register.find((val) => val.active)._id;
      console.log("startDate=>", startDate);
      let getReceiptsList;
      if (startDate) {
        getReceiptsList = await DataService.get(
          `${
            API.recepits.getAllReceipts
          }?page=${currentPage}&limit=${limit}&register_id=${regId}&startDate=${startDate}&endDate=${endDate}&timeZon=${
            Intl.DateTimeFormat().resolvedOptions().timeZone
          }`
        );
      } else {
        getReceiptsList = await DataService.get(
          `${API.recepits.getAllReceipts}?page=${currentPage}&limit=${limit}&register_id=${regId}`
        );
      }

      if (!getReceiptsList.data.error) {
        let receiptCount =
          getReceiptsList.data.messageCode == "NO_DATA_FOUND"
            ? 0
            : getReceiptsList.data.pagination.total_counts;

        return dispatch(
          ReceiptsList(
            getReceiptsList.data.data,
            receiptCount,
            startDate,
            endDate
          )
        );
      } else {
        return dispatch(ReceiptsListErr(getReceiptsList.data));
      }
    } catch (err) {
      dispatch(ReceiptsListErr(err));
    }
  };
};
const getReceiptsById = (id) => {
  return async (dispatch) => {
    try {
      const ReceiptsByIdData = await DataService.get(
        `${API.recepits.getReceiptsById}/${id}`
      );

      if (!ReceiptsByIdData.data.error) {
        return dispatch(ReceiptsId(ReceiptsByIdData.data.data));
      } else {
        return dispatch(ReceiptsIdErr(ReceiptsByIdData.data));
      }
    } catch (err) {
      dispatch(ReceiptsIdErr(err));
    }
  };
};
const cancelOrder = (formData, cancelOrder_id) => {
  return async (dispatch) => {
    try {
      console.log("formDatfdfsddfgjka", formData);

      let regId = getItem("setupCache")?.register?.find((val) => val.active)
        ?._id;
      formData.register_id = regId;
      let getAddedcancelOrder = await DataService.put(
        `${API.recepits.canselorder}/${cancelOrder_id}`,
        formData
      );
      if (!getAddedcancelOrder.data.error) {
        return dispatch(cancelOrderAdd(getAddedcancelOrder.data.data));
      } else {
        return dispatch(cancelOrderAddErr(getAddedcancelOrder.data.data));
      }
    } catch (err) {
      dispatch(cancelOrderAddErr(err));
    }
  };
};
const deleteReceipt = (receiptIds) => {
  return async (dispatch) => {
    try {
      const getDeletedreceipt = await DataService.delete(
        `${API.recepits.deleteReceipt}/${receiptIds}`
      );
      if (!getDeletedreceipt.data.error) {
        return dispatch(receiptDelete(getDeletedreceipt.data));
      } else {
        return dispatch(receiptDeleteErr(getDeletedreceipt.data));
      }
    } catch (err) {
      dispatch(receiptDeleteErr(err));
    }
  };
};
const getDateWiseReceptsList = (start, end) => {
  return async (dispatch) => {
    let regId = getItem("setupCache").register.find((val) => val.active)._id;
    const getReceiptsList = await DataService.get(
      `${
        API.recepits.getAllReceipts
      }?page=${1}&limit=${10}&register_id=${regId}&startDate=${start}&endDate=${end}&timeZon=${
        Intl.DateTimeFormat().resolvedOptions().timeZone
      }`
    );

    if (!getReceiptsList.data.error) {
      let receiptCount =
        getReceiptsList.data.messageCode == "NO_DATA_FOUND"
          ? 0
          : getReceiptsList.data.pagination.total_counts;

      return dispatch(
        ReceiptsList(getReceiptsList.data.data, receiptCount, start, end)
      );
    } else {
      return dispatch(ReceiptsListErr(getReceiptsList.data));
    }
  };
};

const exportSales = (payloads) => {
  return async () => {
    try {
      let url;
      if (payloads.category == "sales") {
        url = API.recepits.exportSaleReport;
      } else if (payloads.category == "payment") {
        url = API.recepits.paymentReport;
      } else if (payloads.category == "daily") {
        url = API.recepits.dailySaleAndPaymnetReport;
      } else if (payloads.category == "product") {
        url = API.recepits.productWiseReport;
      } else if (payloads.category == "shift") {
        url = API.recepits.shiftsReport;
      }
      delete payloads["category"];

      const resp = await DataService.post(url, payloads);

      if (resp && !resp.data.error) {
        return resp.data;
      } else {
        return resp.data;
      }
    } catch (error) {
      return false;
    }
  };
};
export {
  headerGlobalSearchAction,
  getAllReceiptsList,
  getReceiptsById,
  cancelOrder,
  deleteReceipt,
  getDateWiseReceptsList,
  exportSales,
};
