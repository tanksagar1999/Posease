const actions = {
  TAXES_ADD: "TAXES_ADD",
  TAXES_ADD_ERR: "TAXES_ADD_ERR",
  TAXES_LIST: "TAXES_LIST",
  TAXES_LIST_ERR: "TAXES_LIST_ERR",
  TAXES_ID: "TAXES_ID",
  TAXES_ID_ERR: "TAXES_ID_ERR",
  TAXES_DELETED: "TAXES_DELETED",
  TAXES_DELETED_ERR: "TAXES_DELETED_ERR",

  taxesAdd: (taxesData) => {
    return {
      type: actions.TAXES_ADD,
      taxesData,
    };
  },

  taxesAddErr: (err) => {
    return {
      type: actions.TAXES_ADD_ERR,
      err,
    };
  },
  taxesList: (taxesList) => {
    return {
      type: actions.TAXES_LIST,
      error: false,
      taxesList,
    };
  },
  taxesListErr: (err) => {
    return {
      type: actions.TAXES_LIST_ERR,
      error: true,
      err,
    };
  },
  taxesId: (taxesIdData) => {
    return {
      type: actions.TAXES_ID,
      taxesIdData,
    };
  },
  taxesIdErr: (err) => {
    return {
      type: actions.TAXES_ID_ERR,
      err,
    };
  },
  taxesDelete: (TaxesDeletedData) => {
    return {
      type: actions.TAXES_DELETED,
      TaxesDeletedData,
    };
  },
  taxesDeleteErr: (err) => {
    return {
      type: actions.TAXES_DELETED_ERR,
      err,
    };
  },
};

export default actions;
