const actions = {
  APP_USER_ADD: "APP_USER_ADD",
  APP_USER_ADD_ERR: "APP_USER_ADD_ERR",
  APP_USER_LIST: "APP_USER_LIST",
  APP_USER_LIST_ERR: "APP_USER_LIST_ERR",
  APP_USER_ID: "APP_USER_ID",
  APP_USER_ID_ERR: "APP_USER_ID_ERR",
  APP_USER_DELETED: "APP_USER_DELETED",
  APP_USER_DELETED_ERR: "APP_USER_DELETED_ERR",

  appUserAdd: (appUserData) => {
    return {
      type: actions.APP_USER_ADD,
      error: false,
      appUserData,
    };
  },

  appUserAddErr: (err) => {
    return {
      type: actions.APP_USER_ADD_ERR,
      error: true,
      err,
    };
  },
  appUserList: (appUserList) => {
    return {
      type: actions.APP_USER_LIST,
      appUserList,
    };
  },
  appUserListErr: (err) => {
    return {
      type: actions.APP_USER_LIST_ERR,
      err,
    };
  },
  appUserId: (appUserIdData) => {
    return {
      type: actions.APP_USER_ID,
      appUserIdData,
    };
  },
  appUserIdErr: (err) => {
    return {
      type: actions.APP_USER_ID_ERR,
      err,
    };
  },
  appUserDelete: (appUserDeletedData) => {
    return {
      type: actions.APP_USER_DELETED,
      appUserDeletedData,
    };
  },
  appUserDeleteErr: (err) => {
    return {
      type: actions.APP_USER_DELETED_ERR,
      err,
    };
  },
};

export default actions;
