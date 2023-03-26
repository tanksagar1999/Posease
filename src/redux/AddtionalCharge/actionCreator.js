import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  AddtionalChargeAdd,
  AddtionalChargeAddErr,
  registerName,
  registerNameErr,
  AddtionalChargeList,
  AddtionalChargeListErr,
  AddtionalChargeId,
  AddtionalChargeIdErr,
  AddtionalChargeDelete,
  AddtionalChargeDeleteErr,
} = actions;

const addOrUpdateAddtionalCharge = (formData, AddtionalCharge_id) => {
  return async (dispatch) => {
    try {
      let getAddedAddtionalCharge = {};
      if (AddtionalCharge_id) {
        getAddedAddtionalCharge = await DataService.put(
          `${API.addtionalCharge.addAddtionalCharge}/${AddtionalCharge_id}`,
          formData
        );
      } else {
        getAddedAddtionalCharge = await DataService.post(
          API.addtionalCharge.addAddtionalCharge,
          formData
        );
      }
      if (!getAddedAddtionalCharge.data.error) {
        return dispatch(AddtionalChargeAdd(getAddedAddtionalCharge.data.data));
      } else {
        return dispatch(
          AddtionalChargeAddErr(getAddedAddtionalCharge.data.data)
        );
      }
    } catch (err) {
      dispatch(AddtionalChargeAddErr(err));
    }
  };
};

const getAllRegisterNameList = () => {
  return async (dispatch) => {
    try {
      const getregisterName = await DataService.get(
        API.pricebook.getAllRegisters
      );
      if (!getregisterName.data.error) {
        return dispatch(registerName(getregisterName.data.data));
      } else {
        return dispatch(registerNameErr(getregisterName.data));
      }
    } catch (err) {
      dispatch(registerNameErr(err));
    }
  };
};

const getAllAddtionalChargeList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.additionalCharges != undefined &&
        allSetupcache.additionalCharges.length &&
        checksell == "sell"
      ) {
        return dispatch(AddtionalChargeList(allSetupcache.additionalCharges));
      } else {
        const getAddtionalChargeList = await DataService.get(
          API.addtionalCharge.getAllAddtionalCharge
        );
        if (!getAddtionalChargeList.data.error) {
          let allSetupcache = getItem("setupCache");
          allSetupcache.additionalCharges = getAddtionalChargeList.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(
            AddtionalChargeList(getAddtionalChargeList.data.data)
          );
        } else {
          return dispatch(AddtionalChargeListErr(getAddtionalChargeList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.additionalCharges) {
        return dispatch(AddtionalChargeList(allSetupcache.additionalCharges));
      } else {
        return dispatch(AddtionalChargeListErr(err));
      }
    }
  };
};

const getAddtionalChargeById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let addtionChargesDetails;
      if (allSetupcache != null && allSetupcache.additionalCharges) {
        addtionChargesDetails = allSetupcache.additionalCharges.find(
          (val) => val._id == id
        );
      }
      if (addtionChargesDetails) {
        return dispatch(
          AddtionalChargeId({
            ...addtionChargesDetails,
            tax_group: addtionChargesDetails.tax_group._id,
          })
        );
      } else {
        const AddtionalChargeByIdData = await DataService.get(
          `${API.addtionalCharge.getAddtionalChargeById}/${id}`
        );
        if (!AddtionalChargeByIdData.data.error) {
          return dispatch(AddtionalChargeId(AddtionalChargeByIdData.data.data));
        } else {
          return dispatch(AddtionalChargeIdErr(AddtionalChargeByIdData.data));
        }
      }
    } catch (err) {
      dispatch(AddtionalChargeIdErr(err));
    }
  };
};

const deleteAddtionalCharge = (AddtionalChargeIds) => {
  return async (dispatch) => {
    try {
      const getDeletedAddtionalCharge = await DataService.post(
        API.addtionalCharge.deleteAllAddtionalCharge,
        AddtionalChargeIds
      );

      if (!getDeletedAddtionalCharge.data.error) {
        return dispatch(AddtionalChargeDelete(getDeletedAddtionalCharge.data));
      } else {
        return dispatch(
          AddtionalChargeDeleteErr(getDeletedAddtionalCharge.data)
        );
      }
    } catch (err) {
      dispatch(AddtionalChargeDeleteErr(err));
    }
  };
};

export {
  addOrUpdateAddtionalCharge,
  getAllRegisterNameList,
  getAllAddtionalChargeList,
  getAddtionalChargeById,
  deleteAddtionalCharge,
};
