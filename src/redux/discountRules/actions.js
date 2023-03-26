const actions = {
  DISCOUNTRULES_ADD: "DISCOUNTRULES_ADD",
  DISCOUNTRULES_ADD_ERR: "DISCOUNTRULES_ADD_ERR",
  DISCOUNTRULES_LIST: "DISCOUNTRULES_LIST",
  DISCOUNTRULES_LIST_ERR: "DISCOUNTRULES_LIST_ERR",
  DISCOUNTRULES_ID: "DISCOUNTRULES_ID",
  DISCOUNTRULES_ID_ERR: "DISCOUNTRULES_ID_ERR",
  DISCOUNTRULES_DELETED: "DISCOUNTRULES_DELETED",
  DISCOUNTRULES_DELETED_ERR: "DISCOUNTRULES_DELETED_ERR",

  DiscountRulesAdd: (DiscountRulesData) => {
    return {
      type: actions.DISCOUNTRULES_ADD,
      DiscountRulesData,
    };
  },

  DiscountRulesAddErr: (err) => {
    return {
      type: actions.DISCOUNTRULES_ADD_ERR,
      err,
    };
  },
  DiscountRulesList: (DiscountRulesList) => {
    return {
      type: actions.DISCOUNTRULES_LIST,
      DiscountRulesList,
    };
  },
  DiscountRulesListErr: (err) => {
    return {
      type: actions.DISCOUNTRULES_LIST_ERR,
      err,
    };
  },
  DiscountRulesId: (DiscountRulesIdData) => {
    return {
      type: actions.DISCOUNTRULES_ID,
      DiscountRulesIdData,
    };
  },
  DiscountRulesIdErr: (err) => {
    return {
      type: actions.DISCOUNTRULES_ID_ERR,
      err,
    };
  },
  DiscountRulesDelete: (DiscountRulesDeletedData) => {
    return {
      type: actions.DISCOUNTRULES_DELETED,
      DiscountRulesDeletedData,
    };
  },
  DiscountRulesDeleteErr: (err) => {
    return {
      type: actions.DISCOUNTRULES_DELETED_ERR,
      err,
    };
  },
};

export default actions;
