import { getItem } from "../../utility/localStorageControl";
import actions from "./actions";
import axios from "axios";

const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  CustomerAdd,
  customerList,
  customerListErr,
  CustomerAddErr,
  customerDetailErr,
  CustomerImportPreview,
  CustomerImportPreviewErr,
  CustomerImportData,
  CustomerImportDataErr,
} = actions;

const bingageCustomerInfo = async (text, currentRegister) => {
  try {
    let response = await axios.get(
      `https://api.bingage.com/pos/v2/memberInfo?contactNumber=${Number(text)}`,
      {
        headers: {
          Authorization: `Bearer ${currentRegister?.bingageKey}`,
        },
      }
    );
    return response;
  } catch (error) {
    return "bingageErr";
  }
};

export const filterListData = (text) => {
  return async (dispatch) => {
    try {
      let currentRegister = getItem("setupCache").register.find(
        (val) => val.active
      );
      const getcustomerList = await DataService.get(
        `${API.customer.searchList}?mobile=${text}`
      );

      if (!getcustomerList.data.error) {
        if (getItem("bingage_enable") && currentRegister?.bingageKey) {
          let response = await bingageCustomerInfo(text, currentRegister);
          if (response != "bingageErr" && response.data) {
            if (getcustomerList.data.data[0]) {
              getcustomerList.data.data[0].bingageDetails = response.data;
            } else {
              getcustomerList.data.data = [
                { bingageDetails: response.data, mobile: text },
              ];
            }
          }
        }

        return dispatch(
          customerList(
            getcustomerList.data.data,
            getcustomerList.data.pagination.total_counts,
            getcustomerList.data.pagination.current_page,
            getcustomerList.data.pagination.total_pages
          )
        );
      } else {
        return dispatch(customerListErr(getcustomerList.data));
      }
    } catch (err) {
      dispatch(customerListErr(err));
    }
  };
};
export const bingageSendOtp = (customerData, binageDetails) => {
  return async (dispatch) => {
    console.log("lplpllpflfrf", customerData);
    try {
      let currentRegister = getItem("setupCache").register.find(
        (val) => val.active
      );
      console.log("2121212121", currentRegister);

      if (customerData && binageDetails && currentRegister.bingageKey) {
        console.log("67676767676");
        let response = await axios.post(
          `https://api.bingage.com/pos/v2/billing`,
          {
            contactNo: Number(customerData.mobile),
            customerName: customerData.name ? customerData.name : "",
            invoiceAmount: Number(customerData.totalcalculatedPrice),
            email: customerData.email ? customerData.email : "",
            invoiceNo: "AAAA",
            orderType: "Delivery",
            orderFrom: "APP",
            paymentType: "Prepaid",
            paymentMode: "Cash",
            orderId: "1234",
            redeemDetails: [
              {
                amount: Number(binageDetails.balance),
                offerName: "string",
                redeemOnBill: true,
              },
            ],
          },
          {
            headers: {
              Authorization: `Bearer ${currentRegister?.bingageKey}`,
            },
          }
        );

        if (response?.data?.OtpSent) {
          return response.data;
        } else if (response.data && response.data.redeemDetails[0]) {
          let getResponeValue = await axios.post(
            `https://api.bingage.com/pos/v2/billing`,
            {
              contactNo: Number(customerData.mobile),
              customerName: customerData.name ? customerData.name : "",
              invoiceAmount: Number(customerData.totalcalculatedPrice),
              email: customerData.email ? customerData.email : "",
              invoiceNo: "AAAA",
              orderType: "Delivery",
              orderFrom: "APP",
              paymentType: "Prepaid",
              paymentMode: "Cash",
              orderId: "1234",
              redeemDetails: response.data.redeemDetails,
              isBillingWithRedeem: true,
              redeemVerify: response.data.transactionIdOtp,
            },
            {
              headers: {
                Authorization: `Bearer ${currentRegister?.bingageKey}`,
              },
            }
          );

          getResponeValue.data.updateBalance = getResponeValue.data.balance;
          return getResponeValue.data;
        }
      }
    } catch (err) {
      console.log("lplpllpsagaratknknksns", err);
      return dispatch(customerListErr(err.message));
    }
  };
};
export const bingageVarifyOtp = (otpDetails, customerData) => {
  return async (dispatch) => {
    try {
      let currentRegister = getItem("setupCache").register.find(
        (val) => val.active
      );
      if (otpDetails && otpDetails.OTP) {
        let response = await axios.get(
          `https://api.bingage.com/pos/v2/verify/otp?transactionId=${otpDetails.transactionId}&otpCode=${otpDetails.OTP}`,

          {
            headers: {
              Authorization: `Bearer ${currentRegister?.bingageKey}`,
            },
          }
        );
        console.log("mkmkvmvxmvkddv", response);
        if (response.data.redeemDetails[0]) {
          let getResponeValue = await axios.post(
            `https://api.bingage.com/pos/v2/billing`,
            {
              contactNo: Number(customerData.mobile),
              customerName: customerData.name ? customerData.name : "",
              invoiceAmount: Number(customerData.totalcalculatedPrice),
              email: customerData.email ? customerData.email : "",
              invoiceNo: "AAAA",
              orderType: "Delivery",
              orderFrom: "APP",
              paymentType: "Prepaid",
              paymentMode: "Cash",
              orderId: "1234",
              redeemDetails: response.data.redeemDetails,
              isBillingWithRedeem: true,
              redeemVerify: response.data.transactionIdOtp,
            },
            {
              headers: {
                Authorization: `Bearer ${currentRegister?.bingageKey}`,
              },
            }
          );
          return getResponeValue.data;
        }
      }
    } catch (err) {
      console.log("checckofbingage", err.message);
      return dispatch(customerListErr(err.message));
    }
  };
};
export const getCustomerList = (currentPage, limit) => {
  return async (dispatch) => {
    try {
      const getcustomerList = await DataService.get(
        `${API.customer.list}?page=${currentPage}&limit=${limit}`
      );

      if (!getcustomerList.data.error) {
        return dispatch(
          customerList(
            getcustomerList.data.data,
            getcustomerList.data.pagination.total_counts,
            getcustomerList.data.pagination.current_page,
            getcustomerList.data.pagination.total_pages
          )
        );
      } else {
        return dispatch(customerListErr(getcustomerList.data));
      }
    } catch (err) {
      dispatch(customerListErr(err));
    }
  };
};
export const ExportCustomer = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.customer.exportCustomer, payloads);
    return resp.data;
  };
};

export const UpdateCustomer = (payloads, id) => {
  return async (dispatch) => {
    const getCustomer = await DataService.put(
      API.customer.Customerupdate + "/" + id,
      payloads
    );
    if (!getCustomer.data.error) {
      return dispatch(CustomerAdd(getCustomer.data));
    } else {
      return dispatch(CustomerAddErr(getCustomer.data));
    }
  };
};

export const AddSingleCustomer = (payloads) => {
  return async (dispatch) => {
    try {
      const getCustomer = await DataService.post(
        API.customer.Customeradd,
        payloads
      );
      if (!getCustomer.data.error) {
        return dispatch(CustomerAdd(getCustomer.data));
      } else {
        return dispatch(CustomerAddErr(getCustomer.data));
      }
    } catch (err) {
      dispatch(CustomerAddErr(err));
    }
  };
};

export const getCustomerDetail = (id) => {
  return async (dispatch) => {
    try {
      const Detail = await DataService.get(API.customer.detail + "/" + id);
      if (!Detail.data.error) {
        return Detail.data.data;
      } else {
        return dispatch(customerDetailErr(Detail.data));
      }
    } catch (err) {
      dispatch(customerDetailErr(err));
    }
  };
};

export const ImportCustomerInBulk = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(
        API.customer.importCustomer,
        payloads
      );
      if (!getPreview.data.error) {
        return dispatch(CustomerImportPreview(getPreview.data));
      } else {
        return dispatch(CustomerImportPreviewErr(getPreview.data));
      }
    } catch (err) {
      dispatch(CustomerImportPreviewErr(err));
    }
  };
};

export const ConfirmImport = (payloads) => {
  return async (dispatch) => {
    try {
      let getPreview = {};
      getPreview = await DataService.post(API.customer.importPreview, payloads);
      if (!getPreview.data.error) {
        return dispatch(CustomerImportData(getPreview.data));
      } else {
        return dispatch(CustomerImportDataErr(getPreview.data));
      }
    } catch (err) {
      dispatch(CustomerImportDataErr(err));
    }
  };
};
