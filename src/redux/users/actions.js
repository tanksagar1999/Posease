const actions = {
  ACTIVE_USERS_LIST: "ACTIVE_USERS_LIST",
  ACTIVE_USERS_LIST_ERR: "ACTIVE_USERS_LIST_ERR",
  CHNAGE_STATUS_SUCCESS: "CHNAGE_STATUS_SUCCESS",
  CHANGE_STATUS_ERR: "CHANGE_STATUS_ERR",
  USER_DETAIL: "USER_DETAIL",
  USER_DETAIL_ERR: "USER_DETAIL_ERR",
  STATUS_FILTER_USER_LIST: 'STATUS_FILTER_USER_LIST',
  USER_FILTER: 'USER_FILTER',
  USER_ERR: 'USER_ERR',
  USER_DELETE: 'USER_DELETE',
  USER_DELETE_ERR: 'USER_DELETE_ERR',

  activeUsersList: (ActiveUsersList) => {
    return {
      type: actions.ACTIVE_USERS_LIST,
      ActiveUsersList,
    };
  },
  activeUsersListErr: (err) => {
    return {
      type: actions.ACTIVE_USERS_LIST_ERR,
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
  userDetailErr: (err) => {
    return {
      type: actions.USER_DETAIL_ERR,
      error: true,
      err,
    };
  },
  userDetail: userData => {
    return {
      type: actions.USER_DETAIL,
      error: false,
      userData
    };
  },
  UserDeleteErr: (err) => {
    return {
      type: actions.USER_DELETE_ERR,
      err,
    };
  },
  UserDelete: deleteItem => {
    return {
      type: actions.USER_DELETE,
      deleteItem
    };
  },
  statusColfilter: status => {
    return {
      type: actions.STATUS_FILTER_USER_LIST,
      payload: status
    };
  },
  userFilter: searchText => {
    return {
      type: actions.USER_FILTER,
      payload: searchText
    };
  },
  userFilterErr: (err) => {
    return {
      type: actions.USER_FILTER_ERR,
      err,
    };
  },
};

export default actions;
