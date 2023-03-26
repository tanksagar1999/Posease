import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  appUserAdd,
  appUserAddErr,
  appUserList,
  appUserListErr,
  appUserId,
  appUserIdErr,
  appUserDelete,
  appUserDeleteErr,
} = actions;

const addOrUpdateappUser = (formData, appUser_id) => {
  return async (dispatch) => {
    try {
      let getAddedappUser = {};
      if (appUser_id) {
        getAddedappUser = await DataService.put(
          `${API.appUser.addAppUser}/${appUser_id}`,
          formData
        );
      } else {
        getAddedappUser = await DataService.post(
          API.appUser.addAppUser,
          formData
        );
      }
      if (!getAddedappUser.data.error) {
        return dispatch(appUserAdd(getAddedappUser.data.data));
      } else {
        return dispatch(appUserAddErr(getAddedappUser.data.data));
      }
    } catch (err) {
      dispatch(appUserAddErr(err));
    }
  };
};

const getAllappUserList = (checkSell) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      if (
        allSetupcache != null &&
        allSetupcache.userList != undefined &&
        allSetupcache.userList.appUserList != undefined &&
        allSetupcache.userList.appUserList.length &&
        checkSell == "sell"
      ) {
        return dispatch(appUserList(allSetupcache.userList.appUserList));
      } else {
        const getappUserList = await DataService.get(API.appUser.getAllAppUser);
        if (!getappUserList.data.error) {
          let filterdata = getappUserList.data.data.filter((value) => {
            return value.role === "app_user";
          });
          let allSetupcache = getItem("setupCache");
          allSetupcache.userList.appUserList = filterdata;
          setItem("setupCache", allSetupcache);
          return dispatch(appUserList(filterdata));
        } else {
          return dispatch(appUserListErr(getappUserList.data));
        }
      }
    } catch (err) {
      let allSetupcache = getItem("setupCache");
      if (allSetupcache && allSetupcache.userList.appUserList) {
        return dispatch(appUserList(allSetupcache.userList.appUserList));
      } else {
        return dispatch(appUserListErr(err));
      }
    }
  };
};

const getappUserById = (id) => {
  return async (dispatch) => {
    try {
      let allSetupcache = getItem("setupCache");
      let appuserDetails;
      if (allSetupcache != null && allSetupcache.userList.appUserList) {
        appuserDetails = allSetupcache.userList.appUserList.find(
          (val) => val._id == id
        );
      }
      if (appuserDetails) {
        return dispatch(appUserId(appuserDetails));
      } else {
        const appUserByIdData = await DataService.get(
          `${API.appUser.getAppUserById}/${id}`
        );
        if (!appUserByIdData.data.error) {
          return dispatch(appUserId(appUserByIdData.data.data));
        } else {
          return dispatch(appUserIdErr(appUserByIdData.data));
        }
      }
    } catch (err) {
      dispatch(appUserIdErr(err));
    }
  };
};

const deleteappUser = (appUserIds) => {
  return async (dispatch) => {
    try {
      const getDeletedappUser = await DataService.post(
        API.appUser.deleteAllAppUser,
        appUserIds
      );

      if (!getDeletedappUser.data.error) {
        return dispatch(appUserDelete(getDeletedappUser.data));
      } else {
        return dispatch(appUserDeleteErr(getDeletedappUser.data));
      }
    } catch (err) {
      dispatch(appUserDeleteErr(err));
    }
  };
};

export { addOrUpdateappUser, getAllappUserList, getappUserById, deleteappUser };
