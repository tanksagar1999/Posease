import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  cashiersAdd,
  cashiersAddErr,
  cashiersList,
  cashiersListErr,
  cashiersId,
  cashiersIdErr,
  cashiersDelete,
  cashiersDeleteErr,
} = actions;

const addOrUpdateCashiers = (formData, cashiers_id) => {
  return async (dispatch) => {
    try {
      let getAddedcashiers = {};
      if (cashiers_id) {
        getAddedcashiers = await DataService.put(
          `${API.cashiers.addCashiers}/${cashiers_id}`,
          formData
        );
      } else {
        getAddedcashiers = await DataService.post(
          API.cashiers.addCashiers,
          formData
        );
      }
      if (!getAddedcashiers.data.error) {
        return dispatch(cashiersAdd(getAddedcashiers.data.data));
      } else {
        return dispatch(cashiersAddErr(getAddedcashiers.data.data));
      }
    } catch (err) {
      return dispatch(cashiersAddErr(err));
    }
  };
};

const getAllCashiersList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");

      if (
        checksell == "sell" &&
        allSetupcache?.userList?.cashierUserList?.length
      ) {
        return dispatch(cashiersList(allSetupcache.userList.cashierUserList));
      } else {
        const getcashiersList = await DataService.get(
          API.cashiers.getAllCashiers
        );
        if (!getcashiersList.data.error) {
          let filterdata = getcashiersList.data.data.filter((value) => {
            return value.role === "cashier";
          });
          let allSetupcache = getItem("setupCache");
          allSetupcache.userList.cashierUserList = filterdata;
          setItem("setupCache", allSetupcache);
          return dispatch(cashiersList(filterdata));
        } else {
          return dispatch(cashiersListErr(getcashiersList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.userList.cashierUserList) {
        return dispatch(cashiersList(allSetupcache.userList.cashierUserList));
      } else {
        return dispatch(cashiersListErr(err));
      }
    }
  };
};

const getCashiersById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let casierUserDetails;
      if (allSetupcache != null && allSetupcache.userList.cashierUserList) {
        casierUserDetails = allSetupcache.userList.cashierUserList.find(
          (val) => val._id == id
        );
      }

      if (casierUserDetails) {
        let data = {
          ...casierUserDetails,
          register_assigned_to: casierUserDetails.register_assigned_to._id,
        };
        return dispatch(cashiersId(data));
      } else {
        const cashiersByIdData = await DataService.get(
          `${API.cashiers.getcashiersById}/${id}`
        );
        if (!cashiersByIdData.data.error) {
          return dispatch(cashiersId(cashiersByIdData.data.data));
        } else {
          return dispatch(cashiersIdErr(cashiersByIdData.data));
        }
      }
    } catch (err) {
      dispatch(cashiersIdErr(err));
    }
  };
};

const deleteCashiers = (cashiersIds) => {
  return async (dispatch) => {
    try {
      const getDeletedcashiers = await DataService.post(
        API.cashiers.deleteAllCashiers,
        cashiersIds
      );

      if (!getDeletedcashiers.data.error) {
        return dispatch(cashiersDelete(getDeletedcashiers.data));
      } else {
        return dispatch(cashiersDeleteErr(getDeletedcashiers.data));
      }
    } catch (err) {
      dispatch(cashiersDeleteErr(err));
    }
  };
};

export {
  addOrUpdateCashiers,
  getAllCashiersList,
  getCashiersById,
  deleteCashiers,
};
