const actions = {
  WAITER_USER_ADD: "WAITER_USER_ADD",
  WAITER_USER_ADD_ERR: "WAITER_USER_ADD_ERR",
  WAITER_USER_LIST: "WAITER_USER_LIST",
  WAITER_USER_LIST_ERR: "WAITER_USER_LIST_ERR",
  WAITER_USER_ID: "WAITER_USER_ID",
  WAITER_USER_ID_ERR: "WAITER_USER_ID_ERR",
  WAITER_USER_DELETED: "WAITER_USER_DELETED",
  WAITER_USER_DELETED_ERR: "WAITER_USER_DELETED_ERR",

  waiterUserAdd: (waiterUserData) => {
    return {
      type: actions.WAITER_USER_ADD,
      waiterUserData,
    };
  },

  waiterUserAddErr: (err) => {
    return {
      type: actions.WAITER_USER_ADD_ERR,
      err,
    };
  },
  waiterUserList: (waiterUserList) => {
    return {
      type: actions.WAITER_USER_LIST,
      waiterUserList,
    };
  },
  waiterUserListErr: (err) => {
    return {
      type: actions.WAITER_USER_LIST_ERR,
      err,
    };
  },
  waiterUserId: (waiterUserIdData) => {
    return {
      type: actions.WAITER_USER_ID,
      waiterUserIdData,
    };
  },
  waiterUserIdErr: (err) => {
    return {
      type: actions.WAITER_USER_ID_ERR,
      err,
    };
  },
  waiterUserDelete: (waiterUserDeletedData) => {
    return {
      type: actions.WAITER_USER_DELETED,
      waiterUserDeletedData,
    };
  },
  waiterUserDeleteErr: (err) => {
    return {
      type: actions.WAITER_USER_DELETED_ERR,
      err,
    };
  },
};

export default actions;
