import actions from "./actions";
const { DataService } = require("../../config/dataService/dataService");
const { API } = require("../../config/api/index");

const {
  usersList,
  usersListErr,
  changeStatusSuccess,
  changeStatusErr,
} = actions;

const getAllUsersList = () => {
  return async (dispatch) => {
    try {
      const UsersListData = await DataService.get(API.enquiry.list);
      if (!UsersListData.data.error) {
        return dispatch(usersList(UsersListData.data.data));
      } else {
        return dispatch(usersListErr(UsersListData.data));
      }
    } catch (err) {
      dispatch(usersListErr(err));
    }
  };
};
const changeStatus = (change) => {
  return async (dispatch) => {
    try {
      const changeStatusdata = await DataService.post(
        API.enquiry.changeStatus,
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

export { getAllUsersList, changeStatus };
