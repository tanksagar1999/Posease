const actions = {
  USERS_LIST: "USERS_LIST",
  USERS_LIST_ERR: "USERS_LIST_ERR",
  CHNAGE_STATUS_SUCCESS: "CHNAGE_STATUS_SUCCESS",
  CHANGE_STATUS_ERR: "CHANGE_STATUS_ERR",

  usersList: (UsersList) => {
    return {
      type: actions.USERS_LIST,
      UsersList,
    };
  },

  usersListErr: (err) => {
    return {
      type: actions.USERS_LIST_ERR,
      err,
    };
  },
  changeStatusSuccess: (status) => {
    return {
      type: actions.CHNAGE_STATUS_SUCCESS,
      status,
    };
  },
  changeStatusErr: (err) => {
    return {
      type: actions.CHANGE_STATUS_ERR,
      err,
    };
  },
};

export default actions;
