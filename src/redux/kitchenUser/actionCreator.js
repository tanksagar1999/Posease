import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  kitchenUserAdd,
  kitchenUserAddErr,
  kitchenUserList,
  kitchenUserListErr,
  kitchenUserId,
  kitchenUserIdErr,
  kitchenUserDelete,
  kitchenUserDeleteErr,
} = actions;

const addOrUpdatekitchenUser = (formData, kitchenUser_id) => {
  return async (dispatch) => {
    try {
      let getAddedkitchenUser = {};
      if (kitchenUser_id) {
        getAddedkitchenUser = await DataService.put(
          `${API.kitchenUser.addKitchenUser}/${kitchenUser_id}`,
          formData
        );
      } else {
        getAddedkitchenUser = await DataService.post(
          API.kitchenUser.addKitchenUser,
          formData
        );
      }
      if (!getAddedkitchenUser.data.error) {
        return dispatch(kitchenUserAdd(getAddedkitchenUser.data.data));
      } else {
        return dispatch(kitchenUserAddErr(getAddedkitchenUser.data.data));
      }
    } catch (err) {
      dispatch(kitchenUserAddErr(err));
    }
  };
};

const getAllkitchenUserList = (checksell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.userList != undefined &&
        allSetupcache.userList.kitchenUserList != undefined &&
        allSetupcache.userList.kitchenUserList.length &&
        checksell == "sell"
      ) {
        return dispatch(
          kitchenUserList(allSetupcache.userList.kitchenUserList)
        );
      } else {
        const getkitchenUserList = await DataService.get(
          API.kitchenUser.getAllKitchenUser
        );
        if (!getkitchenUserList.data.error) {
          let filterdata = getkitchenUserList.data.data.filter((value) => {
            return value.role === "kitchen_user";
          });
          let allSetupcache = getItem("setupCache");
          allSetupcache.userList.kitchenUserList = filterdata;
          setItem("setupCache", allSetupcache);
          return dispatch(kitchenUserList(filterdata));
        } else {
          return dispatch(kitchenUserListErr(getkitchenUserList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.userList.kitchenUserList) {
        return dispatch(
          kitchenUserList(allSetupcache.userList.kitchenUserList)
        );
      } else {
        return dispatch(kitchenUserListErr(err));
      }
    }
  };
};

const getkitchenUserById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let kitchenUserDetails;
      if (allSetupcache != null && allSetupcache.userList.kitchenUserList) {
        kitchenUserDetails = allSetupcache.userList.kitchenUserList.find(
          (val) => val._id == id
        );
      }
      if (kitchenUserDetails) {
        return dispatch(
          kitchenUserId({
            ...kitchenUserDetails,
            register_assigned_to: kitchenUserDetails.register_assigned_to._id,
          })
        );
      } else {
        const kitchenUserByIdData = await DataService.get(
          `${API.kitchenUser.getKitchenUserById}/${id}`
        );
        if (!kitchenUserByIdData.data.error) {
          return dispatch(kitchenUserId(kitchenUserByIdData.data.data));
        } else {
          return dispatch(kitchenUserIdErr(kitchenUserByIdData.data));
        }
      }
    } catch (err) {
      dispatch(kitchenUserIdErr(err));
    }
  };
};

const deletekitchenUser = (kitchenUserIds) => {
  return async (dispatch) => {
    try {
      const getDeletedkitchenUser = await DataService.post(
        API.kitchenUser.deleteAllKitchenUser,
        kitchenUserIds
      );

      if (!getDeletedkitchenUser.data.error) {
        return dispatch(kitchenUserDelete(getDeletedkitchenUser.data));
      } else {
        return dispatch(kitchenUserDeleteErr(getDeletedkitchenUser.data));
      }
    } catch (err) {
      dispatch(kitchenUserDeleteErr(err));
    }
  };
};

export {
  addOrUpdatekitchenUser,
  getAllkitchenUserList,
  getkitchenUserById,
  deletekitchenUser,
};
