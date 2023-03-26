const actions = {
  CASHIERS_ADD: "CASHIERS_ADD",
  CASHIERS_ADD_ERR: "CASHIERS_ADD_ERR",
  CASHIERS_LIST: "CASHIERS_LIST",
  CASHIERS_LIST_ERR: "CASHIERS_LIST_ERR",
  CASHIERS_ID: "CASHIERS_ID",
  CASHIERS_ID_ERR: "CASHIERS_ID_ERR",
  CASHIERS_DELETED: "CASHIERS_DELETED",
  CASHIERS_DELETED_ERR: "CASHIERS_DELETED_ERR",

  cashiersAdd: (cashiersData) => {
    return {
      type: actions.CASHIERS_ADD,
      error: false,
      cashiersData,
    };
  },

  cashiersAddErr: (err) => {
    return {
      type: actions.CASHIERS_ADD_ERR,
      error: true,
      err,
    };
  },
  cashiersList: (cashiersList) => {
    return {
      type: actions.CASHIERS_LIST,
      cashiersList,
    };
  },
  cashiersListErr: (err) => {
    return {
      type: actions.CASHIERS_LIST_ERR,
      err,
    };
  },
  cashiersId: (cashiersIdData) => {
    return {
      type: actions.CASHIERS_ID,
      cashiersIdData,
    };
  },
  cashiersIdErr: (err) => {
    return {
      type: actions.CASHIERS_ID_ERR,
      err,
    };
  },
  cashiersDelete: (cashiersDeletedData) => {
    return {
      type: actions.CASHIERS_DELETED,
      cashiersDeletedData,
    };
  },
  cashiersDeleteErr: (err) => {
    return {
      type: actions.CASHIERS_DELETED_ERR,
      err,
    };
  },
};

export default actions;
