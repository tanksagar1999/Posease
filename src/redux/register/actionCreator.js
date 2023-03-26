import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
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

const getAllRegisterList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let activeregiter =
        allSetupcache != null &&
        allSetupcache.register.find((item) => item.active);

      if (
        allSetupcache &&
        allSetupcache.register != undefined &&
        checkSell == "sell"
      ) {
        return dispatch(RegisterList(allSetupcache.register));
      } else {
        const AllRegisterListData = await DataService.get(
          API.register.getAllRegister
        );

        if (!AllRegisterListData.data.error) {
          AllRegisterListData.data.data.map((val) => {
            if (activeregiter && val._id == activeregiter._id) {
              val.active = true;
            } else {
              val.active = false;
            }
          });
          console.log("sagartanksagar", AllRegisterListData);
          allSetupcache.register = AllRegisterListData.data.data;
          setItem("setupCache", allSetupcache);
          return dispatch(RegisterList(AllRegisterListData.data.data));
        } else {
          return dispatch(RegisterListErr(AllRegisterListData.data));
        }
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

const addOrUpdateRegister = (formData, register_id) => {
  return async (dispatch) => {
    try {
      let getAddedregister = {};
      if (register_id) {
        getAddedregister = await DataService.put(
          `${API.register.addRegister}/${register_id}`,
          formData
        );
      } else {
        getAddedregister = await DataService.post(
          API.register.addRegister,
          formData
        );
      }
      if (!getAddedregister.data.error) {
        return dispatch(registerAdd(getAddedregister.data.data));
      } else {
        return dispatch(registerAddErr(getAddedregister.data.data));
      }
    } catch (err) {
      dispatch(registerAddErr(err));
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

const deleteRegister = (RegisterIds) => {
  return async (dispatch) => {
    let allSetupcache = getItem("setupCache");
    let activeregiter =
      allSetupcache != null &&
      allSetupcache.register.find((item) => item.active);
    try {
      const getDeletedRegister = await DataService.post(
        API.register.deleteAllRegister,
        RegisterIds
      );

      if (!getDeletedRegister.data.error) {
        if (RegisterIds.ids.find((val) => val == activeregiter._id)) {
          allSetupcache.register.map((val) => {
            if (val.is_main) {
              val.active = true;
            } else {
              val.active = false;
            }
          });
          setItem("setupCache", allSetupcache);
        }

        return dispatch(registerDelete(getDeletedRegister.data));
      } else {
        return dispatch(registerDeleteErr(getDeletedRegister.data));
      }
    } catch (err) {
      dispatch(registerDeleteErr(err));
    }
  };
};
export {
  getAllRegisterList,
  SwitchRegister,
  getRegisterById,
  deleteRegister,
  addOrUpdateRegister,
};
