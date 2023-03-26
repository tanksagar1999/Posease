import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
import axios from "axios";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  RegisterList,
  RegisterListErr,
  changeRegisterSuccess,
  changeRegisterErr,
  registerId,
  registerIdErr,
  registerAdd,
  registerAddErr,
  registerDelete,
  registerDeleteErr,
} = actions;

const getAllBingageList = (checkSell) => {
  return async (dispatch) => {
    try {
      const allBingages = await DataService.get(API.bingage.getAllBingages);
      if (allBingages?.data?.data) {
        return allBingages.data.data;
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache != null && allSetupcache.register) {
        return dispatch(RegisterList(allSetupcache.register));
      } else {
        return dispatch(RegisterListErr(err));
      }
    }
  };
};

const getRegisterById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let registerDetails;
      if (allSetupcache != null && allSetupcache.register) {
        registerDetails = allSetupcache.register.find((val) => val._id == id);
      }
      if (registerDetails) {
        return dispatch(registerId(registerDetails));
      } else {
        const registerByIdData = await DataService.get(
          `${API.register.getRegisterById}/${id}`
        );
        if (!registerByIdData.data.error) {
          return dispatch(registerId(registerByIdData.data.data));
        } else {
          return dispatch(registerIdErr(registerByIdData.data));
        }
      }
    } catch (err) {
      dispatch(registerIdErr(err));
    }
  };
};

const addOrUpdateBingage = (formData, register_id) => {
  return async (dispatch) => {
    try {
      let response = await axios.post(
        "https://api.bingage.com/pos/posToken",
        new URLSearchParams({
          posApiToken: formData.bingageKey,
        }),
        {
          headers: {
            Authorization: `Bearer ${formData.bingageKey}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response) {
        if (register_id !== "") {
          const getbingageData = await DataService.put(
            API.bingage.updateBingage + "/" + register_id,
            formData
          );
          return getbingageData;
        } else {
          const getbingageData = await DataService.post(
            API.bingage.addBingage,
            formData
          );
          return getbingageData;
        }
      }
    } catch (err) {
      if (err && err?.response?.data) {
        return err.response.data;
      }
    }
  };
};

const SwitchRegister = (payload) => {
  return async (dispatch) => {
    try {
      let getSwitchRegister = {};
      getSwitchRegister = await DataService.post(
        API.register.SwitchCurrentRegister,
        payload
      );
      if (!getSwitchRegister.data.error) {
        setItem("access_token", getSwitchRegister.data.data.token);
        return dispatch(changeRegisterSuccess(getSwitchRegister.data.data));
      } else {
        return dispatch(changeRegisterErr(getSwitchRegister.data.error));
      }
    } catch (err) {
      dispatch(changeRegisterErr(err));
    }
  };
};

const deleteBingages = (RegisterIds) => {
  return async (dispatch) => {
    try {
      const getDeletedRegister = await DataService.post(
        API.bingage.deleteAllBingages,
        RegisterIds
      );

      if (!getDeletedRegister.data.error) {
        return getDeletedRegister.data;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };
};
export {
  getAllBingageList,
  SwitchRegister,
  getRegisterById,
  deleteBingages,
  addOrUpdateBingage,
};
