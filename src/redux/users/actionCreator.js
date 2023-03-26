import actions from "./actions";
import { getItem, setItem } from "../../utility/localStorageControl";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  activeUsersList,
  activeUsersListErr,
  changeStatusSuccess,
  changeStatusErr,
  userDetail,
  userDetailErr,
  statusColfilter,
  userFilter,
  userFilterErr,
  UserDeleteErr,
  UserDelete,
} = actions;

const getAllActiveUsersList = () => {
  return async (dispatch) => {
    try {
      const ActiveUsersListData = await DataService.get(API.users.list);
      if (!ActiveUsersListData.data.error) {
        return dispatch(activeUsersList(ActiveUsersListData.data.data));
      } else {
        return dispatch(activeUsersListErr(ActiveUsersListData.data));
      }
    } catch (err) {
      dispatch(activeUsersListErr(err));
    }
  };
};

const getUserDetail = (checksell) => {
  return async (dispatch) => {
    try {
      let getuserDetails = getItem("userDetails");

      if (checksell == "sell" && getuserDetails) {
        return dispatch(userDetail(getuserDetails));
      } else {
        const UserDetail = await DataService.get(API.users.getUserById);

        if (!UserDetail.data.error) {
          setItem("userDetails", UserDetail.data.data);
          return dispatch(userDetail(UserDetail.data.data));
        } else {
          return dispatch(userDetailErr(UserDetail.data));
        }
      }
    } catch (err) {
      dispatch(userDetailErr(err));
    }
  };
};

const SaveAccountDetail = (payloads) => {
  return async (dispatch) => {
    const AccountDetail = await DataService.post(
      API.users.updateUserDetail,
      payloads
    );
    if (!AccountDetail.data.error) {
      return dispatch(userDetail(AccountDetail.data.data));
    } else {
      return dispatch(userDetailErr(AccountDetail.data));
    }
  };
};

const FilterActiveInactiveStatus = (status) => {
  return async (dispatch) => {
    dispatch(statusColfilter(status));
  };
};

const changeStatus = (change) => {
  return async (dispatch) => {
    try {
      const changeStatusdata = await DataService.post(
        API.users.deactiveStatus,
        change
      );
      if (!changeStatusdata.data.error) {
        return dispatch(changeStatusSuccess(changeStatusdata.data.data));
      } else {
        return dispatch(changeStatusErr(changeStatusdata.data.error));
      }
    } catch (err) {
      dispatch(changeStatusErr(err));
    }
  };
};

const deleteUser = (UserIds) => {
  return async (dispatch) => {
    try {
      const getDeletedUser = await DataService.post(
        `${API.users.deleteUser}`,
        UserIds
      );
      if (!getDeletedUser.data.error) {
        return dispatch(UserDelete(getDeletedUser.data));
      } else {
        return dispatch(UserDeleteErr(getDeletedUser.data));
      }
    } catch (err) {
      dispatch(UserDeleteErr(err));
    }
  };
};
const ExportUser = (payloads) => {
  return async (dispatch) => {
    const resp = await DataService.post(API.users.exportUser, payloads);
  };
};

export {
  getAllActiveUsersList,
  changeStatus,
  getUserDetail,
  SaveAccountDetail,
  FilterActiveInactiveStatus,
  deleteUser,
  ExportUser,
};
