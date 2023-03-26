const actions = {
  TAX_NAME_LIST: "TAX_NAME_LIST",
  TAX_NAME_LIST_ERR: "TAX_NAME_LIST_ERR",
  TAX_GROUP_ADD: "TAX_GROUP_ADD",
  TAX_GROUP_ADD_ERR: "TAX_GROUP_ADD_ERR",
  TAX_GROUP_LIST: "TAX_GROUP_LIST",
  TAX_GROUP_LIST_ERR: "TAX_GROUP_LIST_ERR",
  TAX_GROUP_ID: "TAX_GROUP_ID",
  TAX_GROUP_ID_ERR: "TAX_GROUP_ID_ERR",
  TAX_GROUP_DELETED: "TAX_GROUP_DELETED",
  TAX_GROUP_DELETED_ERR: "TAX_GROUP_DELETED_ERR",

  taxGroupList: (taxGroupList) => {
    return {
      type: actions.TAX_GROUP_LIST,
      taxGroupList,
    };
  },

  taxGroupListErr: (err) => {
    return {
      type: actions.TAX_GROUP_LIST_ERR,
      err,
    };
  },
  taxName: (taxNameList) => {
    return {
      type: actions.TAX_NAME_LIST,
      taxNameList,
    };
  },
  taxNameErr: (Err) => {
    return {
      type: actions.TAX_NAME_LIST_ERR,
      Err,
    };
  },
  taxGroupAdd: (taxGroupData) => {
    return {
      type: actions.TAX_GROUP_ADD,
      error: false,
      taxGroupData,
    };
  },

  taxGroupAddErr: (err) => {
    return {
      type: actions.TAX_GROUP_ADD_ERR,
      err,
    };
  },
  taxGroupList: (taxGroupList) => {
    return {
      type: actions.TAX_GROUP_LIST,
      taxGroupList,
    };
  },
  taxGroupListErr: (err) => {
    return {
      type: actions.TAX_GROUP_LIST_ERR,
      err,
    };
  },
  taxGroupId: (taxGroupIdData) => {
    return {
      type: actions.TAX_GROUP_ID,
      taxGroupIdData,
    };
  },
  taxGroupIdErr: (err) => {
    return {
      type: actions.TAX_GROUP_ID_ERR,
      err,
    };
  },
  taxGroupDelete: (taxGroupdeletedData) => {
    return {
      type: actions.TAX_GROUP_DELETED,
      taxGroupdeletedData,
    };
  },
  taxGroupDeleteErr: (err) => {
    return {
      type: actions.TAX_GROUP_DELETED_ERR,
      err,
    };
  },
};

export default actions;
