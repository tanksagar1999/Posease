const actions = {
  ADDTIONAL_CHARGE_ADD: "ADDTIONAL_CHARGE_ADD",
  ADDTIONAL_CHARGE_ADD_ERR: "ADDTIONAL_CHARGE_ADD_ERR",
  REGISTER_NAME_LIST: "REGISTER_NAME_LIST",
  REGISTER_NAME_LIST_ERR: "REGISTER_NAME_LIST_ERR",
  ADDTIONAL_CHARGE_LIST: "ADDTIONAL_CHARGE_LIST",
  ADDTIONAL_CHARGE_LIST_ERR: "ADDTIONAL_CHARGE_LIST_ERR",
  ADDTIONAL_CHARGE_ID: "ADDTIONAL_CHARGE_ID",
  ADDTIONAL_CHARGE_ID_ERR: "ADDTIONAL_CHARGE_ID_ERR",
  ADDTIONAL_CHARGE_DELETED: "ADDTIONAL_CHARGE_DELETED",
  ADDTIONAL_CHARGE_DELETED_ERR: "ADDTIONAL_CHARGE_DELETED_ERR",

  AddtionalChargeAdd: (AddtionalChargeData) => {
    return {
      type: actions.ADDTIONAL_CHARGE_ADD,
      error: false,
      AddtionalChargeData,
    };
  },

  AddtionalChargeAddErr: (err) => {
    return {
      type: actions.ADDTIONAL_CHARGE_ADD_ERR,
      error: true,
      err,
    };
  },
  registerName: (registerNameList) => {
    return {
      type: actions.REGISTER_NAME_LIST,
      registerNameList,
    };
  },
  registerNameErr: (RegisterErr) => {
    return {
      type: actions.REGISTER_NAME_LIST_ERR,
      RegisterErr,
    };
  },
  AddtionalChargeList: (AddtionalChargeList) => {
    return {
      type: actions.ADDTIONAL_CHARGE_LIST,
      AddtionalChargeList,
    };
  },
  AddtionalChargeListErr: (err) => {
    return {
      type: actions.ADDTIONAL_CHARGE_LIST_ERR,
      err,
    };
  },
  AddtionalChargeId: (AddtionalChargeIdData) => {
    return {
      type: actions.ADDTIONAL_CHARGE_ID,
      AddtionalChargeIdData,
    };
  },
  AddtionalChargeIdErr: (err) => {
    return {
      type: actions.ADDTIONAL_CHARGE_ID_ERR,
      err,
    };
  },
  AddtionalChargeDelete: (AddtionalChargeDeletedData) => {
    return {
      type: actions.ADDTIONAL_CHARGE_DELETED,
      AddtionalChargeDeletedData,
    };
  },
  AddtionalChargeDeleteErr: (err) => {
    return {
      type: actions.ADDTIONAL_CHARGE_DELETED_ERR,
      err,
    };
  },
};

export default actions;
