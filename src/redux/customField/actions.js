const actions = {
  CUSTOMFIELD_ADD: "CUSTOMFIELD_ADD",
  CUSTOMFIELD_ADD_ERR: "CUSTOMFIELD_ADD_ERR",
  CUSTOMFIELD_ID: "CUSTOMFIELD_ID",
  CUSTOMFIELD_ID_ERR: "CUSTOMFIELD_ID_ERR",
  CUSTOMFIELD_DELETED: "CUSTOMFIELD_DELETED",
  CUSTOMFIELD_DELETED_ERR: "CUSTOMFIELD_DELETED_ERR",
  PATTY_CASH_LIST: "PATTY_CASH_LIST",
  PATTY_CASH_LIST_ERR: "PATTY_CASH_LIST_ERR",
  PAYMENT_TYPE_LIST: "PAYMENT_TYPE_LIST",
  PAYMENT_TYPE_LIST_ERR: "PAYMENT_TYPE_LIST_ERR",
  ADDTIONAL_LIST: "ADDTIONAL_LIST",
  ADDTIONAL_LIST_ERR: "ADDTIONAL_LIST_ERR",
  TAG_LIST: "TAG_LIST",
  TAG_LIST_ERR: "TAG_LIST_ERR",
  CustomFieldAdd: (CustomFieldData) => {
    return {
      type: actions.CUSTOMFIELD_ADD,
      error: false,
      CustomFieldData,
    };
  },

  CustomFieldAddErr: (err) => {
    return {
      type: actions.CUSTOMFIELD_ADD_ERR,
      error: true,
      err,
    };
  },

  CustomFieldId: (CustomFieldIdData) => {
    return {
      type: actions.CUSTOMFIELD_ID,
      CustomFieldIdData,
    };
  },
  CustomFieldIdErr: (err) => {
    return {
      type: actions.CUSTOMFIELD_ID_ERR,
      err,
    };
  },
  CustomFieldDelete: (CustomFieldDeletedData) => {
    return {
      type: actions.CUSTOMFIELD_DELETED,
      CustomFieldDeletedData,
    };
  },
  CustomFieldDeleteErr: (err) => {
    return {
      type: actions.CUSTOMFIELD_DELETED_ERR,
      err,
    };
  },
  PattyCashList: (PattyCashList) => {
    return {
      type: actions.PATTY_CASH_LIST,
      PattyCashList,
    };
  },
  PattyCashListErr: (err) => {
    return {
      type: actions.PATTY_CASH_LIST_ERR,
      err,
    };
  },
  PaymnetTypeList: (PaymentTypeList) => {
    return {
      type: actions.PAYMENT_TYPE_LIST,
      PaymentTypeList,
    };
  },
  PaymnetTypeListErr: (err) => {
    return {
      type: actions.PAYMENT_TYPE_LIST_ERR,
      err,
    };
  },
  AddtionalList: (AddtionalList) => {
    return {
      type: actions.ADDTIONAL_LIST,
      AddtionalList,
    };
  },
  AddtionalListErr: (err) => {
    return {
      type: actions.ADDTIONAL_LIST_ERR,
      err,
    };
  },
  TagList: (TagList) => {
    return {
      type: actions.TAG_LIST,
      TagList,
    };
  },
  TagListErr: (err) => {
    return {
      type: actions.TAG_LIST_ERR,
      err,
    };
  },
};

export default actions;
