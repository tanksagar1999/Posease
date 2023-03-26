const actions = {
  REGISTER_LIST: "REGISTER_LIST",
  REGISTER_LIST_ERR: "REGISTER_LIST_ERR",
  CHANGE_REGISTER_SUCCESS: "CHANGE_REGISTER_SUCCESS",
  CHANGE_REGISTER_ERR: "CHANGE_REGISTER_ERR",
  REGISTER_ID: "REGISTER_ID",
  REGISTER_ID_ERR: "REGISTER_ID_ERR",
  REGISTER_ADD: "REGISTER_ADD",
  REGISTER_ADD_ERR: "REGISTER_ADD_ERR",
  REGISTER_DELETED: "REGISTER_DELETED",
  REGISTER_DELETED_ERR: "REGISTER_DELETED_ERR",

  RegisterList: (RegisterList) => {
    return {
      type: actions.REGISTER_LIST,
      RegisterList,
    };
  },
  RegisterListErr: (err) => {
    return {
      type: actions.REGISTER_LIST_ERR,
      err,
    };
  },
  changeRegisterSuccess: (data) => {
    return {
      type: actions.CHANGE_REGISTER_SUCCESS,
      data,
    };
  },
  changeRegisterErr: (err) => {
    return {
      type: actions.CHANGE_REGISTER_ERR,
      err,
    };
  },
  registerAdd: (registerData) => {
    return {
      type: actions.REGISTER_ADD,
      registerData,
    };
  },

  registerAddErr: (err) => {
    return {
      type: actions.REGISTER_ADD_ERR,
      err,
    };
  },
  registerId: (registerIdData) => {
    return {
      type: actions.REGISTER_ID,
      registerIdData,
    };
  },
  registerIdErr: (err) => {
    return {
      type: actions.REGISTER_ID_ERR,
      err,
    };
  },
  registerDelete: (RegisterDeletedData) => {
    return {
      type: actions.REGISTER_DELETED,
      RegisterDeletedData,
    };
  },
  registerDeleteErr: (err) => {
    return {
      type: actions.REGISTER_DELETED_ERR,
      err,
    };
  },
};

export default actions;
