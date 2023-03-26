const actions = {
  KITCHEN_USER_ADD: "KITCHEN_USER_ADD",
  KITCHEN_USER_ADD_ERR: "KITCHEN_USER_ADD_ERR",
  KITCHEN_USER_LIST: "KITCHEN_USER_LIST",
  KITCHEN_USER_LIST_ERR: "KITCHEN_USER_LIST_ERR",
  KITCHEN_USER_ID: "KITCHEN_USER_ID",
  KITCHEN_USER_ID_ERR: "KITCHEN_USER_ID_ERR",
  KITCHEN_USER_DELETED: "KITCHEN_USER_DELETED",
  KITCHEN_USER_DELETED_ERR: "KITCHEN_USER_DELETED_ERR",

  kitchenUserAdd: (kitchenUserData) => {
    return {
      type: actions.KITCHEN_USER_ADD,
      kitchenUserData,
    };
  },

  kitchenUserAddErr: (err) => {
    return {
      type: actions.KITCHEN_USER_ADD_ERR,
      err,
    };
  },
  kitchenUserList: (kitchenUserList) => {
    return {
      type: actions.KITCHEN_USER_LIST,
      kitchenUserList,
    };
  },
  kitchenUserListErr: (err) => {
    return {
      type: actions.KITCHEN_USER_LIST_ERR,
      err,
    };
  },
  kitchenUserId: (kitchenUserIdData) => {
    return {
      type: actions.KITCHEN_USER_ID,
      kitchenUserIdData,
    };
  },
  kitchenUserIdErr: (err) => {
    return {
      type: actions.KITCHEN_USER_ID_ERR,
      err,
    };
  },
  kitchenUserDelete: (kitchenUserDeletedData) => {
    return {
      type: actions.KITCHEN_USER_DELETED,
      kitchenUserDeletedData,
    };
  },
  kitchenUserDeleteErr: (err) => {
    return {
      type: actions.KITCHENU_USER_DELETED_ERR,
      err,
    };
  },
};

export default actions;
