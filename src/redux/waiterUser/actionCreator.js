import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  waiterUserAdd,
  waiterUserAddErr,
  waiterUserList,
  waiterUserListErr,
  waiterUserId,
  waiterUserIdErr,
  waiterUserDelete,
  waiterUserDeleteErr,
} = actions;

const addOrUpdateWaiterUser = (formData, waiterUser_id) => {
  return async (dispatch) => {
    try {
      let getAddedwaiterUser = {};
      if (waiterUser_id) {
        getAddedwaiterUser = await DataService.put(
          `${API.waiterUser.addWaiterUser}/${waiterUser_id}`,
          formData
        );
      } else {
        getAddedwaiterUser = await DataService.post(
          API.waiterUser.addWaiterUser,
          formData
        );
      }
      if (!getAddedwaiterUser.data.error) {
        return dispatch(waiterUserAdd(getAddedwaiterUser.data.data));
      } else {
        return dispatch(waiterUserAddErr(getAddedwaiterUser.data.data));
      }
    } catch (err) {
      dispatch(waiterUserAddErr(err));
    }
  };
};

const getAllWaiterUserList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.userList != undefined &&
        allSetupcache.userList.waiterUserList != undefined &&
        allSetupcache.userList.waiterUserList.length &&
        checksell == "sell"
      ) {
        return dispatch(waiterUserList(allSetupcache.userList.waiterUserList));
      } else {
        const getwaiterUserList = await DataService.get(
          API.waiterUser.getAllWaiterUser
        );

        if (!getwaiterUserList.data.error) {
          let filterdata = getwaiterUserList.data.data.filter((value) => {
            return value.role === "waiter";
          });
          let allSetupcache = getItem("setupCache");
          allSetupcache.userList.waiterUserList = filterdata;
          setItem("setupCache", allSetupcache);
          return dispatch(waiterUserList(filterdata));
        } else {
          return dispatch(waiterUserListErr(getwaiterUserList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.userList.waiterUserList) {
        return dispatch(waiterUserList(allSetupcache.userList.waiterUserList));
      } else {
        return dispatch(waiterUserListErr(err));
      }
    }
  };
};

const getWaiterUserById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let waiteruserDetails;
      if (allSetupcache != null && allSetupcache.userList.waiterUserList) {
        waiteruserDetails = allSetupcache.userList.waiterUserList.find(
          (val) => val._id == id
        );
      }
      if (waiteruserDetails) {
        return dispatch(
          waiterUserId({
            ...waiteruserDetails,
            register_assigned_to: waiteruserDetails.register_assigned_to._id,
          })
        );
      } else {
        const waiterUserByIdData = await DataService.get(
          `${API.waiterUser.getWaiterUserById}/${id}`
        );

        if (!waiterUserByIdData.data.error) {
          return dispatch(waiterUserId(waiterUserByIdData.data.data));
        } else {
          return dispatch(waiterUserIdErr(waiterUserByIdData.data));
        }
      }
    } catch (err) {
      dispatch(waiterUserIdErr(err));
    }
  };
};

const deleteWaiterUser = (waiterUserIds) => {
  return async (dispatch) => {
    try {
      const getDeletedwaiterUser = await DataService.post(
        API.waiterUser.deleteAllWaiterUser,
        waiterUserIds
      );

      if (!getDeletedwaiterUser.data.error) {
        return dispatch(waiterUserDelete(getDeletedwaiterUser.data));
      } else {
        return dispatch(waiterUserDeleteErr(getDeletedwaiterUser.data));
      }
    } catch (err) {
      dispatch(waiterUserDeleteErr(err));
    }
  };
};

export {
  addOrUpdateWaiterUser,
  getAllWaiterUserList,
  getWaiterUserById,
  deleteWaiterUser,
};
